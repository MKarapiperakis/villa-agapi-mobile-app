import { useContext, useEffect, useState, useCallback, Text } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import { createDrawerNavigator } from "@react-navigation/drawer";
import * as SplashScreen from "expo-splash-screen";
import * as Network from "expo-network";
import NetInfo from "@react-native-community/netinfo";
import FlashMessage from "react-native-flash-message";
//store manage
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import Locale from "./components/ui/Locale";
import AsyncStorage from "@react-native-async-storage/async-storage";
//styles
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "./constants/styles";
import { useFonts } from "expo-font";
import IconButton from "./components/ui/IconButton";
import DarkLightModeToggle from "./components/ui/DarkLightModeToggle";
//screens
import LoginScreen from "./screens/LoginScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import HomeScreen from "./screens/HomeScreen";
import AboutUsScreen from "./screens/AboutUsScreen";
import CalendarScreen from "./screens/CalendarScreen";
import InsideScreen from "./screens/InsideScreen";
import OutsideScreen from "./screens/OutsideScreen";
import ActivitiesScreen from "./screens/ActivitiesScreen";
import LocationsScreen from "./screens/LocationsScreen";
import Map from "./screens/Map";
import MarkerScreen from "./screens/MarkerScreen";
import SettingsScreen from "./screens/SettingsScreen";
import LocationItemScreen from "./screens/LocationItemScreen";
import DialogFlowScreen from "./screens/DialogFlowScreen";
import Home3DScreen from "./screens/Home3DScreen";
import ChartsScreen from "./screens/ChartsScreen";
import AddUserScreen from "./screens/AddUserScreen";
import EditUserScreen from "./screens/EditUserScreen";
import PreviewBookingRequestScreen from "./screens/PreviewBookingRequestScreen";
import AvailabilityScreen from "./screens/AvailabilityScreen";
import AddMarkerScreen from "./screens/AddMarkerScreen";
import ChatScreen from "./screens/ChatScreen";
import { Platform, Linking } from "react-native";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

SplashScreen.preventAutoHideAsync();

//unauthorized user
function AuthStack() {
  const [currentMode, setCurrentMode] = useState("dark");
  // const [isOnline, setIsOnline] = useState(true);

  let authCtx = useContext(AuthContext);

  // useEffect(() => {
  //   // Subscribe to network state changes
  //   const unsubscribe = NetInfo.addEventListener((state) => {
  //     console.log("Connection type:", state.type);
  //     console.log("Is connected?", state.isConnected);

  //     setIsOnline(state.isConnected);
  //   });

  //   // Unsubscribe from network state changes when the component unmounts
  //   return () => unsubscribe();
  // }, []);

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1A1A1A" },
        headerTintColor: "#FFF",
        sceneContainerStyle: { backgroundColor: "#121212" },
        drawerContentStyle: { backgroundColor: "#121212" },
        drawerInactiveTintColor: "#CCFFFF",
        drawerActiveTintColor: "#66FFFF",
        drawerActiveBackgroundColor: "#333",
      }}
    >
      <Drawer.Screen
        name="login"
        component={LoginScreen}
        options={{
          title: "login",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="log-in-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="Booking Request"
        component={CalendarScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="About us"
        component={AboutUsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="information-circle" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

//authorized user
function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1A1A1A" }, // Dark background color
        headerTintColor: "#FFF", // White text color
        sceneContainerStyle: { backgroundColor: "#121212" }, // Darker background color
        drawerContentStyle: { backgroundColor: "#121212" }, // Darker background color
        drawerInactiveTintColor: "#CCFFFF", // Light gray color
        drawerActiveTintColor: "#66FFFF", // Dark background color
        drawerActiveBackgroundColor: "#333", // Even darker color
      }}
    >
      <Drawer.Screen
        name="Profile"
        component={WelcomeScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
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
        <Drawer.Screen
          name="Home"
          component={Home3DScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
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
      {authCtx.role == "admin" && (
        <Drawer.Screen
          name="Statistics"
          component={ChartsScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="stats-chart" color={color} size={size} />
            ),
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

      {authCtx.role == "admin" && (
        <Drawer.Screen
          name="Live Chat"
          initialParams={{
            userId: authCtx.userId,
            name: authCtx.userName,
            role: authCtx.role,
          }}
          component={ChatScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="chatbubble-ellipses" color={color} size={size} />
            ),
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

      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={authCtx.isAuthenticated ? "Authenticated" : "Auth"}
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
          options={{
            headerStyle: {
              backgroundColor: "#1A1A1A",
            },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="Outside"
          component={OutsideScreen}
          options={{
            headerStyle: {
              backgroundColor: "#1A1A1A",
            },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="Activities"
          component={ActivitiesScreen}
          options={{
            headerStyle: {
              backgroundColor: "#1A1A1A",
            },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="Locations"
          component={LocationsScreen}
          options={{
            headerStyle: {
              backgroundColor: "#1A1A1A",
            },
            headerTintColor: "white",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Map"
          component={Map}
          options={{
            headerStyle: {
              backgroundColor: "#1A1A1A",
            },
            headerTintColor: "white",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Details"
          component={MarkerScreen}
          options={{
            headerStyle: {
              backgroundColor: "#1A1A1A",
            },
            headerTintColor: "white",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Information"
          component={LocationItemScreen}
          options={{
            headerStyle: {
              backgroundColor: "#1A1A1A",
            },
            headerTintColor: "white",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="chat"
          component={DialogFlowScreen}
          options={{
            headerStyle: {
              backgroundColor: "#1A1A1A",
            },
            headerTintColor: "white",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Add User"
          component={AddUserScreen}
          options={{
            headerStyle: {
              backgroundColor: "#1A1A1A",
            },
            headerTintColor: "white",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Edit User"
          component={EditUserScreen}
          options={{
            headerStyle: {
              backgroundColor: "#1A1A1A",
            },
            headerTintColor: "white",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />

        <Stack.Screen
          name="Booking Request"
          component={PreviewBookingRequestScreen}
          options={{
            headerStyle: {
              backgroundColor: "#1A1A1A",
            },
            headerTintColor: "white",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />

        <Stack.Screen
          name="Availability"
          component={AvailabilityScreen}
          options={{
            headerStyle: {
              backgroundColor: "#1A1A1A",
            },
            headerTintColor: "white",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Add Marker"
          component={AddMarkerScreen}
          options={{
            headerStyle: {
              backgroundColor: "#1A1A1A",
            },
            headerTintColor: "white",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />

        <Stack.Screen
          name="Live Chat"
          component={ChatScreen}
          options={{
            headerStyle: {
              backgroundColor: "#1A1A1A",
            },
            headerTintColor: "white",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerRight: ({ tintColor }) => (
              <MaterialCommunityIcons
                name="phone"
                size={25}
                color={tintColor}
                onPress={() => Linking.openURL(Platform.OS === "ios" ? `tel://306944247486` : `tel: +30 6944247486`)}
              />
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Root() {
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("token");
      console.log("User token: ", storedToken);
      if (storedToken) {
        authCtx.authenticate(
          storedToken.split(" ")[0],
          storedToken.split(" ")[1],
          storedToken.split(" ")[2],
          storedToken.split(" ")[3]
        );
      }

      await SplashScreen.hideAsync();
    }
    fetchToken();
  }, []);

  return <Navigation />;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    poppins: require("./assets/fonts/Poppins-Regular.ttf"),
    poppinsBold: require("./assets/fonts/Poppins-BoldItalic.ttf"),
    openSans: require("./assets/fonts/OpenSans_SemiCondensed-Medium.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
      <FlashMessage position={Platform.OS == "ios" ? "top" : "bottom"} />
    </>
  );
}
