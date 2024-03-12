import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView,
  Text,
  Platform,
  SafeAreaView,
} from "react-native";
import { AuthContext } from "../store/auth-context";
import { Input, Button } from "react-native-elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import i18n from "../translations/i18n";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { getMinDate, getMaxDate } from "../util/dates";
import { EditUserUpdateRequest } from "../api/EditUserUpdateRequest";
import { showMessage, hideMessage } from "react-native-flash-message";

function EditUserScreen({ route, navigation }) {
  const { user } = route.params;
  const authCtx = useContext(AuthContext);
  const [mode, setMode] = useState("");
  const [firstname, setFirstName] = useState(user.firstname);
  const [username, setUserName] = useState(user.name);
  const [lastname, setLastName] = useState(user.lastname);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [country, setCountry] = useState(user.country);
  const [arrival, setArrival] = useState(new Date(user.arrival).toDateString());
  const [departure, setDeparture] = useState(
    new Date(user.departure).toDateString()
  );
  const [cleaningprogram, setCleaningProgram] = useState(
    (user.cleaningprogram || []).reduce((acc, date) => {
      acc[date] = { selected: true, selectedColor: "#3498db" };
      return acc;
    }, {})
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [arrivalPicker, setArrivalPicker] = useState(false);
  const [departurePicker, setDeparturePicker] = useState(false);
  const [locale, setLocale] = useState(authCtx.currentLocale.toLowerCase());
  useEffect(() => {
    setLocale(authCtx.currentLocale.toLowerCase());
  }, [authCtx.currentLocale]);

  i18n.locale = locale;

  useEffect(() => {
    setMode(authCtx.currentMode);
  }, [authCtx.currentMode]);

  useEffect(() => {
    navigation.setOptions({ title: user.name });
  }, []);

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

    setSelectedDate("");
  };

  const confirm = () => {
    updateUser();
  };

  const updateUser = async () => {
    let cleaningprogramArray = [];

    for (const date in cleaningprogram) {
      if (cleaningprogram.hasOwnProperty(date)) cleaningprogramArray.push(date);
    }

    try {
      let response = await EditUserUpdateRequest(
        user.id,
        authCtx.token,
        firstname,
        lastname,
        email,
        arrival,
        departure,
        cleaningprogramArray
      );

      if (response == 200) {
        showMessage({
          message: "User has been updated successfully",
          type: "success",
          icon: () => (
            <Ionicons name="ios-checkmark-circle" size={18} color="white" />
          ),
        });
      } else {
        showMessage({
          message: "Error updating user information, please try again later",
          type: "danger",
          icon: () => <MaterialIcons name="error" size={18} color="white" />,
        });
      }
    } catch (error) {}
  };
  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        {
          backgroundColor: mode === "light" ? "#FFFAFA" : "#121212",
        },
      ]}
    >
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <DateTimePickerModal
            isVisible={arrivalPicker}
            mode="date"
            onConfirm={handleArrivalConfirm}
            onCancel={hideArrivalDatePicker}
            display={Platform.OS === "ios" ? "inline" : "calendar"}
            date={new Date(arrival)}
            maximumDate={
              !(
                Object.keys(cleaningprogram).length > 0 &&
                Object.keys(cleaningprogram)[0] === ""
              )
                ? new Date(getMinDate(cleaningprogram))
                : new Date(departure)
            }
          />
          <DateTimePickerModal
            isVisible={departurePicker}
            mode="date"
            onConfirm={handleDepartureConfirm}
            onCancel={hideDepartureDatePicker}
            display={Platform.OS === "ios" ? "inline" : "calendar"}
            date={new Date(departure)}
            minimumDate={
              !(
                Object.keys(cleaningprogram).length > 0 &&
                Object.keys(cleaningprogram)[0] === ""
              )
                ? new Date(getMaxDate(cleaningprogram))
                : new Date(arrival)
            }
          />
          <View style={styles.formInputs}>
            <View
              style={[
                styles.detailContainer,
                {
                  backgroundColor: mode === "light" ? "#FFFAFA" : "#352A2A",
                },
              ]}
            >
              <Text
                style={[
                  styles.label2,
                  {
                    color:
                      mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                  },
                ]}
              >
                {i18n.t("admin.create_user.step.personal_information")}
              </Text>

              {/* FIRST NAME */}
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
                  value={firstname}
                  label={i18n.t("admin.create_user.label.first_name")}
                  autoCapitalize="none"
                  enterKeyHint="next"
                  onSubmitEditing={() => {
                    this.thirdTextInput.focus();
                  }}
                  ref={(input) => {
                    this.secondTextInput = input;
                  }}
                  onChangeText={(text) => setFirstName(text)}
                />
              </View>
              {/* LAST NAME */}
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
                  value={lastname}
                  enterKeyHint="next"
                  label={i18n.t("admin.create_user.label.last_name")}
                  autoCapitalize="none"
                  onSubmitEditing={() => {
                    this.fourthTextInput.focus();
                  }}
                  ref={(input) => {
                    this.thirdTextInput = input;
                  }}
                  onChangeText={(text) => setLastName(text)}
                />
              </View>
              {/* EMAIL */}
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
                  keyboardType="email-address"
                  enterKeyHint="done"
                  label={i18n.t("admin.create_user.label.email")}
                  ref={(input) => {
                    this.fourthTextInput = input;
                  }}
                  onSubmitEditing={() => {
                    this.fifthTextInput.focus();
                  }}
                  onChangeText={(text) => setEmail(text)}
                />
              </View>
              {/* PHONE */}
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
                  label={i18n.t("admin.create_user.label.phone")}
                  disabled={true}
                />
              </View>
              {/* COUNTRY */}
              <View style={styles.row}>
                <Input
                  style={[
                    styles.input,
                    {
                      color:
                        mode === "light" ? "#121212" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  labelStyle={[
                    styles.input,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  value={country}
                  enterKeyHint="next"
                  label={i18n.t("admin.create_user.label.country")}
                  disabled={true}
                  onChangeText={(text) => setCountry(text)}
                />
              </View>
              {/* ARRIVAL */}
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
                  enterKeyHint="next"
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
                  onSubmitEditing={() => {
                    this.sixthTextInput.focus();
                  }}
                  ref={(input) => {
                    this.fifthTextInput = input;
                  }}
                  onChangeText={(text) => setArrival(text)}
                />
              </View>
              {/* DEPARTURE */}
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
                  ref={(input) => {
                    this.sixthTextInput = input;
                  }}
                  onChangeText={(text) => setDeparture(text)}
                />
              </View>
              {/* CLEANNING PROGRAM */}
              <Text
                style={[
                  styles.label2,
                  {
                    color:
                      mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                  },
                ]}
              >
                {i18n.t("admin.create_user.step.cleaning_program")}
              </Text>
              <View style={styles.row}>
                <Calendar
                  markedDates={cleaningprogram}
                  minDate={arrival}
                  maxDate={departure}
                  hideExtraDays={true}
                  onDayPress={(day) => handleDateSelection(day)}
                  style={[styles.calendar, (background = "transparent")]}
                  theme={{
                    calendarBackground: "transparent",
                  }}
                  current={arrival}
                />
              </View>
              <Button
                buttonStyle={{ width: 150 }}
                containerStyle={{ margin: 5 }}
                disabledStyle={{
                  borderWidth: 1,
                  borderColor: "#00F",
                }}
                disabledTitleStyle={{ color: "#00F" }}
                loadingProps={{ animating: true }}
                loadingStyle={{}}
                onPress={confirm}
                title="Update User"
                titleStyle={{ marginHorizontal: 5 }}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default EditUserScreen;
const width = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  detailContainer: {
    flexDirection: "column", // Change this line
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "white",
    padding: 25,
    margin: 10,
  },
  formInputs: {
    borderColor: "#D3D3D3",
    marginHorizontal: 10,
    padding: 2,
  },
  input: {
    paddingHorizontal: 3,
    borderColor: "#1A1110",
    borderRadius: 4,
    fontSize: 16,
    fontFamily: "poppins",

    marginLeft: 2,

    borderBottomWidth: 0,
    width: "90%",
  },
  row: {
    flexDirection: "row",
    marginTop: 15,
  },
  label2: {
    fontFamily: "poppins",
    fontSize: 21,
    padding: 0,
    margin: 10,
  },
  calendar: {
    width: width / 1.3,
    borderRadius: 11,
    marginVertical: 5,
    padding: 5,
  },
});
