import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import i18n from "../translations/i18n";
import { AuthContext } from "../store/auth-context";

function LocationItemScreen({ route, navigation }) {
  const { id, region, imageURL } = route.params;


  const [mode, setMode] = useState("");
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    setMode(authCtx.currentMode);
    navigation.setOptions({ title: i18n.t(`locations.${region}.box${id}.title`) });
  }, [authCtx.currentMode]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: mode === "light" ? "#FFFAFA" : "#121212" },
      ]}
    >
      <Image style={styles.image} source={imageURL} />
  
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.detailContainer}>
          <Text
            style={[
              styles.text,
              { color: mode === "light" ? "#121212" : "#FFFAFA" },
            ]}
          >
            {i18n.t(`locations.${region}.box${id}.text`)}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default LocationItemScreen;
const width = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "#FFFAFA",
    flex: 1,
  },
  image: {
    width: width,
    height: width / 1.6,
  },
  header: {
    fontSize: 32,
    fontFamily: "poppinsBold",
    marginBottom: 5,
  },

  text: {
    fontSize: width > 600 ? 24 : 17,
    marginBottom: 10,
    textAlign: "justify",
    fontFamily: "openSans",
    marginHorizontal: 5
  },
  detailContainer: {
    alignItems: "center", // Vertically align children in the middle.
    padding: 10
  },
});
