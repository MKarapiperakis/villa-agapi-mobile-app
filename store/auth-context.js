import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
//import { useNavigation } from "@react-navigation/native";
export const AuthContext = createContext({
  token: "",
  currentLocale: "en",
  userId: "",
  userName: "",
  role: "",
  currentMode: "",
  isAuthenticated: false,
  authenticate: (token) => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [role, setRole] = useState(null);
  const [currentMode, setCurrentMode] = useState("light");
  const [currentLocale, setCurrentLocale] = useState("en");
  //const navigation = useNavigation();
  function changeMode(mode) {
    setCurrentMode(mode);
  }

  function changeLocale(locale) {
    setCurrentLocale(locale === "GB" ? "EN" : locale);
  }

  function authenticate(token, userId, userName, role) {
    setAuthToken(token);
    setUserId(userId);
    setUserName(userName);
    setRole(role);

    const userInfo = `${token} ${userId} ${userName} ${role}`;
    AsyncStorage.setItem("token", userInfo);

    //navigation.navigate("Authenticated");
  }

  function logout() {
     setAuthToken(null);
     setUserId(null);
    // setUserName(null);
    // setRole(null);
    AsyncStorage.removeItem("token");

    //navigation.navigate("Auth");
  }

  const value = {
    token: authToken,
    userId: userId,
    userName: userName,
    role: role,
    currentMode: currentMode,
    currentLocale: currentLocale,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
    changeMode: changeMode,
    changeLocale: changeLocale,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
