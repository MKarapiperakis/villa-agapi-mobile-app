import React, { useState, useContext, useEffect } from "react";
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  Image,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { AuthContext } from "../store/auth-context";
import i18n from "../translations/i18n";

function AboutUsScreen() {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const [locale, setLocale] = useState(authCtx.currentLocale.toLowerCase());
  const [mode, setMode] = useState(authCtx.currentMode);

  useEffect(() => {
    setLocale(authCtx.currentLocale.toLowerCase());
  }, [authCtx.currentLocale]);

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

  i18n.locale = locale;

  const handleIconPress = (url) => {
    Linking.openURL(url);
  };

  return (
    <ParallaxScrollView
      mode={mode}
      headerImage={
        <Image
          source={require("../assets/images/outside/outside2.jpg")}
          style={styles.reactLogo}
        />
      }
    >
      <View style={styles.container}>
        <Text
          style={[
            styles.description,
            { color: mode === "light" ? "black" : "#F5FFFA" },
          ]}
        >
          {i18n.t("about_us.text")}
        </Text>
      </View>
    </ParallaxScrollView>

  );
}

const width = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 2,
    paddingTop: 1,
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
  description: {
    fontSize: width > 600 ? 24 : 17,
    textAlign: "justify",
    paddingHorizontal: 2,
    fontFamily: "poppins",
  },
  reactLogo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default AboutUsScreen;
