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
import { Calendar } from "react-native-calendars";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import i18n from "../translations/i18n";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { availabilityRequest } from "../api/AddAvailabilityRequest";
import { showMessage, hideMessage } from "react-native-flash-message";

function AvailabilityScreen({ route }) {
  const navigation = useNavigation();
  const { markedDatesObject } = route.params;
  const authCtx = useContext(AuthContext);
  const [mode, setMode] = useState("");
  const [arrivalPicker, setArrivalPicker] = useState(false);
  const [departurePicker, setDeparturePicker] = useState(false);
  const [arrival, setArrival] = useState(new Date());
  const [departure, setDeparture] = useState(new Date());
  const [locale, setLocale] = useState(authCtx.currentLocale.toLowerCase());
  useEffect(() => {
    setLocale(authCtx.currentLocale.toLowerCase());
  }, [authCtx.currentLocale]);

  
  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: mode === "light" ? "#FFFAFA" : "#121212",
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: mode === "light" ? "#000000" : "#ffffff", // Text color
    });
  }, [navigation, mode]);

  i18n.locale = locale;

  useEffect(() => {
    console.log(route.params);
  }, []);

  useEffect(() => {
    setMode(authCtx.currentMode);
  }, [authCtx.currentMode]);

  const showArrivalDatePicker = () => {
    setArrivalPicker(true);
  };

  const hideArrivalDatePicker = () => {
    setArrivalPicker(false);
  };

  const handleArrivalConfirm = (date) => {
    hideArrivalDatePicker();
    setArrival(new Date(date));
  };

  const showDepartureDatePicker = () => {
    setDeparturePicker(true);
  };

  const hideDepartureDatePicker = () => {
    setDeparturePicker(false);
  };

  const handleDepartureConfirm = (date) => {
    hideDepartureDatePicker();
    setDeparture(new Date(date));
  };

  const confirm = () => {
    addAvailability();
  };

  const arrivalDate = arrival.toDateString();
  const departureDate = departure.toDateString();

  const addAvailability = async () => {
    try {
      let response = await availabilityRequest(
        arrival.toISOString().split("T")[0],
        departure.toISOString().split("T")[0],
        authCtx.token
      );

      if (response == 200) {
        showMessage({
          message: "Availability has been updated successfully",
          type: "success",
          icon: () => (
            <Ionicons name="checkmark-circle-outline" size={18} color="white" style={styles.flash} />
          ),
        });
        navigation.navigate("Profile");
      } else {
        showMessage({
          message: "Error updating Availability, please try again later",
          type: "danger",
          icon: () => <MaterialIcons name="error" size={18} color="white" style={styles.flash}/>,
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
            markedDates={markedDatesObject}
          />
          <DateTimePickerModal
            isVisible={departurePicker}
            mode="date"
            onConfirm={handleDepartureConfirm}
            onCancel={hideDepartureDatePicker}
            display={Platform.OS === "ios" ? "inline" : "calendar"}
            date={new Date(departure)}
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
              <Calendar
                hideExtraDays={true}
                style={[
                  styles.calendar,
                  { backgroundColor: "transparent" },
                ]}
                theme={{
                  calendarBackground: "transparent",
                }}
                
                markedDates={markedDatesObject}
              />
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
                  value={arrivalDate}
                  enterKeyHint="next"
                  rightIcon={
                    <Ionicons
                      name="calendar"
                      size={20}
                      color={mode === "light" ? "#121212" : "#FFFAFA"}
                      onPress={showArrivalDatePicker}
                    />
                  }
                  label={i18n.t("admin.create_availability.label.arrival")}
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
                  value={departureDate}
                  rightIcon={
                    <Ionicons
                      name="calendar"
                      size={20}
                      color={mode === "light" ? "#121212" : "#FFFAFA"}
                      onPress={showDepartureDatePicker}
                    />
                  }
                  label={i18n.t("admin.create_availability.label.departure")}
                  disabled={true}
                  ref={(input) => {
                    this.sixthTextInput = input;
                  }}
                  onChangeText={(text) => setDeparture(text)}
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
                title="Submit"
                titleStyle={{ marginHorizontal: 5 }}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default AvailabilityScreen;
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
  flash: {
    marginRight: 2
  }
});
