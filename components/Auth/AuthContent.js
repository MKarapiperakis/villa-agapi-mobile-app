import { useState } from "react";
import { Alert, StyleSheet, View, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

import FlatButton from "../ui/FlatButton";
import AuthForm from "./AuthForm";
import { Colors } from "../../constants/styles";

function AuthContent({ isLogin, onAuthenticate }) {
  const navigation = useNavigation();

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  function submitHandler(credentials) {
    let { username, password } = credentials;

    username = username.trim();

    password = password.trim();

    onAuthenticate({ username, password });
  }

  return (
    <View style={styles.authContent}>
      <AuthForm
        onSubmit={submitHandler}
        credentialsInvalid={credentialsInvalid}
      />
    </View>
  );
}

export default AuthContent;

const deviceHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  authContent: {
    // marginTop: deviceHeight < 700 ? 80 : 150,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#FFF",
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    opacity: 0.9
  },
  buttons: {
    marginTop: 8,
  },
});
