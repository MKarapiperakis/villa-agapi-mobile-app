import { useContext, useState, useEffect } from "react";
import {
  Alert,
  ImageBackground,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  View,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import ModalWindow from "../components/ui/ModalWindow";
import { AuthContext } from "../store/auth-context";
import { login } from "../util/auth";
import { useNavigation } from "@react-navigation/native";

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [mode, setMode] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    setMode(authCtx.currentMode);
  }, [authCtx.currentMode]);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: mode === "light" ? "#FFFAFA" : "#121212",
      },
      headerTintColor: mode === "light" ? "#000000" : "#ffffff",
    });
  }, [navigation, mode]);

  async function loginHandler({ username, password }) {
    setIsAuthenticating(true);

    try {
      const res = await login(username, password);

      const token = res.token;
      const userId = res.userId;
      const userName = res.username;
      const role = res.role;

      authCtx.authenticate(token, userId, userName, role);
    } catch (error) {
      console.log("login response error: ", error);
      showModal();
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return (
      <ImageBackground
        source={
          mode === "light"
            ? require("../assets/images/outside/day/day1.jpg")
            : require("../assets/images/outside/night/night1.jpg")
        }
        resizeMode="cover"
        style={styles.rootScreen}
        imageStyle={styles.backgroundImage}
      >
        <LoadingOverlay />
      </ImageBackground>
    );
  }

  function showModal() {
    setModalShow(true);
  }

  function hideModal() {
    setModalShow(false);
  }

  return (
    <ImageBackground
      source={
        mode === "light"
          ? require("../assets/images/outside/day/day1.jpg")
          : require("../assets/images/outside/night/night1.jpg")
      }
      resizeMode="cover"
      style={styles.rootScreen}
      imageStyle={styles.backgroundImage}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          {modalShow && (
            <View style={StyleSheet.create((flex = 1))}>
              <ModalWindow
                onButtonClick={hideModal}
                text="Login failed. Please check your credentials or try again later!"
              ></ModalWindow>
            </View>
          )}
          <View style={styles.form}>
            <KeyboardAvoidingView behavior="position">
              <AuthContent isLogin onAuthenticate={loginHandler} />
            </KeyboardAvoidingView>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    opacity: 0.9,
  },
  form: {
    width: "100%",
  },
  container: {
    flex: 1,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
