import React, { useContext, useEffect, useCallback, useState } from "react";
import { Platform, StyleSheet, Linking } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "../../screens/LoginScreen";
import AboutUsScreen from "../../screens/AboutUsScreen";
import HomeScreen from "../../screens/HomeScreen";
import ActivitiesScreen from "../../screens/ActivitiesScreen";
import AuthContextProvider, { AuthContext } from "../../store/auth-context";
import InsideScreen from "../../screens/InsideScreen";
import OutsideScreen from "../../screens/OutsideScreen";
import LocationsScreen from "../../screens/LocationsScreen";
import LocationItem from "../../screens/LocationItemScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SettingsScreen from "../../screens/SettingsScreen";
import WelcomeScreen from "../../screens/WelcomeScreen";
import Home3DScreen from "../../screens/Home3DScreen";
import ChartsScreen from "../../screens/ChartsScreen";
import Chatscreen from "../../screens/ChatScreen";
import DialogFlowScreen from "../../screens/DialogFlowScreen";
import Map from "../../screens/Map";
import MarkerScreen from "../../screens/MarkerScreen";
import AddUserScreen from "../../screens/AddUserScreen";
import AddMarkerScreen from "../../screens/AddMarkerScreen";
// new screens start from here, untll here it's working
import EditUserScreen from "../../screens/EditUserScreen";
import PreviewBookingRequestScreen from "../../screens/PreviewBookingRequestScreen";
import AvailabilityScreen from "../../screens/AvailabilityScreen";
// import CalendarScreen from "../../screens/CalendarScreen";
import { StatusBar } from "expo-status-bar";
import IconButton from "../../components/ui/IconButton";
import * as NavigationBar from "expo-navigation-bar";
const Tab = createBottomTabNavigator();
import { useFonts } from "expo-font";
const Stack = createStackNavigator();

function AuthStack() {
  const [mode, setMode] = useState("");
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (authCtx.currentMode !== mode) {
      setMode(authCtx.currentMode);
    }
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(
        mode === "light" ? "#121212" : "#fff"
      );
      NavigationBar.setBehaviorAsync("overlay-swipe");
    }
  }, [authCtx.currentMode]);

  const getTabBarOptions = (mode) => {
    switch (mode) {
      case "dark":
        return {
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: { backgroundColor: "#121212" },
        };
      case "light":
        return {
          tabBarActiveTintColor: "#4169E1",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: { backgroundColor: "#fff" },
        };
      default:
        return {
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: { backgroundColor: "#1A1A1A" },
        };
    }
  };

  const getIconName = (routeName) => {
    switch (routeName) {
      case "Login":
        return "log-in-outline";
      case "About Us":
        return "information-circle";
      case "Settings":
        return "settings";
      case "Booking Request":
        return "calendar";
      default:
        return "home";
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconName = getIconName(route.name);
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        ...getTabBarOptions(mode),
        tabBarItemStyle: {
          margin: 5,
        },
        animationEnabled: false
      })}
    >
      <Tab.Screen
        name="Login"
        component={LoginScreen}
        options={{ tabBarShowLabel: false }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarShowLabel: false }}
      />
      {/* <Tab.Screen
        name="Booking Request"
        component={CalendarScreen}
        options={{ tabBarShowLabel: false }}
      /> */}
      <Tab.Screen
        name="About Us"
        component={AboutUsScreen}
        options={{ tabBarShowLabel: false }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarShowLabel: false }}
      />
    </Tab.Navigator>
  );
}

function AuthenticatedStack() {
  const [mode, setMode] = useState("");
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (authCtx.currentMode !== mode) {
      setMode(authCtx.currentMode);
    }
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(
        mode === "light" ? "#121212" : "#fff"
      );
      NavigationBar.setBehaviorAsync("overlay-swipe");
    }
  }, [authCtx.currentMode]);

  useEffect(() => {
    if (authCtx.currentMode !== mode) {
      setMode(authCtx.currentMode);
    }
  }, [authCtx.currentMode]);

  const getTabBarOptions = (mode) => {
    switch (mode) {
      case "dark":
        return {
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: { backgroundColor: "#121212" },
        };
      case "light":
        return {
          tabBarActiveTintColor: "#4169E1",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: { backgroundColor: "#fff" },
        };
      default:
        return {
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: { backgroundColor: "#1A1A1A" },
        };
    }
  };

  const getIconName = (routeName) => {
    switch (routeName) {
      case "Settings":
        return "settings";
      case "Profile":
        return "person";
      case "My Home":
        return "home";
      case "Stats":
        return "stats-chart";
      case "Live Chat":
        return "chatbubble-ellipses";
      default:
        return "home";
    }
  };

  const getScreenOptions = (mode) => {
    switch (mode) {
      case "dark":
        return {
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "white",
          headerTitleStyle: { fontWeight: "bold" },
        };
      case "light":
        return {
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "black",
          headerTitleStyle: { fontWeight: "bold" },
        };
      default:
        return {
          headerStyle: { backgroundColor: "#1A1A1A" },
          headerTintColor: "white",
          headerTitleStyle: { fontWeight: "bold" },
        };
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconName = getIconName(route.name);
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        ...getTabBarOptions(mode),
        tabBarItemStyle: {
          margin: 5,
        },
      })}
    >
      <Tab.Screen
        name="Profile"
        component={WelcomeScreen}
        options={{
          tabBarShowLabel: false,
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="exit-outline"
              color={tintColor}
              size={24}
              onPress={authCtx.logout}
            />
          ),
        }}
      />
      {authCtx.role !== "admin" && (
        <Tab.Screen
          name="My Home"
          component={Home3DScreen}
          options={{
            tabBarShowLabel: false,
            headerRight: ({ tintColor }) => (
              <IconButton
                icon="exit-outline"
                color={tintColor}
                size={24}
                onPress={authCtx.logout}
              />
            ),
          }}
        />
      )}
      {authCtx.role === "admin" && (
        <Tab.Screen
          name="Stats"
          component={ChartsScreen}
          options={{
            tabBarShowLabel: false,
            headerRight: ({ tintColor }) => (
              <IconButton
                icon="exit-outline"
                color={tintColor}
                size={24}
                onPress={authCtx.logout}
              />
            ),
          }}
        />
      )}
      {authCtx.role === "admin" && (
        <Tab.Screen
          name="Live Chat"
          component={Chatscreen}
          initialParams={{
            userId: authCtx.userId,
            name: authCtx.userName,
            role: authCtx.role,
          }}
          options={{
            tabBarShowLabel: false,
            headerRight: ({ tintColor }) => (
              <IconButton
                icon="exit-outline"
                color={tintColor}
                size={24}
                onPress={authCtx.logout}
              />
            ),
          }}
        />
      )}
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarShowLabel: false }}
      />
    </Tab.Navigator>
  );
}

export default function TabLayout() {
  const authCtx = useContext(AuthContext);
  const [mode, setMode] = useState(authCtx.currentMode);
  const [fontsLoaded] = useFonts({
    poppins: require("../../assets/fonts/Poppins-Regular.ttf"),
    poppinsBold: require("../../assets/fonts/Poppins-BoldItalic.ttf"),
    openSans: require("../../assets/fonts/OpenSans_SemiCondensed-Medium.ttf"),
  });

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(
        mode === "light" ? "#fff" : "#121212"
      );
      NavigationBar.setBehaviorAsync("overlay-swipe");
    }
  }, [authCtx.isAuthenticated]);

  const onLayoutRootView = useCallback(async () => {
    // if (fontsLoaded) {
    //   await SplashScreen.hideAsync();
    // }
  }, [fontsLoaded]);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        const [token, userId, userName, role] = storedToken.split(" ");
        authCtx.authenticate(token, userId, userName, role);
      }
    }

    fetchToken();
  }, []);

  // if (!fontsLoaded) {
  //   return null;
  // }

  useEffect(() => {
    if (authCtx.currentMode !== mode) {
      setMode(authCtx.currentMode);
    }
  }, [authCtx.currentMode]);

  const getScreenOptions = (mode) => {
    switch (mode) {
      case "dark":
        return {
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "white",
          headerTitleStyle: { fontWeight: "bold" },
        };
      case "light":
        return {
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "black",
          headerTitleStyle: { fontWeight: "bold" },
        };
      default:
        return {
          headerStyle: { backgroundColor: "#1A1A1A" },
          headerTintColor: "white",
          headerTitleStyle: { fontWeight: "bold" },
        };
    }
  };

  return (
    <>
    <StatusBar style={authCtx.currentMode === "dark" ? "light" : "dark"} />
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{
        headerBackTitleVisible: false,
        animationEnabled: false
      }}
    >
      {!authCtx.isAuthenticated && (
        <Stack.Screen
          name="Auth"
          component={AuthStack}
          options={{
            headerShown: false, // Optionally hide the header for the AuthStack
          }}
        />
      )}
      {authCtx.isAuthenticated && (
        <Stack.Screen
          name="Authenticated"
          component={AuthenticatedStack}
          options={{
            headerShown: false, // Optionally hide the header for the AuthenticatedStack
          }}
        />
      )}
      <Stack.Screen
        name="Inside"
        component={InsideScreen}
        options={getScreenOptions(mode)}
      />
      <Stack.Screen
        name="Outside"
        component={OutsideScreen}
        options={getScreenOptions(mode)}
      />
      <Stack.Screen
        name="Activities"
        component={ActivitiesScreen}
        options={getScreenOptions(mode)}
      />
      <Stack.Screen
        name="Locations"
        component={LocationsScreen}
        options={getScreenOptions(mode)}
      />
      <Stack.Screen
        name="Information"
        component={LocationItem}
        options={getScreenOptions(mode)}
      />
      <Stack.Screen
        name="Map"
        component={Map}
        options={getScreenOptions(mode)}
      />
      <Stack.Screen
        name="Details"
        component={MarkerScreen}
        options={getScreenOptions(mode)}
      />
      <Stack.Screen
        name="Chat"
        component={DialogFlowScreen}
        options={getScreenOptions(mode)}
      />
      <Stack.Screen
        name="Add User"
        component={AddUserScreen}
        options={getScreenOptions(mode)}
      />
      <Stack.Screen
        name="Add Marker"
        component={AddMarkerScreen}
        options={getScreenOptions(mode)}
      />

      <Stack.Screen
        name="Edit User"
        component={EditUserScreen}
        options={getScreenOptions(mode)}
      />
      <Stack.Screen
        name="Booking Request"
        component={PreviewBookingRequestScreen}
        options={getScreenOptions(mode)}
      />
      <Stack.Screen
        name="Availability"
        component={AvailabilityScreen}
        options={getScreenOptions(mode)}
      />
      <Stack.Screen
        name="Live Chat"
        component={Chatscreen}
        options={{
          ...getScreenOptions(mode),
          headerRight: ({ tintColor }) => (
            <MaterialCommunityIcons
              name="phone"
              size={25}
              color={tintColor}
              style={styles.icon}
              onPress={() =>
                Linking.openURL(
                  Platform.OS === "ios"
                    ? "tel://306944247486"
                    : "tel:+30 6944247486"
                )
              }
            />
          ),
        }}
      />
    </Stack.Navigator>
    </>
    
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 22,
  },
  icon: {
    marginRight: 12,
  },
});
