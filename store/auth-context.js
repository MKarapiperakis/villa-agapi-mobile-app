import AsyncStorage from "@react-native-async-storage/async-storage";

import { createContext, useEffect, useState } from "react";

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
  const [authToken, setAuthToken] = useState();
  const [userId, setUserId] = useState();
  const [userName, setUserName] = useState();
  const [role, setRole] = useState();
  const [currentMode, setCurrentMode] = useState("light");
  const [currentLocale, setCurrentLocale] = useState("en");

  function changeMode(mode) {
    setCurrentMode(mode);
  }

  function changeLocale(locale) {
    if (locale === "GB") setCurrentLocale("EN");
    else setCurrentLocale(locale);
  }

  function authenticate(token, userId, userName, role) {
    setAuthToken(token);
    setUserId(userId);
    setUserName(userName);
    setRole(role);

    let userInfo = token + " " + userId + " " + userName + " " + role;
    AsyncStorage.setItem("token", userInfo);
  }

  function logout() {
    setAuthToken(null);
    setUserId(null);
    setUserName(null);
    setRole(null);
    AsyncStorage.removeItem("token");
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
