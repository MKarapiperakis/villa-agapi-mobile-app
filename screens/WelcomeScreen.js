import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Easing,
  Dimensions,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useContext, useRef, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../store/auth-context";
import { UserRequest } from "../api/UserRequest";
import { UserUpdateRequest } from "../api/UserUpdateRequest";
import { Calendar, Agenda } from "react-native-calendars";
import moment from "moment";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import CountryPicker, { DARK_THEME } from "react-native-country-picker-modal";
import { Input } from "react-native-elements";
import AdminComponent from "../components/AdminComponent";
import { Button } from "react-native-elements";
import { showMessage, hideMessage } from "react-native-flash-message";

function WelcomeScreen() {
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCountryName, setSelectedCountryName] = useState("");
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [cleaningDates, setCleaningDates] = useState([]);
  const [items, setItems] = useState({});
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  let token = authCtx.token;
  let userId = authCtx.userId;
  const bounceValue = useRef(new Animated.Value(1)).current;
  const [selected, setSelected] = useState("");
  const [mode, setMode] = useState("");
  const height = Dimensions.get("window").height;
  const width = Dimensions.get("window").width;
  const [isEdit, setIsEdit] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isCircleVisible, setIsCircleVisible] = useState(true);
  const arrowBounceValue = useRef(new Animated.Value(1)).current;
  const [tempfirstName, settempFirstName] = useState("");
  const [templastName, settempLastName] = useState("");
  const [tempemail, settempEmail] = useState("");
  const [tempphone, settempPhone] = useState("");
  const [tempselectedCountryName, settempSelectedCountryName] = useState("");
  const [role, setRole] = useState("");
  

  const toggleCircleVisibility = () => {
    setIsCircleVisible((prevVisibility) => !prevVisibility);
  };

  const startArrowBounceAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(arrowBounceValue, {
          toValue: 1.4,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(arrowBounceValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    if (!isCircleVisible) {
      startArrowBounceAnimation();
    } else {
      // Stop the animation when arrow is expanded
      arrowBounceValue.setValue(1);
    }
  }, [isCircleVisible]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(bounceValue, {
        toValue: 1.2,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.spring(bounceValue, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate("chat");
    });
  };

  useEffect(() => {
    setRole(authCtx.role);
  }, [authCtx.role]);

  useEffect(() => {
    if (!!authCtx.userId) {
      getUser();
    }
  }, [authCtx.userId]);

  useEffect(() => {
    setMode(authCtx.currentMode);
    setLoading(true);
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [authCtx.currentMode]);

  const getUser = async () => {
    try {
      setLoading(true);
      let response = await UserRequest(authCtx.userId, authCtx.token);

      if (response == 401) {
        authCtx.logout();
        console.log("unauthorized");
      } else {
        setMinDate(response.arrival);
        setMaxDate(response.departure);
        setCleaningDates(response.cleaningprogram);

        const minDate = moment(response.arrival, "YYYY-MM-DD HH:mm:ss");
        const maxDate = moment(response.departure, "YYYY-MM-DD HH:mm:ss");
        const cleaningDates = response.cleaningprogram;

        const dateObject = {};
        let currentDate = minDate.clone();

        while (currentDate.isSameOrBefore(maxDate, "day")) {
          const formattedDate = currentDate.format("YYYY-MM-DD");
          dateObject[formattedDate] = [];

          dateObject[formattedDate].push({
            name: "7:00 - 7:30 AM\nCleaning and maintenance of the swimming pool and garden",
          });

          if (formattedDate === minDate.format("YYYY-MM-DD")) {
            dateObject[formattedDate].push({
              name: "16:00 PM\nArrival",
            });
          }

          cleaningDates.forEach((date) => {
            if (date === formattedDate)
              dateObject[formattedDate].push({
                name: "16:30 - 18:00 PM\nInterior house cleaning",
              });
          });

          if (formattedDate === maxDate.format("YYYY-MM-DD")) {
            dateObject[formattedDate].push({
              name: "11:00 AM\nDeparture",
            });
          }

          currentDate.add(1, "day");
        }
        setItems(dateObject);

        setFirstName(response.firstname);
        setLastName(response.lastname);
        setEmail(response.email);
        setPhone(response.phone);
        setSelectedCountryName(response.country);

        if (response) setLoading(false);
      }
    } catch (error) {
      authCtx.logout();
      console.log("error retrieving user information: ", error);
    }
  };

  const updateUser = async () => {
    try {
      let response = await UserUpdateRequest(
        authCtx.userId,
        authCtx.token,
        tempfirstName,
        templastName,
        tempemail,
        tempphone,
        tempselectedCountryName,
        Platform.OS
      );

      if (response == 200) {
        showMessage({
          message: "User has been updated successfully",
          type: "success",
          icon: (props) => (
            <Ionicons name="ios-checkmark-circle" size={18} color="white" />
          ),
        });
      } else {
        showMessage({
          message: "Error updating user information, please try again later",
          type: "danger",
          icon: (props) => (
            <MaterialIcons name="error" size={18} color="white" />
          ),
        });
      }
    } catch (error) {}
  };

  function submitHandler() {
    if (isEdit) {
      updateUser();
      setFirstName(tempfirstName);
      setLastName(templastName);
      setEmail(tempemail);
      setPhone(tempphone);
      setSelectedCountryName(tempselectedCountryName);
    } else {
      settempFirstName(firstName);
      settempLastName(lastName);
      settempEmail(email);
      settempPhone(phone);
      settempSelectedCountryName(selectedCountryName);
    }

    setIsEdit(!isEdit);
  }

  function onPressClose() {
    setIsEdit(!isEdit);
  }

  

  return (
    <View
      style={[
        styles.rootContainer,
        { backgroundColor: mode === "light" ? "#FFFAFA" : "#121212" },
      ]}
    >
      {(loading || !minDate) && (
        <LoadingOverlay
          backgroundColor={mode === "light" ? "#FFFAFA" : "#121212"}
        />
      )}
      {role == "admin" && !loading && <AdminComponent />}

      {role != "admin" && !loading && minDate && (
        <React.Fragment>
          {/* AGENDA */}

          {!loading && !isEdit && (
            <View style={styles.agendaContainer}>
              <Agenda
                style={{
                  maxWidth: width,
                  height: height,
                }}
                theme={{
                  "stylesheet.agenda.main": {
                    reservations: {
                      backgroundColor: mode === "light" ? "#F5F5F5" : "#352A2A",
                      flex: 1,
                      marginTop: 100,
                    },
                  },
                  calendarBackground: mode === "light" ? "#FFFAFA" : "#121212",
                  agendaKnobColor: "#2979FF",
                  agendaDayNumColor: mode === "light" ? "#121212" : "#FFFAFA",
                  agendaDayTextColor: mode === "light" ? "#121212" : "#FFFAFA",
                }}
                minDate={minDate}
                maxDate={maxDate}
                hideExtraDays={true}
                items={items}
                renderEmptyData={(item) => (
                  <View
                    style={[
                      styles.empty,
                      StyleSheet.create({
                        backgroundColor:
                          mode === "light" ? "#FFFAFA" : "#121212",
                        borderBottomWidth: 1,
                        borderBottomColor:
                          mode === "light" ? "#F5F5F5" : "#352A2A",
                      }),
                    ]}
                  >
                    <Ionicons
                      name={"cloud-offline-outline"}
                      size={50}
                      color="#2979FF"
                    />
                  </View>
                )}
                renderItem={(item) => (
                  <View
                    style={[
                      styles.content,
                      StyleSheet.create({
                        backgroundColor:
                          mode === "light" ? "#FFFAFA" : "#121212",
                      }),
                    ]}
                  >
                    <TouchableOpacity
                      style={[
                        styles.item,
                        {
                          backgroundColor:
                            mode === "light" ? "#FFFAFA" : "#121212",
                        },
                      ]}
                    >
                      <Text style={[styles.itemText]}>{item.name}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          )}

          {/* CHATBOT */}
          {isCircleVisible && !loading && (
            <TouchableOpacity style={styles.circle} onPress={handlePress}>
              <Animated.Image
                source={require("../assets/avatar.jpg")}
                style={[
                  { width: 60, height: 60, borderRadius: 25 },
                  { transform: [{ scale: bounceValue }] },
                ]}
              />
            </TouchableOpacity>
          )}

          {/* CHATBOT COLLAPSE */}
          {!loading && (
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={toggleCircleVisibility}
            >
              <Animated.View
                style={{
                  transform: [{ scale: arrowBounceValue }],
                }}
              >
                <Ionicons
                  name={
                    isCircleVisible
                      ? "caret-forward-outline"
                      : "caret-back-outline"
                  }
                  size={23}
                  color="#2979FF"
                />
              </Animated.View>
            </TouchableOpacity>
          )}

          {/* USER INFO */}
          {!loading  && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <KeyboardAvoidingView style={styles.formInputs}>
                <View style={{ zIndex: 10 }}>
                  {isEdit && (
                    <TouchableOpacity
                      onPress={onPressClose}
                      style={styles.closeButton}
                    >
                      <Ionicons
                        name={"close"}
                        size={31}
                        color={mode === "light" ? "#352A2A" : "#FFFAFA"}
                        style={(textAlign = "center")}
                      />
                    </TouchableOpacity>
                  )}
                </View>
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
                          mode === "light"
                            ? "#000000"
                            : "rgba(245, 245, 245, 1)",
                      },
                    ]}
                  >
                    Personal Information
                  </Text>
                  <View
                    style={[
                      styles.inputContainer,
                      { marginBottom: isEdit ? 0 : 10 },
                    ]}
                  >
                    {!isEdit && (
                      <React.Fragment>
                        <Text
                          style={[
                            styles.inputLabel,
                            {
                              color:
                                mode === "light"
                                  ? "#000000"
                                  : "rgba(245, 245, 245, 1)",
                            },
                          ]}
                        >
                          First Name:
                        </Text>
                        <TextInput
                          style={[
                            styles.input,
                            {
                              color:
                                mode === "light"
                                  ? "#000000"
                                  : "rgba(245, 245, 245, 1)",
                              borderColor:
                                mode === "light" ? "#1A1110" : "#E0E0E0",
                              borderBottomWidth: 1,
                            },
                          ]}
                          editable={isEdit}
                          value={firstName}
                          onChangeText={(text) => setFirstName(text)}
                        />
                      </React.Fragment>
                    )}
                    {isEdit && (
                      <Input
                        label="First Name"
                        placeholder="Enter first name"
                        value={tempfirstName}
                        onChangeText={(text) => settempFirstName(text)}
                        maxLength={20}
                        style={[
                          styles.input,
                          {
                            color:
                              mode === "light"
                                ? "#000000"
                                : "rgba(245, 245, 245, 1)",
                            borderWidth: 0,
                          },
                        ]}
                        labelStyle={[
                          {
                            color:
                              mode === "light"
                                ? "#000000"
                                : "rgba(245, 245, 245, 1)",
                          },
                        ]}
                      />
                    )}
                  </View>

                  <View
                    style={[
                      styles.inputContainer,
                      { marginBottom: isEdit ? 0 : 10 },
                    ]}
                  >
                    {!isEdit && (
                      <React.Fragment>
                        <Text
                          style={[
                            styles.inputLabel,
                            {
                              color:
                                mode === "light"
                                  ? "#000000"
                                  : "rgba(245, 245, 245, 1)",
                            },
                          ]}
                        >
                          Last Name:
                        </Text>
                        <TextInput
                          style={[
                            styles.input,
                            {
                              color:
                                mode === "light"
                                  ? "#000000"
                                  : "rgba(245, 245, 245, 1)",
                              borderColor:
                                mode === "light" ? "#1A1110" : "#E0E0E0",
                              borderBottomWidth: 1,
                            },
                          ]}
                          editable={isEdit}
                          value={lastName}
                          onChangeText={(text) => setLastName(text)}
                        />
                      </React.Fragment>
                    )}

                    {isEdit && (
                      <Input
                        label="Last Name"
                        placeholder="Enter last name"
                        value={templastName}
                        onChangeText={(text) => settempLastName(text)}
                        maxLength={35}
                        style={[
                          styles.input,
                          {
                            color:
                              mode === "light"
                                ? "#000000"
                                : "rgba(245, 245, 245, 1)",
                            borderWidth: 0,
                          },
                        ]}
                        labelStyle={[
                          {
                            color:
                              mode === "light"
                                ? "#000000"
                                : "rgba(245, 245, 245, 1)",
                          },
                        ]}
                      />
                    )}
                  </View>

                  <View
                    style={[
                      styles.inputContainer,
                      { marginBottom: isEdit ? 0 : 10 },
                    ]}
                  >
                    {!isEdit && (
                      <React.Fragment>
                        <Text
                          style={[
                            styles.inputLabel,
                            {
                              color:
                                mode === "light"
                                  ? "#000000"
                                  : "rgba(245, 245, 245, 1)",
                            },
                          ]}
                        >
                          Email:{"         "}
                        </Text>
                        <TextInput
                          style={[
                            styles.input,
                            {
                              color:
                                mode === "light"
                                  ? "#000000"
                                  : "rgba(245, 245, 245, 1)",
                              borderColor:
                                mode === "light" ? "#1A1110" : "#E0E0E0",
                              borderBottomWidth: 1,
                            },
                          ]}
                          editable={isEdit}
                          value={email}
                          keyboardType="email-address"
                          onChangeText={(text) => setEmail(text)}
                        />
                      </React.Fragment>
                    )}
                    {isEdit && (
                      <Input
                        label="Email"
                        placeholder="Enter email address"
                        value={tempemail}
                        keyboardType="email-address"
                        maxLength={45}
                        onChangeText={(text) => settempEmail(text)}
                        style={[
                          styles.input,
                          {
                            color:
                              mode === "light"
                                ? "#000000"
                                : "rgba(245, 245, 245, 1)",
                            borderWidth: 0,
                          },
                        ]}
                        labelStyle={[
                          {
                            color:
                              mode === "light"
                                ? "#000000"
                                : "rgba(245, 245, 245, 1)",
                          },
                        ]}
                      />
                    )}
                  </View>

                  <View
                    style={[
                      styles.inputContainer,
                      { marginBottom: isEdit ? 0 : 10 },
                    ]}
                  >
                    {!isEdit && (
                      <React.Fragment>
                        <Text
                          style={[
                            styles.inputLabel,
                            {
                              color:
                                mode === "light"
                                  ? "#000000"
                                  : "rgba(245, 245, 245, 1)",
                            },
                          ]}
                        >
                          Phone:{"        "}
                        </Text>
                        <TextInput
                          style={[
                            styles.input,
                            {
                              color:
                                mode === "light"
                                  ? "#000000"
                                  : "rgba(245, 245, 245, 1)",
                              borderColor:
                                mode === "light" ? "#1A1110" : "#E0E0E0",
                              borderBottomWidth: 1,
                            },
                          ]}
                          editable={isEdit}
                          value={phone}
                          keyboardType="phone-pad"
                          maxLength={20}
                          onChangeText={(text) => setPhone(text)}
                        />
                      </React.Fragment>
                    )}
                    {isEdit && (
                      <Input
                        label="Phone"
                        placeholder="Enter mobile number"
                        value={tempphone}
                        keyboardType="phone-pad"
                        maxLength={20}
                        onChangeText={(text) => settempPhone(text)}
                        style={[
                          styles.input,
                          {
                            color:
                              mode === "light"
                                ? "#000000"
                                : "rgba(245, 245, 245, 1)",
                            borderWidth: 0,
                          },
                        ]}
                        labelStyle={[
                          {
                            color:
                              mode === "light"
                                ? "#000000"
                                : "rgba(245, 245, 245, 1)",
                          },
                        ]}
                      />
                    )}
                  </View>
                  <View
                    style={[
                      styles.inputContainer,
                      { marginBottom: isEdit ? 0 : 10 },
                    ]}
                  >
                    {!isEdit && (
                      <React.Fragment>
                        {
                          <Text
                            style={[
                              styles.inputLabel,
                              {
                                color:
                                  mode === "light"
                                    ? "#000000"
                                    : "rgba(245, 245, 245, 1)",
                              },
                            ]}
                          >
                            Country:{"     "}
                          </Text>
                        }
                        {
                          <TextInput
                            style={[
                              styles.input,
                              {
                                color:
                                  mode === "light"
                                    ? "#000000"
                                    : "rgba(245, 245, 245, 1)",
                                borderColor:
                                  mode === "light" ? "#1A1110" : "#E0E0E0",
                                borderBottomWidth: 1,
                              },
                            ]}
                            editable={false}
                            value={selectedCountryName}
                          />
                        }
                      </React.Fragment>
                    )}
                    {isEdit && (
                      <Input
                        label="Country"
                        placeholder="Select your country"
                        editable={false}
                        value={tempselectedCountryName}
                        rightIcon={
                          <CountryPicker
                            withEmoji
                            withCountryNameButton
                            withFilter
                            onSelect={(country) => {
                              setSelectedCountry(country);
                              settempSelectedCountryName(country.name);
                            }}
                            theme={mode === "dark" ? DARK_THEME : ""}
                            placeholder="🌍"
                          />
                        }
                        style={[
                          styles.input,
                          {
                            color:
                              mode === "light"
                                ? "#000000"
                                : "rgba(245, 245, 245, 1)",
                            borderWidth: 0,
                          },
                        ]}
                        labelStyle={[
                          {
                            color:
                              mode === "light"
                                ? "#000000"
                                : "rgba(245, 245, 245, 1)",
                          },
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.buttonsContainer}>
                    <Button
                      buttonStyle={{ width: 135, height: 40 }}
                      containerStyle={{ margin: 5 }}
                      disabledStyle={{
                        borderWidth: 2,
                        borderColor: "#00F",
                      }}
                      disabledTitleStyle={{ color: "#00F" }}
                      linearGradientProps={null}
                      icon={
                        !isEdit ? (
                          <MaterialCommunityIcons
                            name="account-edit"
                            size={20}
                            color="#FFFAFA"
                          />
                        ) : (
                          <MaterialCommunityIcons
                            name="account-check"
                            size={20}
                            color="#FFFAFA"
                          />
                        )
                      }
                      iconContainerStyle={{ background: "#000" }}
                      loadingProps={{ animating: true }}
                      onPress={submitHandler}
                      title={isEdit ? "Submit" : "Edit"}
                      titleProps={{}}
                      titleStyle={{ marginHorizontal: 5 }}
                    />
                  </View>
                </View>
              </KeyboardAvoidingView>
            </ScrollView>
          )}
        </React.Fragment>
      )}
    </View>
  );
}

export default WelcomeScreen;
const height = Dimensions.get("window").height;
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  agendaContainer: {
    flex: 6,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 8,
    color: "black",
  },
  inputText: {
    fontSize: 22,
    borderBottomColor: "black",
    borderBottomWidth: 2,
    color: "black",
    marginVertical: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
  circle: {
    position: "absolute",
    bottom: 16,
    right: 17,
    width: 60,
    height: 60,
    borderRadius: 25,
    zIndex: 99,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 11,
    marginBottom: 11,
  },
  itemText: {
    color: "#888",
    fontSize: 15,
    fontFamily: "poppins",
    marginBottom: 10,
  },
  calendar: {
    borderRadius: 11,
    maxHeight: height / 1.5,
  },
  formInputs: {
    borderColor: "#D3D3D3",
    marginHorizontal: 10,
    padding: 5,
    marginBottom: 20,
  },
  label: {
    fontFamily: "poppins",
    color: "#000000",
    fontSize: 23,
    marginVertical: 8,
    textAlign: "center",
  },
  detailContainer: {
    flexDirection: "column", // This makes the children Views align horizontally.
    justifyContent: "space-between", // Adjust this to control the spacing between the duration sections.
    alignItems: "center", // Vertically align children in the middle.
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
    marginTop: 12,
  },
  input: {
    borderColor: "#1A1110",
    borderBottomWidth: 0,
    borderRadius: 4,
    fontSize: height < 800 ? 14 : 17,
    fontFamily: "poppins",
    width: "80%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: height < 800 ? 14 : 17,
    marginRight: 8,
    color: "#000000",
    fontFamily: "poppins",
  },
  buttonsContainer: {
    alignItems: "center",
  },
  sbutton: {
    borderRadius: 6,
    paddingVertical: 5,
    marginHorizontal: 4,
    paddingHorizontal: 40,
    backgroundColor: "#1A1A1A",
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
  toggleButton: {
    fontSize: 18,
    color: "#2979FF", // Adjust the color based on your design
    textAlign: "center",
    marginTop: 10,
    position: "absolute",
    bottom: 30,
    zIndex: 99,
    right: 0,
  },
  closeButton: {
    position: "absolute",
    left: 0,
    top: 0,
    paddingHorizontal: 4,
    paddingTop: 10,
  },
  empty: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  content: {},
});
