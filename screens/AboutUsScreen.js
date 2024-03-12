import React, { useState, useContext, useEffect } from "react";
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import i18n from "../translations/i18n";
import { AuthContext } from "../store/auth-context";

function AboutUsScreen() {
  const authCtx = useContext(AuthContext);
  const [locale, setLocale] = useState(authCtx.currentLocale.toLowerCase());
  const [mode, setMode] = useState("");
  useEffect(() => {
    setLocale(authCtx.currentLocale.toLowerCase());
  }, [authCtx.currentLocale]);

  useEffect(() => {
    setMode(authCtx.currentMode);
  }, [authCtx.currentMode]);

  i18n.locale = locale;

  const handleIconPress = (url) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: mode === "light" ? "#FFFAFA" : "#121212" },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: authCtx.currentMode == "light" ? "black" : "#F5FFFA" },
        ]}
      >
        {i18n.t("about_us.title")}{" "}
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text
          style={[
            styles.description,
            { color: authCtx.currentMode == "light" ? "black" : "#F5FFFA" },
          ]}
        >
          {i18n.t("about_us.text")}
        </Text>
      </ScrollView>
      <View style={styles.footer}>
        {/* Render your local images here */}
        <TouchableOpacity
          onPress={() =>
            handleIconPress(
              "https://www.facebook.com/p/Villa-Agapi-100054240770668/?paipv=0&eav=AfZRntAZ263kaZ9hPjLvxhHGojp5CyUmnUh0DbHUz9nlEstuVk2PDCf4hhikvLiJnNA&_rdr"
            )
          }
        >
          <Image
            source={require("../assets/logos/facebook.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            handleIconPress(
              "https://www.tripadvisor.com/Hotel_Review-g651971-d3494112-Reviews-Villa_Agapi-Episkopi_Crete.html"
            )
          }
        >
          <Image
            source={require("../assets/logos/tripadvisor.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            handleIconPress(
              "https://www.airbnb.gr/rooms/751980570284476074?adults=1&children=0&enable_m3_private_room=true&infants=0&pets=0&check_in=2024-04-30&check_out=2024-05-05&source_impression_id=p3_1707230359_bZ8v8nExRg1EQQCa&previous_page_section_name=1000&federated_search_id=81a23195-0e8f-481c-b24b-ad20b5a4c510"
            )
          }
        >
          <Image
            source={require("../assets/logos/airbnb.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            handleIconPress(
              "https://www.booking.com/hotel/gr/villa-agapi-episcopi.el.html"
            )
          }
        >
          <Image
            source={require("../assets/logos/booking.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const width = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 2,
    paddingTop: 10,
    elevation: 55,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.55,
    shadowRadius: 4,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  title: {
    fontSize: width > 600 ? 31 : 23,
    fontFamily: "poppinsBold",
    marginVertical: 11,
  },
  description: {
    fontSize: width > 600 ? 24 : 17,
    textAlign: "justify",
    paddingHorizontal: 20,
    fontFamily: "poppins",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: "100%",
  },
  footerIcon: {
    width: width > 600 ? 71 : 41,
    height: width > 600 ? 71 : 41,
    resizeMode: "contain",
    borderRadius: 6,
  },
});

export default AboutUsScreen;
