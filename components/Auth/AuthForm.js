import { useState } from "react";
import { StyleSheet, View, Platform } from "react-native";

import Button from "../ui/Button";
import { Input } from "react-native-elements";

function AuthForm({ isLogin, onSubmit, credentialsInvalid }) {
  const [enteredUsername, setUserName] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "username":
        setUserName(enteredValue);
        break;
      case "password":
        setEnteredPassword(enteredValue);
        break;
    }
  }

  function submitHandler() {
    onSubmit({
      username: enteredUsername,
      password: enteredPassword,
    });
  }

  return (
    <View style={styles.form}>
      <View>
        <Input
          value={enteredUsername}
          label="Username"
          labelStyle={styles.label}
          autoCapitalize="none"
          autoComplete="off"
          onChangeText={(text) => setUserName(text)}
          enterKeyHint="next"
          onSubmitEditing={() => {
            this.secondTextInput.focus();
          }}
        />
        <Input
          label="Password"
          labelStyle={styles.label}
          autoCapitalize="none"
          onChangeText={(text) => setEnteredPassword(text)}
          secureTextEntry
          value={enteredPassword}
          ref={(input) => {
            this.secondTextInput = input;
          }}
          enterKeyHint="done"
          onSubmitEditing={submitHandler}
        />

        <View style={styles.buttons}>
          <Button onPress={submitHandler}>Log In</Button>
        </View>
      </View>
    </View>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 12,
  },
  label: {
    color: "#000",
  },
});
