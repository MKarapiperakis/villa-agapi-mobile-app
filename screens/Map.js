import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Keyboard, 
  Platform
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import MapView, { Marker, Callout } from "react-native-maps"; // Removed Cluster as it might be causing issues
import { Ionicons } from "@expo/vector-icons";
import MapV from "react-native-map-clustering";
import { MarkersRequest } from "../api/MarkersRequest";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import ModalWindow from "../components/ui/ModalWindow";
import { AuthContext } from "../store/auth-context";

const height = Dimensions.get("window").height;

function Map() {
  const [filterText, setFilterText] = useState("");
  const [filterBarVisible, setFilterBarVisible] = useState(false);
  const [pins, setPins] = useState([]);
  const [filterBarHeight, setFilterBarHeight] = useState(height / 5);
  const [modalShow, setModalShow] = useState(false);
  const [mode, setMode] = useState("");
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    setMode(authCtx.currentMode);
  }, [authCtx.currentMode]);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: mode === "light" ? "#FFFAFA" : "#121212",
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: mode === "light" ? "#000000" : "#ffffff",
    });
  }, [navigation, mode]);

  const INITIAL_REGION = {
    latitude: 35.26335507678177,
    longitude: 25.238502809890747,
    latitudeDelta: 0.6,
    longitudeDelta: 0.6,
  };

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "All", value: "All" },
    { label: "Food", value: "Food" },
    { label: "Bank", value: "Bank" },
    { label: "Drink", value: "Drink" },
    { label: "Beach", value: "Beach" },
    { label: "Health", value: "Health" },
    { label: "Markets", value: "Markets" },
    { label: "Monuments", value: "Monuments" },
    { label: "Activities", value: "Activities" },
    { label: "Gas Station", value: "Gas Station" },
  ]);

  const toggleFilterBar = () => {
    setFilterBarVisible(!filterBarVisible);
  };

  const getMarkers = async () => {
    try {
      const response = await MarkersRequest();
      let markers = response.markers.map((item) => ({
        id: item.id,
        latitude: item.latitude,
        longitude: item.longitude,
        title: item.title,
        type: item.type,
        icon: item.icon,
        keyWords: item.keyWords,
      }));
      setPins(markers);
    } catch (error) {
      console.log("Error retrieving markers: ", error);
      showModal();
    }
  };

  const closePicker = () => {
    setOpen(false);
  };

  const handleMarkerPress = (id) => {
    navigation.navigate("Details", { id });
  };

  useEffect(() => {
    getMarkers();
  }, []);

  useEffect(() => {
    closePicker();
    setFilterBarHeight(height / 5);
  }, [filterText]);

  function showModal() {
    setModalShow(true);
  }

  function hideModal() {
    setModalShow(false);
    navigation.navigate("Locations");
  }

  const filteredMarkers = pins.filter(
    (marker) =>
      marker.keyWords &&
      (marker.keyWords.some((keyword) =>
        filterText.toLowerCase().includes(keyword.toLowerCase())
      ) ||
        marker.type === filterText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {modalShow && (
        <View style={{ flex: 1 }}>
          <ModalWindow
            onButtonClick={hideModal}
            text="Map is unavailable at this moment, please check your internet connection or try again later!"
          />
        </View>
      )}

      <TouchableOpacity style={[styles.toggleButton, { backgroundColor: mode === "light" ? "#FFFAFA" : "#121212" }]} onPress={toggleFilterBar}>
        <Ionicons
          name={filterBarVisible ? "caret-up-outline" : "caret-down-outline"}
          size={24}
          color= {mode === "light" ? "#121212" : "#FFFAFA" }
        />
      </TouchableOpacity>

      {filterBarVisible && (
        <View style={[{ ...styles.filterBar, height: filterBarHeight }, { backgroundColor: mode === "light" ? "#FFFAFA" : "#121212" }]}>
          <View style={styles.filterBar2}>
            <TextInput
              style={[styles.input, {color: mode === "light" ? "#121212" : "#FFFAFA"} ]}
              placeholder="What are you looking for?"
              placeholderTextColor="#E7D9D6"
              value={filterText}
              onChangeText={(text) => {
                setFilterText(text);
                setValue(null);
              }}
              autoCompleteType="off"
            />
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => {
                setFilterText("");
                setValue(null);
              }}
            >
              <Ionicons name="close-circle-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>

          <View>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={(newOpen) => {
                setOpen(newOpen);
                setFilterBarHeight(newOpen ? height / 2 : height / 5);
                Keyboard.dismiss();
              }}
              setValue={setValue}
              setItems={setItems}
              placeholder="Or search directly"
              style={[styles.dropdown,{backgroundColor: mode === "light" ? "#FFFAFA" : "#121212"}]}
              textStyle={[styles.dropdownText,{color: mode === "light" ? "#121212" : "#FFFAFA"}]}
              arrowStyle={[styles.dropdownArrow]}
              arrowIconStyle={[styles.dropdown]}
              dropDownContainerStyle={[styles.dropDownContainer,{backgroundColor: mode === "light" ? "#FFFAFA" : "#121212"}]}
              onChangeValue={(value) => {
                if (value != null) setFilterText(value);
              }}
            />
          </View>
        </View>
      )}

      {Platform.OS === "android" && (
        <MapV
        initialRegion={INITIAL_REGION}
        style={styles.map}
        provider="google"
        //showsUserLocation={true}
        //showsMyLocationButton={true}
        showsCompass={true}
        showsTraffic={true}
        showsBuildings={false}
        showsIndoors={true}
        minZoomLevel={0}
        maxZoomLevel={20}
        rotateEnabled={true}
        scrollEnabled={true}
        loadingEnabled={true}
      >
        {filteredMarkers.length > 0
          ? filteredMarkers.map((marker) => (
              <Marker
                key={marker.id}
                tracksViewChanges={false}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                title={marker.title}
              >
                <Ionicons name={marker.icon} size={31} color="#4169E1" />
                <Callout
                  onPress={() => handleMarkerPress(marker.id)}
                  style={styles.markerPin}
                >
                  <Text style={styles.pinText}>{marker.title}</Text>
                </Callout>
              </Marker>
            ))
          : pins.map((pin) => (
              <Marker
                key={pin.id}
                tracksViewChanges={false}
                coordinate={{
                  latitude: pin.latitude,
                  longitude: pin.longitude,
                }}
                title={pin.title}
              >
                <Ionicons name={pin.icon} size={31} color="#4169E1" />
                <Callout
                  onPress={() => handleMarkerPress(pin.id)}
                  style={styles.markerPin}
                >
                  <Text style={styles.pinText}>{pin.title}</Text>
                </Callout>
              </Marker>
            ))}
      </MapV>
      )}
      {Platform.OS === "ios" && (
         <MapV
         initialRegion={INITIAL_REGION}
         style={styles.map}

         //showsUserLocation={true}
         //showsMyLocationButton={true}
         showsCompass={true}
         showsTraffic={true}
         showsBuildings={false}
         showsIndoors={true}
         minZoomLevel={0}
         maxZoomLevel={20}
         rotateEnabled={true}
         scrollEnabled={true}
         loadingEnabled={true}
       >
         {filteredMarkers.length > 0
           ? filteredMarkers.map((marker) => (
               <Marker
                 key={marker.id}
                 tracksViewChanges={false}
                 coordinate={{
                   latitude: marker.latitude,
                   longitude: marker.longitude,
                 }}
                 title={marker.title}
               >
                 <Ionicons name={marker.icon} size={31} color="#4169E1" />
                 <Callout
                   onPress={() => handleMarkerPress(marker.id)}
                   style={styles.markerPin}
                 >
                   <Text style={styles.pinText}>{marker.title}</Text>
                 </Callout>
               </Marker>
             ))
           : pins.map((pin) => (
               <Marker
                 key={pin.id}
                 tracksViewChanges={false}
                 coordinate={{
                   latitude: pin.latitude,
                   longitude: pin.longitude,
                 }}
                 title={pin.title}
               >
                 <Ionicons name={pin.icon} size={31} color="#4169E1" />
                 <Callout
                   onPress={() => handleMarkerPress(pin.id)}
                   style={styles.markerPin}
                 >
                   <Text style={styles.pinText}>{pin.title}</Text>
                 </Callout>
               </Marker>
             ))}
       </MapV>
      )}
     
    </View>
  );
}

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  filterBar: {
    flexDirection: "column",
    padding: 10,
    backgroundColor: "#fff",
    elevation: 3,
  },
  filterBar2: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginRight: 10,
    fontSize: 13,
    fontFamily: "poppins",
  },
  filterButton: {
    padding: 5,
    borderRadius: 5,
  },
  toggleButton: {
    alignItems: "center",
    backgroundColor: "#fff",
    elevation: 3,
    paddingVertical: 5,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    maxHeight: 20,
  },
  dropdownText: {
    fontSize: 13,
    color: "#000",
    fontFamily: "poppins",
  },
  dropdownArrow: {
    backgroundColor: "#fff",
  },
  dropDownContainer: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    height: 150,
  },
  markerPin: {
    flex: 1,
    width: 70,
    textAlign: "center",
    justifyContent: "center",
  },
  pinText: {
    fontSize: 13,
    textAlign: "center",
    flex: 1,
    fontFamily: "poppins",
  },
});
