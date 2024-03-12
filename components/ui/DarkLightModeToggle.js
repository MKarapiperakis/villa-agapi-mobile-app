import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // You can choose an icon library and icon of your choice

function DarkLightModeToggle({ currentMode, onModeChange }) {
  const toggleDarkLightMode = () => {
    const newMode = currentMode === "dark" ? "light" : "dark";
    onModeChange(newMode);
  };
  
  

  return (
    <View style={styles.rootScreen}>
      <TouchableOpacity onPress={toggleDarkLightMode}>
        <Icon
          name={currentMode === "light" ? "sunny-outline" : "moon-outline"} // Replace with the actual icon names
          size={33}
          color="white" // Replace with your desired color
        />
      </TouchableOpacity>
    </View>
  );
}

export default DarkLightModeToggle;
const deviceHeight = Dimensions.get("window").height;


const styles = StyleSheet.create({
  rootScreen: {
    // flex: 1,
    padding: deviceHeight < 780 ? 15 : 5
  },
});
