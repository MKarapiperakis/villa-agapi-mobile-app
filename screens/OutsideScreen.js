import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { getOutsideSources } from "../constants/ImageSources";
import outsideImage from "../models/outsideImage";
import OutsideImageComponent from "../components/OutsideImageComponent";
import Benefit from "../models/benefit";
import BenefitsComponent from "../components/BenefitsComponent";
import { AuthContext } from "../store/auth-context";

function OutsideScreen() {
  const [mode, setMode] = useState("");
  const authCtx = useContext(AuthContext);

  const nav = useNavigation();
  useEffect(() => {
    nav.setOptions({
      headerStyle: {
        backgroundColor: mode === "light" ? "#FFFAFA" : "#121212",
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: mode === "light" ? "#000000" : "#ffffff", // Text color
    });
  }, [nav, mode]);

  useEffect(() => {
    setMode(authCtx.currentMode);
  }, [authCtx.currentMode]);

  function renderImageItem(itemData) {
    return (
      <OutsideImageComponent
        title={itemData.item.title}
        id={itemData.item.id}
      />
    );
  }

  function renderBenefitItem(itemData) {
    return (
      <BenefitsComponent
        title={itemData.item.title}
        id={itemData.item.id}
        icon={itemData.item.icon}
      />
    );
  }

  const OUTSIDE_IMAGES = [];
  const BENEFITS = [
    new Benefit("0", "Free parking"),
    new Benefit("1", "Private pool"),
    new Benefit("2", "Wifi (outside)"),
    new Benefit("3", "Barbecue"),
  ];

  for (let i = 0; i < getOutsideSources().length; i++) {
    OUTSIDE_IMAGES.push(new outsideImage(i.toString(), `outside${i + 1}`));
  }

  // if (loading) {
  //   return <LoadingOverlay backgroundColor={"#FFFAFA"} />;
  // }
  return (
    <ScrollView
      style={[
        styles.flatList,
        { backgroundColor: mode === "light" ? "#FFFAFA" : "#121212" },
      ]}
      showsVerticalScrollIndicator={false}
      onLoad={() => {}}
    >
      <FlatList
        showsVerticalScrollIndicator={false}
        data={OUTSIDE_IMAGES}
        keyExtractor={(item) => item.id}
        renderItem={renderImageItem}
        numColumns={2}
        scrollEnabled={false}
      />
      <Text
        style={[styles.hr, { color: mode === "light" ? "#121212" : "#FFFAFA" }]}
      >
        Amenities
      </Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={BENEFITS}
        keyExtractor={(item2) => item2.id}
        renderItem={renderBenefitItem}
        numColumns={2}
        scrollEnabled={false}
      />
      <View
        style={StyleSheet.create({
          marginBottom: 25,
        })}
      ></View>
    </ScrollView>
  );
}

export default OutsideScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 2,
  },
  hr: {
    marginTop: 10,
    marginHorizontal: 30,
    textAlign: "center",
    fontFamily: "poppins",
    padding: 5,
    marginVertical: 5,
    fontSize: 22,
  },
  title: {
    marginHorizontal: 30,
    textAlign: "center",
    fontFamily: "poppins",
    padding: 5,
    marginVertical: 5,
    fontSize: 22,
  },
  flatList: {
    flex: 1,
    paddingHorizontal: 6, // Add padding to space them out from the edges if needed.
    padding: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "white",
  },
});
