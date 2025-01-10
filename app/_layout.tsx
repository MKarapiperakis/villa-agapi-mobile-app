import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useContext, useEffect, useState } from "react";
import 'react-native-reanimated';
import { StatusBar } from "expo-status-bar";
import AuthContextProvider, { AuthContext } from "../store/auth-context";
import { useColorScheme } from '@/hooks/useColorScheme';
import FlashMessage from "react-native-flash-message";
import { Platform } from 'react-native';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme(); // 'light' or 'dark'
  const [loaded] = useFonts({
    poppins: require("../assets/fonts/Poppins-Regular.ttf"),
    poppinsBold: require("../assets/fonts/Poppins-BoldItalic.ttf"),
    openSans: require("../assets/fonts/OpenSans_SemiCondensed-Medium.ttf"),
  });

  const authCtx = useContext(AuthContext);
  const [mode, setMode] = useState('');

  useEffect(() => {
    setMode(authCtx.currentMode);
  }, [authCtx.currentMode]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
  
   <AuthContextProvider>
      <StatusBar style='light'/>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
        <FlashMessage position={Platform.OS === "ios" ? "top" : "bottom"} />
    </AuthContextProvider>
  );
}
