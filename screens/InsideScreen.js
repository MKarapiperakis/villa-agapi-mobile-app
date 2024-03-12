import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Modal,
  Dimensions,
  ScrollView,
} from "react-native";
import { useContext, useEffect, useState } from "react";

import { getInsideSources } from "../constants/ImageSources";
import insideImage from "../models/insideImage";
import InsideImageComponent from "../components/InsideImageComponent";
import Benefit from "../models/benefit";
import BenefitsComponent from "../components/BenefitsComponent";
import { AuthContext } from "../store/auth-context";

const { height, width } = Dimensions.get("window");

function InsideScreen() {
  const [mode, setMode] = useState("");
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    setMode(authCtx.currentMode);
  }, [authCtx.currentMode]);

  function renderImageItem(itemData) {
    return (
      <InsideImageComponent title={itemData.item.title} id={itemData.item.id} />
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

  const INSIDE_IMAGES = [];
  const BENEFITS = [
    new Benefit("0", "Workspace"),
    new Benefit("1", "Air conditioning"),
    new Benefit("2", "Iron"),
    new Benefit("3", "Safe"),
    new Benefit("4", "Wifi"),
    new Benefit("5", "TV "),
    new Benefit("6", "Washing machine"),
    new Benefit("7", "Dishwasher"),
    new Benefit("8", "Essentials"),
    new Benefit("9", "Bed linens"),
    new Benefit("10", "Smoke alarm"),
    new Benefit("11", "Oven"),
    new Benefit("12", "Clothing storage"),
    new Benefit("13", "Fire extinguisher"),
    new Benefit("14", "Two Bathrooms"),
    new Benefit("15", "Fireplace"),
    new Benefit("16", "Bathtub"),
    new Benefit("17", "Hair dryer"),
    new Benefit("18", "Hot water"),
    new Benefit("19", "Coffee machine"),
    new Benefit("20", "Baby highchair"),
    new Benefit("21", "Baby Cot"),
    new Benefit("22", "DVD player"),
    new Benefit("23", "Toaster"),
  ];

  const BEDROOMS = [
    new Benefit("24", "No1: Double Bed Bedroom"),
    new Benefit("25", "No2: Double Bed Bedroom"),
    new Benefit("26", "Single Bed Bedroom"),
    new Benefit("27", "Single Bed Open-Plan Bedroom"),
    new Benefit("28", "Baby Cot (2) on Request (Free)"),
  ];

  const CLEANING = [
    new Benefit("29", "Garden - Swimming pool: Every day"),
    new Benefit("30", "Room: Every three days"),
    new Benefit("31", "Towels: Every three days"),
    new Benefit("32", "Pool Towels: Every three days"),
    new Benefit("33", "Sheets: Every three days"),
  ];

  for (let i = 0; i < getInsideSources().length; i++) {
    INSIDE_IMAGES.push(new insideImage(i.toString(), `inside${i + 1}`));
  }

  return (
    <ScrollView
      style={[
        styles.flatList,
        { backgroundColor: mode === "light" ? "#FFFAFA" : "#121212" },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <FlatList
        showsVerticalScrollIndicator={false}
        data={INSIDE_IMAGES}
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
        numColumns={width > 600 ? 4 : 2}
        scrollEnabled={false}
      />

      <Text
        style={[styles.hr, { color: mode === "light" ? "#121212" : "#FFFAFA" }]}
      >
        Bed Rooms (7 people)
      </Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={BEDROOMS}
        keyExtractor={(item2) => item2.id}
        renderItem={renderBenefitItem}
        numColumns={width > 600 ? 2 : 1}
        scrollEnabled={false}
      />

      <Text
        style={[styles.hr, { color: mode === "light" ? "#121212" : "#FFFAFA" }]}
      >
        Cleaning
      </Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={CLEANING}
        keyExtractor={(item2) => item2.id}
        renderItem={renderBenefitItem}
        numColumns={width > 600 ? 2 : 1}
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

export default InsideScreen;

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
  },
});
