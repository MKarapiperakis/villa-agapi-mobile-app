import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Pressable,
  Text,
  Dimensions,
} from "react-native";
import { AuthContext } from "../store/auth-context";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import { Input, Button } from "react-native-elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import { UserCreateRequest } from "../api/UserCreateRequest";
import { showMessage, hideMessage } from "react-native-flash-message";
import i18n from "../translations/i18n";

function AddUserScreen() {
  const authCtx = useContext(AuthContext);
  const [mode, setMode] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [arrivalPicker, setArrivalPicker] = useState(false);
  const [departurePicker, setDeparturePicker] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [cleaningprogram, setCleaningProgram] = useState(
    [].reduce((acc, date) => {
      acc[date] = { selected: true, selectedColor: "#3498db" };
      return acc;
    }, {})
  );
  const [locale, setLocale] = useState(authCtx.currentLocale.toLowerCase());
  useEffect(() => {
    setLocale(authCtx.currentLocale.toLowerCase());
  }, [authCtx.currentLocale]);

  i18n.locale = locale;
  const navigation = useNavigation();
  let progress = getProgress();

  function getProgress() {
    if (currentStep == 1) return 0;
    else if (currentStep == 5) return 1;
    else return currentStep * 0.18;
  }

  const isFirstStepValid = () => {
    if (username.trim().length > 0 && password.trim().length > 0) return false;
    else return true;
  };

  const isSecondStepValid = () => {
    return false;
  };

  const isThirdStepValid = () => {
    return false;
  };

  const isFourthStepValid = () => {
    if (
      arrival.trim().length > 0 &&
      departure.trim().length > 0 &&
      new Date(arrival) < new Date(departure)
    )
      return false;
    else return true;
  };

  const changePasswordVissibility = () => {
    setIsPasswordVisible((previousState) => !previousState);
  };

  const showArrivalDatePicker = () => {
    setArrivalPicker(true);
  };

  const hideArrivalDatePicker = () => {
    setArrivalPicker(false);
  };

  const handleArrivalConfirm = (date) => {
    hideArrivalDatePicker();
    setArrival(new Date(date).toDateString());
  };

  const showDepartureDatePicker = () => {
    setDeparturePicker(true);
  };

  const hideDepartureDatePicker = () => {
    setDeparturePicker(false);
  };

  const handleDepartureConfirm = (date) => {
    hideDepartureDatePicker();
    setDeparture(new Date(date).toDateString());
  };

  const handleDateSelection = (day) => {
    console.log(day);
    const updatedCleaningProgram = { ...cleaningprogram };
    if (updatedCleaningProgram[day.dateString]) {
      delete updatedCleaningProgram[day.dateString];
    } else {
      updatedCleaningProgram[day.dateString] = {
        selected: true,
        selectedColor: "#3498db",
      };
    }

    if (Object.keys(updatedCleaningProgram).length === 0) {
      setCleaningProgram({ "": { selected: false, selectedColor: "#ffffff" } });
    } else {
      setCleaningProgram(updatedCleaningProgram);
    }
  };

  const submit = () => {
    createUser();
  };

  const createUser = async () => {
    let cleaningprogramArray = [""];

    for (const date in cleaningprogram) {
      if (cleaningprogram.hasOwnProperty(date)) cleaningprogramArray.push(date);
    }

    try {
      let response = await UserCreateRequest(
        authCtx.token,
        username,
        email,
        password,
        arrival,
        departure,
        firstName,
        lastName,
        phone,
        cleaningprogramArray
      );

      console.log(response);

      if (response == 201) {
        showMessage({
          message: "User has been created successfully",
          type: "success",
          icon: () => (
            <Ionicons name="ios-checkmark-circle" size={18} color="white" />
          ),
        });
        navigation.navigate("Profile");
      } else if (response == 409) {
        showMessage({
          message: "User already exist",
          type: "danger",
          icon: () => <MaterialIcons name="error" size={18} color="white" />,
        });
      } else {
        showMessage({
          message: "Error creating user, please try again later",
          type: "danger",
          icon: () => <MaterialIcons name="error" size={18} color="white" />,
        });
      }
    } catch (error) {}
  };

  useEffect(() => {
    setMode(authCtx.currentMode);
  }, [authCtx.currentMode]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[
        styles.container,
        {
          backgroundColor: mode === "light" ? "#FFFAFA" : "#121212",
        },
      ]}
    >
      <View showsVerticalScrollIndicator={false} style={styles.formInputs}>
        <DateTimePickerModal
          isVisible={arrivalPicker}
          mode="date"
          onConfirm={handleArrivalConfirm}
          onCancel={hideArrivalDatePicker}
          display={Platform.OS === "ios" ? "inline" : "scroll"}
          date={new Date()}
        />
        <DateTimePickerModal
          isVisible={departurePicker}
          mode="date"
          onConfirm={handleDepartureConfirm}
          onCancel={hideDepartureDatePicker}
          display={Platform.OS === "ios" ? "inline" : "scroll"}
          date={new Date()}
        />
        <View
          style={[
            styles.detailContainer,
            {
              backgroundColor: mode === "light" ? "#FFFAFA" : "#352A2A",
            },
          ]}
        >
          <View style={styles.progressBarContainer}>
            <Progress.Bar
              progress={progress}
              width={220}
              color="#228B22"
              style={styles.progressBar}
            />
            <View style={styles.header}>
              {[1, 2, 3, 4, 5].map((step) => (
                <Pressable
                  key={step}
                  onPress={() => {
                    if (step < currentStep) setCurrentStep(step);
                  }}
                  style={[
                    styles.circle,
                    {
                      backgroundColor:
                        step <= currentStep
                          ? "#228B22"
                          : mode === "light"
                          ? "#1E90FF"
                          : "#6495ED",
                      marginHorizontal: 11,
                    },
                  ]}
                >
                  <Text style={styles.circleText}>{step}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          {/* STEP 1 */}
          {currentStep == 1 && (
            <View>
              <View style={styles.row}>
                <Text
                  style={[
                    styles.title,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                >
                  {i18n.t("admin.create_user.step.login_credentials")}
                </Text>
              </View>
              <View style={styles.row}>
                <Input
                  style={[
                    styles.input,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  labelStyle={[
                    styles.input,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  value={username}
                  label={i18n.t("admin.create_user.label.username")}
                  autoCapitalize="none"
                  onChangeText={(text) =>
                    setUserName(text.toLowerCase().replace(" ", ""))
                  }
                />
              </View>
              <View style={styles.row}>
                <Input
                  style={[
                    styles.input,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  labelStyle={[
                    styles.input,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  value={password}
                  enterKeyHint="done"
                  label={i18n.t("admin.create_user.label.password")}
                  autoCapitalize="none"
                  secureTextEntry={!isPasswordVisible}
                  rightIcon={
                    password.trim().length > 0 && (
                      <Ionicons
                        name={
                          !isPasswordVisible ? "eye-outline" : "eye-off-outline"
                        }
                        size={25}
                        color={mode === "light" ? "#121212" : "#FFFAFA"}
                        onPress={changePasswordVissibility}
                      />
                    )
                  }
                  onChangeText={(text) =>
                    setPassword(text.toLowerCase().replace(" ", ""))
                  }
                />
              </View>
              <View style={styles.row}>
                <Button
                  buttonStyle={{
                    width: 100,
                    borderRadius: 4,
                    backgroundColor: "#228B22",
                    borderColor: "#228B22",
                  }}
                  containerStyle={{ margin: 5 }}
                  disabledStyle={{
                    width: 100,
                    borderRadius: 4,
                    backgroundColor: "#228B22",
                    borderColor: "#228B22",
                    opacity: 0.6,
                  }}
                  disabled={isFirstStepValid()}
                  disabledTitleStyle={{ color: "#FFFAFA" }}
                  linearGradientProps={null}
                  loadingProps={{ animating: true }}
                  loadingStyle={{}}
                  onPress={() => setCurrentStep(2)}
                  title="Next"
                  titleProps={{}}
                  titleStyle={{ marginHorizontal: 5 }}
                />
              </View>
            </View>
          )}

          {/* STEP 2 */}
          {currentStep == 2 && (
            <View>
              <View style={styles.row}>
                <Text
                  style={[
                    styles.title,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                >
                  {i18n.t("admin.create_user.step.personal_information")}
                </Text>
              </View>
              <View style={styles.row}>
                <Input
                  style={[
                    styles.input,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  labelStyle={[
                    styles.input,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  value={firstName}
                  label={i18n.t("admin.create_user.label.first_name")}
                  autoCapitalize="none"
                  onChangeText={(text) => setFirstName(text)}
                />
              </View>
              <View style={styles.row}>
                <Input
                  style={[
                    styles.input,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  labelStyle={[
                    styles.input,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  value={lastName}
                  enterKeyHint="done"
                  label={i18n.t("admin.create_user.label.last_name")}
                  autoCapitalize="none"
                  onChangeText={(text) => setLastName(text)}
                />
              </View>
              <View style={styles.row}>
                <Button
                  buttonStyle={{
                    width: 100,
                    borderRadius: 4,
                    backgroundColor: "#228B22",
                    borderColor: "#228B22",
                  }}
                  containerStyle={{ margin: 5 }}
                  disabledStyle={{
                    width: 100,
                    borderRadius: 4,
                    backgroundColor: "#228B22",
                    borderColor: "#228B22",
                    opacity: 0.6,
                  }}
                  disabled={isSecondStepValid()}
                  disabledTitleStyle={{ color: "#FFFAFA" }}
                  linearGradientProps={null}
                  loadingProps={{ animating: true }}
                  loadingStyle={{}}
                  onPress={() => setCurrentStep(3)}
                  title="Next"
                  titleProps={{}}
                  titleStyle={{ marginHorizontal: 5 }}
                />
              </View>
            </View>
          )}

          {/* STEP 3 */}
          {currentStep == 3 && (
            <View>
              <View style={styles.row}>
                <Text
                  style={[
                    styles.title,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                >
                  {i18n.t("admin.create_user.step.contact_information")}
                </Text>
              </View>
              <View style={styles.row}>
                <Input
                  style={[
                    styles.input,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  labelStyle={[
                    styles.input,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  value={email}
                  label={i18n.t("admin.create_user.label.email")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={(text) => setEmail(text)}
                />
              </View>
              <View style={styles.row}>
                <Input
                  style={[
                    styles.input,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  labelStyle={[
                    styles.input,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  value={phone}
                  enterKeyHint="done"
                  keyboardType="phone-pad"
                  label={i18n.t("admin.create_user.label.phone")}
                  autoCapitalize="none"
                  onChangeText={(text) => setPhone(text)}
                />
              </View>
              <View style={styles.row}>
                <Button
                  buttonStyle={{
                    width: 100,
                    borderRadius: 4,
                    backgroundColor: "#228B22",
                    borderColor: "#228B22",
                  }}
                  containerStyle={{ margin: 5 }}
                  disabledStyle={{
                    width: 100,
                    borderRadius: 4,
                    backgroundColor: "#228B22",
                    borderColor: "#228B22",
                    opacity: 0.6,
                  }}
                  disabled={isThirdStepValid()}
                  disabledTitleStyle={{ color: "#FFFAFA" }}
                  linearGradientProps={null}
                  loadingProps={{ animating: true }}
                  loadingStyle={{}}
                  onPress={() => setCurrentStep(4)}
                  title="Next"
                  titleProps={{}}
                  titleStyle={{ marginHorizontal: 5 }}
                />
              </View>
            </View>
          )}

          {/* STEP 4 */}
          {currentStep == 4 && (
            <View>
              <View style={styles.row}>
                <Text
                  style={[
                    styles.title,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                >
                  {i18n.t("admin.create_user.step.arrival_departure")}
                </Text>
              </View>
              <View style={styles.row}>
                <Input
                  style={[
                    styles.input,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  labelStyle={[
                    styles.input,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  disabled={true}
                  value={arrival}
                  rightIcon={
                    <Ionicons
                      name="calendar"
                      size={20}
                      color={mode === "light" ? "#121212" : "#FFFAFA"}
                      onPress={showArrivalDatePicker}
                    />
                  }
                  label={i18n.t("admin.create_user.label.arrival")}
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.row}>
                <Input
                  style={[
                    styles.input,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  labelStyle={[
                    styles.input,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  value={departure}
                  rightIcon={
                    <Ionicons
                      name="calendar"
                      size={20}
                      color={mode === "light" ? "#121212" : "#FFFAFA"}
                      onPress={showDepartureDatePicker}
                    />
                  }
                  label={i18n.t("admin.create_user.label.departure")}
                  disabled={true}
                  onChangeText={(text) => setDeparture(text)}
                />
              </View>
              <View style={styles.row}>
                <Button
                  buttonStyle={{
                    width: 100,
                    borderRadius: 4,
                    backgroundColor: "#228B22",
                    borderColor: "#228B22",
                  }}
                  containerStyle={{ margin: 5 }}
                  disabledStyle={{
                    width: 100,
                    borderRadius: 4,
                    backgroundColor: "#228B22",
                    borderColor: "#228B22",
                    opacity: 0.6,
                  }}
                  disabled={isFourthStepValid()}
                  disabledTitleStyle={{ color: "#FFFAFA" }}
                  linearGradientProps={null}
                  loadingProps={{ animating: true }}
                  loadingStyle={{}}
                  onPress={() => setCurrentStep(5)}
                  title="Next"
                  titleProps={{}}
                  titleStyle={{ marginHorizontal: 5 }}
                />
              </View>
            </View>
          )}
          {/* STEP 5 */}
          {currentStep == 5 && (
            <View>
              <View style={styles.row}>
                <Text
                  style={[
                    styles.title,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                >
                  {i18n.t("admin.create_user.step.cleaning_program")}
                </Text>
              </View>
              <View style={styles.row}>
                <Calendar
                  markedDates={cleaningprogram}
                  minDate={arrival}
                  maxDate={departure}
                  hideExtraDays={true}
                  onDayPress={(day) => handleDateSelection(day)}
                  style={[
                    styles.calendar,
                    {
                      backgroundColor:
                        mode === "light" ? "transparent" : "#FFFAFA",
                    },
                  ]}
                  theme={{
                    calendarBackground:
                      mode === "light" ? "transparent" : "#FFFAFA",
                  }}
                  current={arrival}
                />
              </View>
              <View style={styles.row}>
                <Button
                  buttonStyle={{
                    width: 100,
                    borderRadius: 4,

                    borderColor: "#228B22",
                  }}
                  containerStyle={{ margin: 5 }}
                  disabledStyle={{
                    width: 100,
                    borderRadius: 4,
                    borderColor: "#228B22",
                    opacity: 0.6,
                  }}
                  disabledTitleStyle={{ color: "#FFFAFA" }}
                  linearGradientProps={null}
                  loadingProps={{ animating: true }}
                  onPress={() => submit()}
                  title="Submit"
                  titleStyle={{ marginHorizontal: 5 }}
                />
              </View>
            </View>
          )}
          <View style={styles.footer}></View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default AddUserScreen;
const width = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  detailContainer: {
    alignItems: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "white",
    padding: 22,
    margin: 10,
  },
  formInputs: {
    borderColor: "#D3D3D3",
    padding: 5,
    justifyContent: "center",
    width: "96%",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  circleText: {
    color: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressBar: {
    position: "absolute",
    top: 18,
    marginLeft: 12,
    height: 6,
    backgroundColor: "#1E90FF",
    borderWidth: 0,
  },
  row: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    fontFamily: "poppins",
    fontSize: 21,
    padding: 0,
    margin: 10,
  },
  calendar: {
    borderRadius: 11,
    width: width / 1.3,
  },
});
