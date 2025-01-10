import { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  FlatList,
  ImageBackground,
  Pressable,
  Dimensions,
} from "react-native";
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from "expo-location";

import { AuthContext } from "../store/auth-context";
import IconButton from "../components/ui/IconButton";
import { useNavigation } from "@react-navigation/native";
import ModalWindow from "../components/ui/ModalWindow";
import i18n from "../translations/i18n";

function LocationsScreen() {
  const [currentRegion, setCurrentRegion] = useState("crete");
  const [mode, setMode] = useState("");
  const [selectedAction, setSelectedAction] = useState("list");
  const [modalShow, setModalShow] = useState(false);
  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: mode === "light" ? "#FFFAFA" : "#121212",
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: mode === "light" ? "#000000" : "#ffffff", // Text color
    });
  }, [navigation, mode]);

  const data = [
    { id: "1", image: require("../assets/images/categories/locations.jpg") },
    { id: "2", image: require("../assets/images/locations/koules.jpg") },
    { id: "3", image: require("../assets/images/locations/museum.jpg") },
    { id: "4", image: require("../assets/images/locations/Morosini.jpg") },
  ];

  const data2 = [
    { id: "1", image: require("../assets/images/locations/fortetza.jpg") },
    { id: "2", image: require("../assets/images/locations/arkadi.jpg") },
    { id: "3", image: require("../assets/images/locations/garden.jpg") },
    { id: "4", image: require("../assets/images/locations/rimondi.jpg") },
  ];

  const data3 = [
    { id: "1", image: require("../assets/images/locations/harbour.jpg") },
    { id: "2", image: require("../assets/images/locations/venizelos.jpg") },
    { id: "3", image: require("../assets/images/locations/market.jpg") },
    { id: "4", image: require("../assets/images/locations/maritime.jpg") },
  ];

  const data4 = [
    { id: "1", image: require("../assets/images/locations/vai.jpg") },
    { id: "2", image: require("../assets/images/locations/dikteon-cave.jpg") },
    { id: "3", image: require("../assets/images/locations/selinari.jpg") },
    { id: "4", image: require("../assets/images/locations/spinaloga.jpg") },
  ];

  const mapData = [
    { crete: require("../assets/images/locations/crete_map2.png") },
    { iraklion: require("../assets/images/locations/irakleio_map.png") },
    { chania: require("../assets/images/locations/chania_map.png") },
    { rethimno: require("../assets/images/locations/rethimno_map.png") },
    { lasithi: require("../assets/images/locations/lasithi_map.png") },
  ];

  const authCtx = useContext(AuthContext);
  const [locale, setLocale] = useState(authCtx.currentLocale.toLowerCase());

  useEffect(() => {
    setLocale(authCtx.currentLocale.toLowerCase());
  }, [authCtx.currentLocale]);

  useEffect(() => {
    setMode(authCtx.currentMode);
  }, [authCtx.currentMode]);

  i18n.locale = locale;

  async function list() {
    setSelectedAction("list");
  }

  function showModal() {
    setModalShow(true);
  }

  function hideModal() {
    setModalShow(false);
  }

  function onPress(id, region, imageURL) {
    navigation.navigate("Information", { id, region, imageURL });
  }

  async function map() {
    const hasPermission = await requestGeolocationPermission();

    if (hasPermission) navigation.navigate("Map");
    // navigation.navigate("Map");
  }

  async function requestGeolocationPermission() {
    if (
      locationPermissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (locationPermissionInformation.status === PermissionStatus.DENIED) {
      showModal();
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    return true;
  }

  return (
    <View
      style={[
        styles.rootContainer,
        { backgroundColor: mode === "light" ? "#FFFAFA" : "#121212" },
      ]}
    >
      {modalShow && (
        <View style={StyleSheet.create((flex = 1))}>
          <ModalWindow
            onButtonClick={hideModal}
            text="You need to grant location permissions!"
          ></ModalWindow>
        </View>
      )}
      <View style={styles.actions}>
        <View
          style={
            selectedAction === "list"
              ? styles.selectedAction
              : styles.notSelectedAction
          }
        >
          <IconButton
            icon="list"
            size={30}
            onPress={list}
            style={styles.selected}
          ></IconButton>
        </View>

        <View
          style={
            selectedAction === "map"
              ? styles.selectedAction
              : styles.notSelectedAction
          }
        >
          <IconButton
            icon="map"
            size={30}
            color={mode === "light" ? "#121212" : "#FFFAFA"}
            onPress={map}
          ></IconButton>
        </View>
      </View>
      {/* <Image style={styles.image} source={mapData.crete} />    */}
      <Image
        style={styles.image}
        source={
          mapData.find((region) => region[currentRegion])?.[currentRegion]
        }
      />
      <ScrollView
        style={styles.scrollViewContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {/* IRAKLEIO */}
        <ScrollView style={styles.scrollViewDetails}>
          <Text
            style={[
              styles.header,
              { color: mode === "light" ? "#121212" : "#FFFAFA" },
            ]}
          >
            {i18n.t(`locations.Heraklion.name`)}
          </Text>
          <FlatList
            onScroll={() => {
              setCurrentRegion("iraklion");
            }}
            data={data}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <ImageBackground
                source={item.image}
                resizeMode="cover"
                style={styles.gridItem}
              >
                <Pressable
                  android_ripple={{ color: "#ccc" }}
                  style={({ pressed }) => [
                    styles.button,
                    pressed ? styles.buttonPressed : null,
                  ]}
                  onPress={() => onPress(item.id, "Heraklion", item.image)}
                ></Pressable>
                <View style={styles.container}>
                  <Text style={styles.title}>
                    {i18n.t(`locations.Heraklion.box${item.id}.title`)}
                  </Text>
                </View>
              </ImageBackground>
            )}
          />
        </ScrollView>
        {/* RETHIMNO */}
        <ScrollView style={styles.scrollViewDetails}>
          <Text
            style={[
              styles.header,
              { color: mode === "light" ? "#121212" : "#FFFAFA" },
            ]}
          >
            {i18n.t(`locations.Rethimno.name`)}
          </Text>
          <FlatList
            onScroll={() => {
              setCurrentRegion("rethimno");
            }}
            data={data2}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <ImageBackground
                source={item.image}
                resizeMode="cover"
                style={styles.gridItem}
              >
                <Pressable
                  android_ripple={{ color: "#ccc" }}
                  style={({ pressed }) => [
                    styles.button,
                    pressed ? styles.buttonPressed : null,
                  ]}
                  onPress={() => onPress(item.id, "Rethimno", item.image)}
                ></Pressable>
                <View style={styles.container}>
                  <Text style={styles.title}>
                    {i18n.t(`locations.Rethimno.box${item.id}.title`)}
                  </Text>
                </View>
              </ImageBackground>
            )}
          />
        </ScrollView>
        {/* CHANIA */}
        <ScrollView style={styles.scrollViewDetails}>
          <Text
            style={[
              styles.header,
              { color: mode === "light" ? "#121212" : "#FFFAFA" },
            ]}
          >
            {i18n.t(`locations.Chania.name`)}
          </Text>
          <FlatList
            onScroll={() => {
              setCurrentRegion("chania");
            }}
            data={data3}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <ImageBackground
                source={item.image}
                resizeMode="cover"
                style={styles.gridItem}
              >
                <Pressable
                  android_ripple={{ color: "#ccc" }}
                  style={({ pressed }) => [
                    styles.button,
                    pressed ? styles.buttonPressed : null,
                  ]}
                  onPress={() => onPress(item.id, "Chania", item.image)}
                ></Pressable>
                <View style={styles.container}>
                  <Text style={styles.title}>
                    {i18n.t(`locations.Chania.box${item.id}.title`)}
                  </Text>
                </View>
              </ImageBackground>
            )}
          />
        </ScrollView>
        {/* LASITHI */}
        <ScrollView style={styles.scrollViewDetails}>
          <Text
            style={[
              styles.header,
              { color: mode === "light" ? "#121212" : "#FFFAFA" },
            ]}
          >
            {i18n.t(`locations.Lasithi.name`)}
          </Text>
          <FlatList
            onScroll={() => {
              setCurrentRegion("lasithi");
            }}
            data={data4}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <ImageBackground
                source={item.image}
                resizeMode="cover"
                style={styles.gridItem}
              >
                <Pressable
                  android_ripple={{ color: "#ccc" }}
                  style={({ pressed }) => [
                    styles.button,
                    pressed ? styles.buttonPressed : null,
                  ]}
                  onPress={() => onPress(item.id, "Lasithi", item.image)}
                ></Pressable>
                <View style={styles.container}>
                  <Text style={styles.title}>
                    {i18n.t(`locations.Lasithi.box${item.id}.title`)}
                  </Text>
                </View>
              </ImageBackground>
            )}
          />
        </ScrollView>
      </ScrollView>
      <View
        style={StyleSheet.create({
          marginBottom: 35,
        })}
      ></View>
    </View>
  );
}

export default LocationsScreen;
const width = Dimensions.get("window").width;
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    // borderRadius: 4
  },
  selectedAction: {
    backgroundColor: "#E9DEDC",
    padding: 10,
    borderRadius: 11
  },
  notSelectedAction: {
    padding: 10,
  },
  header: {
    fontSize: 22,
    fontFamily: "poppinsBold",
    margin: 10,
    padding: 5,
  },
  gridItem: {
    flex: 1,
    margin: 5,
    height: 170,
    width: 250,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    overflow: "hidden",
  },
  button: {
    flex: 1,
  },
  buttonPressed: {
    opacity: 0.5,
  },
  container: {
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Set the background color with opacity
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 1,
  },
  title: {
    fontSize: 17,
    color: "white",
    marginHorizontal: 3,
    textAlign: "center",
    fontFamily: "poppins",
  },
  scrollViewContainer: {
    flexDirection: "column", // Stack the ScrollView components vertically
    marginTop: 5,
  },
  scrollViewDetails: {
    marginHorizontal: 7,
  },
  image: {
    width: width,
    height: width > 600 ? 300 : 130,
  },
});
