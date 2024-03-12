import {
  Pressable,
  View,
  Text,
  StyleSheet,
  Platform,
  ImageBackground,
  Image,
  Modal,
} from "react-native";

import { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../store/auth-context";


function BenefitsComponent({ title, id, icon }) {
  const [mode, setMode] = useState("");
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    setMode(authCtx.currentMode);
  }, [authCtx.currentMode]);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Ionicons name="checkmark-sharp" style={styles.icon} />
        <Text style={[styles.text,{ color: mode === "light" ? "#121212" : "#FFFAFA" }]}>{title}</Text>
      </View>
    </View>
  );
}

export default BenefitsComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center", // Center content horizontally
    justifyContent: "center", // Center content vertically
    marginLeft: 15,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center", // Center content horizontally
    justifyContent: "center",
    paddingVertical: 8,
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
    color: "#007AFF", 
  },
  text: {
    fontSize: 16,
    color: "#333",
    textAlign: "left",
    flex: 1, 
    fontFamily: "poppins",
  },
});
