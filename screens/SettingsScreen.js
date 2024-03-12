import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";

import { AuthContext } from "../store/auth-context";
import Locale from "../components/ui/Locale";
import i18n from "../translations/i18n";
import DarkLightModeToggle from "../components/ui/DarkLightModeToggle";

function SettingsScreen() {
  const authCtx = useContext(AuthContext);
  const [mode, setMode] = useState("#121212");
  const [locale, setLocale] = useState("");
  const [currentMode, setCurrentMode] = useState("dark");

  const handleFlagChange = (flag) => {
    authCtx.changeLocale(flag);
    setLocale(flag);
  };

  const handleModeChange = (mode) => {
    setMode(mode);
    authCtx.changeMode(mode);
  };

  useEffect(() => {
    setMode(authCtx.currentMode);
    if (authCtx.currentMode === "light") setMode("#FFFAFA");
    else setMode("#121212");
    setCurrentMode(authCtx.currentMode == "" ? "dark" : authCtx.currentMode);
  }, [authCtx.currentMode]);

  useEffect(() => {
    if (authCtx.currentLocale == "EN" || authCtx.currentLocale == "en")
      setLocale("gb");
    else setLocale(authCtx.currentLocale);
  }, [authCtx.currentLocale]);

  return (
    <View style={[styles.rootscreen, { backgroundColor: mode }]}>
      <View style={[styles.container, { backgroundColor: "#4169E1" }]}>
        <Text style={styles.label}>
          {currentMode == "light" ? "Light Mode" : "Dark Mode"}
        </Text>
        <DarkLightModeToggle
          currentMode={currentMode}
          onModeChange={handleModeChange}
        />
        <Text style={styles.label}>
          {locale == "" ? i18n.t(`gb`) : i18n.t(`${locale}`)}
        </Text>
        <Locale onFlagChange={handleFlagChange} flex={0} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootscreen: {
    flex: 1,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
  },
  container: {
    flexDirection: "column", // Change to column to center vertically
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
    paddingHorizontal: 16,
    borderRadius: 20,
    padding: 22,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "white",
    marginTop: 5,
    width: 260,
  },
  label: {
    fontSize: 16,
    color: "#121212",
    textAlign: "justify",
    paddingHorizontal: 20,
    fontFamily: "poppins",
    color: "white",
  },
});

export default SettingsScreen;
