import { StyleSheet, Text, View, Dimensions, Image } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { MarkersRequestById } from "../api/MarkersRequestById";
import { getAddress, calculateDistance } from "../util/location";
import { getMarkerSources } from "../constants/ImageSources";
import i18n from "../translations/i18n";
import { AuthContext } from "../store/auth-context";
import { useNavigation } from "@react-navigation/native";
function MarkerScreen({ route }) {
  const { id } = route.params;
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [markerAddress, setMarkerAddress] = useState("");
  const [distance, setDistance] = useState("");
  const [imageSource, setImageSource] = useState(null);
  const [loading, setLoading] = useState("true");
  const typeImageMapping = {
    food: require("../assets/images/markers/food.jpg"),
    fastFood: require("../assets/images/markers/fast-food.jpg"),
    drink: require("../assets/images/markers/drink.jpg"),
    bank: require("../assets/images/markers/bank.jpg"),
    activities: require("../assets/images/markers/activities.jpg"),
    market: require("../assets/images/markers/market.jpg"),
    monuments: require("../assets/images/markers/monuments.jpg"),
    health: require("../assets/images/markers/health.jpg"),
    gas_station: require("../assets/images/markers/gas_station.jpg"),
    beach: require("../assets/images/markers/beach.jpg"),
  };
  const [mode, setMode] = useState("");
  const authCtx = useContext(AuthContext);

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

  const getMarker = async () => {
    try {
      const response = await MarkersRequestById(id);
      let res = response.marker[0];
      setLatitude(res.latitude);
      setLongitude(res.longitude);
      setTitle(res.title);
      setType(res.type);

      let markerAddress = await getAddress(res.latitude, res.longitude);

      setMarkerAddress(markerAddress);

      let distance = await calculateDistance(
        res.latitude,
        res.longitude,
        35.26335507678177,
        25.238502809890747
      );

      setDistance(distance);

      setLoading(false);
    } catch (error) {
      console.log("error retrieving markers: ", error);
    }
  };

  useEffect(() => {
    getMarker();
    setImageSource(null);
  }, [id]);

  useEffect(() => {
    setImageSource(typeImageMapping[type]);
  }, [type]);

  useEffect(() => {
    setMode(authCtx.currentMode);
  }, [authCtx.currentMode]);

  if (!title && !markerAddress && !distance)
    return (
      <LoadingOverlay
        backgroundColor={mode === "light" ? "#FFFAFA" : "#121212"}
      />
    );

  if (loading)
    return (
      <LoadingOverlay
        backgroundColor={mode === "light" ? "#FFFAFA" : "#121212"}
      />
    );

  return (
    <View style={styles.container}>
      {!loading && <Image style={styles.image} source={imageSource} />}

      {!!title && !!markerAddress && !!distance && (
        <View
          style={[
            styles.detailContainer,
            { backgroundColor: mode === "light" ? "#FFFAFA" : "#121212" },
          ]}
        >
          <Text style={[styles.header, { color: mode === "light" ? "#121212" : "#FFFAFA" },]}>{title}</Text>

          <Text style={[styles.label,{ color: mode === "light" ? "#121212" : "#FFFAFA" }]}>
            {i18n.t(`markers.address`)}
            {markerAddress}
          </Text>

          <Text style={[styles.label,{ color: mode === "light" ? "#121212" : "#FFFAFA" }]}>
            {i18n.t(`markers.distance`)} {distance}
          </Text>
        </View>
      )}
    </View>
  );
}

export default MarkerScreen;
const width = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: width,
    height: width / 1.4,
  },
  header: {
    fontSize: 32,
    fontFamily: "poppinsBold",
    marginBottom: 5,
  },
  subheader: {
    fontSize: 22,
    fontFamily: "poppins",
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
  },
  detailContainer: {
    justifyContent: "center", // Adjust this to control the spacing between the duration sections.
    alignItems: "center", // Vertically align children in the middle.
    paddingHorizontal: 16, // Add padding to space them out from the edges if needed.
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "white",
    flex: 1,
  },
  label: {
    fontFamily: "poppins",
    color: "#000000",
    fontSize: 18,
    textAlign: "center",
    margin: 15,
  },
});
