import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // You can choose an icon library and icon of your choice
import Flag from "react-native-flags";

function Locale({ onFlagChange, flex }) {
  const [showFlags, setShowFlags] = useState(false);

  const toggleFlagOptions = () => {
    setShowFlags(!showFlags);
  };

  const handleFlagClick = (flag) => {
    onFlagChange(flag);
    setShowFlags(!showFlags);
  };

  return (
    <View style={[styles.rootScreen, { flex: flex }]}>
      <TouchableOpacity onPress={toggleFlagOptions}>
        <Icon
          name="earth" // Replace with the actual icon names
          size={26}
          color="white" // Replace with your desired color
        />
      </TouchableOpacity>

      {showFlags && (
        <View style={styles.flags}>
          <TouchableOpacity onPress={() => handleFlagClick("GR")}>
            <Flag code="GR" size={32} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFlagClick("GB")}>
            <Flag code="GB" size={32} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFlagClick("DE")}>
            <Flag code="DE" size={32} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default Locale;

const deviceHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  rootScreen: {
    padding: deviceHeight < 780 ? 15 : 6,
    textAlign: "center",
  },
  flags: {
    flexDirection: "column",
    // backgroundColor: '#1A1A1A',
    marginTop: deviceHeight < 780 ? 15 : 8,
    // paddingHorizontal: 5,
  },
});
