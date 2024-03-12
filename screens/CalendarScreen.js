import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Pressable,
  Modal,
  Platform,
} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { Picker } from "@react-native-picker/picker";
import { Button } from "react-native-elements";
import { BookingRequest } from "../api/BookingRequest";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { availabilityRequest } from "../api/AvailabilityRequest";
import { AuthContext } from "../store/auth-context";
import { Input } from "react-native-elements";

function CalendarScreen() {
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [maxDate, setMaxDate] = useState(new Date(2050, 11, 1));
  const [peopleValue, setPeopleValue] = useState("3");
  const [modalVisible, setModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [bookingErrorModalVisible, setbookingErrorModalVisible] =
    useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [disabledDates, setDisabledDates] = useState([]);
  const [mode, setMode] = useState("");
  const authCtx = useContext(AuthContext);

  const minDate = new Date(); // Today

  let startDate = selectedStartDate ? selectedStartDate.toString() : "";
  let endDate = selectedEndDate ? selectedEndDate.toString() : "";

  const getAvailability = async () => {
    try {
      const response = await availabilityRequest();

      if (!!response) {
        let res = response.disabledDates;
        const datesArray = res.map((item) => new Date(item.date));

        setDisabledDates(datesArray);
      }
    } catch (error) {
      console.log("error retrieving availability: ", error);
    }
  };

  useEffect(() => {
    getAvailability();
  }, []);

  useEffect(() => {
    setMode(authCtx.currentMode);
  }, [authCtx.currentMode]);

  async function booking(
    peopleValue,
    fullName,
    email,
    startDate,
    endDate,
    comments
  ) {
    try {
      setLoading(true);
      const res = await BookingRequest(
        peopleValue,
        fullName,
        email,
        startDate,
        endDate,
        comments
      );

      if (res == "success") {
        setLoading(false);
        setModalVisible(true);
        setSelectedStartDate("");
        setSelectedEndDate("");
        setComments("");
        setEmail("");
        setFullName("");
      } else {
        setLoading(false);
        setbookingErrorModalVisible(true);

        setSelectedStartDate("");
        setSelectedEndDate("");
        setComments("");
        setEmail("");
        setFullName("");
      }
    } catch (error) {
      console.log("booking request error: ", error);
    }
  }

  const handleDateChange = (date, type) => {
    if (type === "START_DATE") {
      const filteredDates = disabledDates.filter(
        (disabledDate) => disabledDate > date
      );

      const sortedDates = filteredDates.sort((a, b) => a - b);

      setMaxDate(
        sortedDates.length > 0 ? sortedDates[0] : new Date(2050, 11, 1)
      );

      setSelectedStartDate(date);
      startDate = date;
    } else if (type === "END_DATE") {
      if (selectedEndDate == null) setMaxDate(new Date(2050, 11, 1));
      setSelectedEndDate(date);
      endDate = date;
    }
  };

  const handlePeopleChange = (itemValue) => {
    setPeopleValue(itemValue);
  };

  function submitHandler() {
    let isValid;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (
      fullName.trim().length >= 1 &&
      emailRegex.test(email) &&
      startDate != "" &&
      endDate != ""
    )
      isValid = true;
    else isValid = false;

    if (isValid) {
      booking(peopleValue, fullName, email, startDate, endDate, comments);
    } else setErrorModalVisible(true);
  }

  if (isLoading) {
    return (
      <LoadingOverlay
        backgroundColor={mode === "light" ? "#FFFAFA" : "#121212"}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: mode === "light" ? "#FFFAFA" : "#121212" },
      ]}
      behavior="position"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Your request has been submited, you will have news soon in the
                  given email!
                </Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>OK</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={errorModalVisible}
            onRequestClose={() => {
              setErrorModalVisible(!errorModalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Please check your input and try again.
                </Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setErrorModalVisible(!errorModalVisible)}
                >
                  <Text style={styles.textStyle}>OK</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={bookingErrorModalVisible}
            onRequestClose={() => {
              setModalVisible(!bookingErrorModalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Booking request service is unavbailable at this moment, please
                  check your internet connection or try again later.
                </Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() =>
                    setbookingErrorModalVisible(!bookingErrorModalVisible)
                  }
                >
                  <Text style={styles.textStyle}>OK</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          <View
            style={[
              styles.calendar,
              { backgroundColor: mode === "light" ? "#FFFAFA" : "#121212" },
            ]}
          >
            <CalendarPicker
              startFromMonday={true}
              allowRangeSelection={true}
              minDate={minDate}
              maxDate={maxDate}
              selectedDayColor="#66ff33"
              selectedDayTextColor="#000000"
              scaleFactor={375}
              textStyle={{
                fontFamily: "poppins",
                color: mode === "light" ? "#000000" : "white",
              }}
              todayBackgroundColor="#E5FFCC"
              onDateChange={handleDateChange}
              disabledDates={disabledDates}
              disabledDatesTextStyle={{ color: "gray" }}
            />
          </View>

          <View style={styles.formInputs}>
            <View
              style={[
                styles.pickerContainer,
                {
                  backgroundColor: mode === "light" ? "#FFFAFA" : "#352A2A",
                },
              ]}
            >
              <Text
                style={[
                  styles.label,
                  {
                    color:
                      mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                  },
                ]}
              >
                Number of Visitors
              </Text>
              <Picker
                selectedValue={peopleValue}
                dropdownIconColor={mode === "light" ? "black" : "white"}
                onValueChange={handlePeopleChange}
                style={{
                  color: mode === "light" ? "black" : "white",
                }}
                selectionColor={'mode === "light" ? "#A9A0A01A" : "#000001A"'}
              >
                <Picker.Item
                  label="1"
                  value="1"
                  color={
                    mode === "light"
                      ? "#121212"
                      : Platform.OS === "android"
                      ? "black"
                      : Platform.OS === "ios"
                      ? "white"
                      : "#FFFAFA"
                  }
                />
                <Picker.Item
                  label="2"
                  value="2"
                  color={
                    mode === "light"
                      ? "#121212"
                      : Platform.OS === "android"
                      ? "black"
                      : Platform.OS === "ios"
                      ? "white"
                      : "#FFFAFA"
                  }
                />
                <Picker.Item
                  label="3"
                  value="3"
                  color={
                    mode === "light"
                      ? "#121212"
                      : Platform.OS === "android"
                      ? "black"
                      : Platform.OS === "ios"
                      ? "white"
                      : "#FFFAFA"
                  }
                />
                <Picker.Item
                  label="4"
                  value="4"
                  color={
                    mode === "light"
                      ? "#121212"
                      : Platform.OS === "android"
                      ? "black"
                      : Platform.OS === "ios"
                      ? "white"
                      : "#FFFAFA"
                  }
                />
                <Picker.Item
                  label="5"
                  value="5"
                  color={
                    mode === "light"
                      ? "#121212"
                      : Platform.OS === "android"
                      ? "black"
                      : Platform.OS === "ios"
                      ? "white"
                      : "#FFFAFA"
                  }
                />
                <Picker.Item
                  label="6"
                  value="6"
                  color={
                    mode === "light"
                      ? "#121212"
                      : Platform.OS === "android"
                      ? "black"
                      : Platform.OS === "ios"
                      ? "white"
                      : "#FFFAFA"
                  }
                />
                <Picker.Item
                  label="7"
                  value="7"
                  color={
                    mode === "light"
                      ? "#121212"
                      : Platform.OS === "android"
                      ? "black"
                      : Platform.OS === "ios"
                      ? "white"
                      : "#FFFAFA"
                  }
                />
                {/* Add more people as needed */}
              </Picker>
            </View>

            {!!startDate && (
              <View style={styles.durationContainer}>
                <Text
                  style={[
                    styles.label,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                >
                  From:
                </Text>
                <Text
                  style={[
                    styles.dateText,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                >
                  {startDate.toString().split(" ").slice(1, 4).join(" ")}
                </Text>

                <Text
                  style={[
                    styles.label,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                >
                  To:
                </Text>
                <Text
                  style={[
                    styles.dateText,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                >
                  {endDate.toString().split(" ").slice(1, 4).join(" ")}
                </Text>
              </View>
            )}

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
                  styles.label,
                  {
                    color:
                      mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    marginBottom: 20,
                  },
                ]}
              >
                Personal Information
              </Text>

              <Input
                style={[
                  styles.input,
                  {
                    color:
                      mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    borderColor: mode === "light" ? "#1A1110" : "#E0E0E0",
                  },
                ]}
                inputContainerStyle={{ marginHorizontal: 20 }}
                autoCapitalize="none"
                placeholder="Full Name"
                placeholderTextColor="#A0A0A0"
                maxLength={25}
                autoComplete="name"
                autoCorrect={false}
                onChangeText={(text) => setFullName(text)}
              />
              <Input
                style={[
                  styles.input,
                  {
                    color:
                      mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    borderColor: mode === "light" ? "#1A1110" : "#E0E0E0",
                  },
                ]}
                inputContainerStyle={{ marginHorizontal: 20 }}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="#A0A0A0"
                placeholder="Email"
                maxLength={30}
                autoComplete="email"
                autoCorrect={false}
                onChangeText={(text) => setEmail(text)}
              />

              <Input
                style={[
                  styles.input,
                  {
                    color:
                      mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    borderColor: mode === "light" ? "#1A1110" : "#E0E0E0",
                  },
                ]}
                inputContainerStyle={{ marginHorizontal: 20 }}
                autoCapitalize="none"
                placeholder="Additional Comments"
                placeholderTextColor="#A0A0A0"
                maxLength={120}
                multiline={true}
                autoCorrect={false}
                onChangeText={(text) => setComments(text)}
              />
            </View>

            <View style={styles.buttonsContainer}>
              <View style={styles.buttons}>
                <Button
                  buttonStyle={styles.sbutton}
                  containerStyle={{ margin: 5 }}
                  disabledStyle={{
                    borderWidth: 0.5,
                    borderColor: "#00F",
                  }}
                  disabledTitleStyle={{ color: "#00F" }}
                  linearGradientProps={null}
                  iconContainerStyle={{ background: "#000" }}
                  loadingProps={{ animating: true }}
                  onPress={submitHandler}
                  title="Submit"
                  titleStyle={{ marginHorizontal: 5 }}
                />
                <Text
                  style={[
                    styles.small,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                >
                  You will not be charged yet
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAFA",
  },
  calendar: {
    backgroundColor: "white",
  },
  formInputs: {
    borderTopWidth: 1,
    borderColor: "#D3D3D3",
    marginHorizontal: 10,
    padding: 5,
  },
  label: {
    fontFamily: "poppins",
    color: "#000000",
    fontSize: 21,
    textAlign: "center",
  },
  dateText: {
    fontFamily: "poppinsBold",
    color: "#000000",
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: "white",
    shadowColor: "#000",
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    marginVertical: 8,
    paddingHorizontal: 16,
    padding: 35,
  },
  durationContainer: {
    flexDirection: "row", // This makes the children Views align horizontally.
    justifyContent: "space-between", // Adjust this to control the spacing between the duration sections.
    alignItems: "center", // Vertically align children in the middle.
    paddingHorizontal: 16, // Add padding to space them out from the edges if needed.
    padding: 5,
  },
  detailContainer: {
    flexDirection: "colunmn", // This makes the children Views align horizontally.
    justifyContent: "space-between", // Adjust this to control the spacing between the duration sections.
    alignItems: "center", // Vertically align children in the middle.
    paddingHorizontal: 16, // Add padding to space them out from the edges if needed.
    borderRadius: 20,
    padding: 25,
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
    marginTop: 5,
  },
  buttonsContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
    padding: 15,
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderColor: "#1A1110",
    borderBottomWidth: 0,
    borderRadius: 4,
    fontSize: 16,
    fontFamily: "poppins",
    width: "80%",
  },
  multiInput: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderColor: "#1A1110",
    borderBottomWidth: 1,
    borderRadius: 4,
    fontSize: 16,
    fontFamily: "poppins",
    width: "80%",
    height: 60,
    textAlignVertical: "top",
    justifyContent: "flex-start",
  },
  buttons: {
    width: "60%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 30,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "poppins",
  },
  sbutton: {
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  small: {
    textAlign: "center",
    fontFamily: "poppins",
    fontSize: 10,
  },
});
