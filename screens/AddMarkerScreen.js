import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Pressable,
  Text,
  FlatList,
} from "react-native";
import { AuthContext } from "../store/auth-context";
import { getAddress, calculateDistance } from "../util/location";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import { Input, Button } from "react-native-elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from "@react-navigation/native";
import { MarkerCreateRequest } from "../api/MarkerCreateRequest";
import i18n from "../translations/i18n";
import { showMessage, hideMessage } from "react-native-flash-message";
import { Picker } from "@react-native-picker/picker";
import MapView, { Marker } from "react-native-maps";
import LoadingOverlay from "../components/ui/LoadingOverlay";
function AddMarkerScreen() {
  const authCtx = useContext(AuthContext);
  const [mode, setMode] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState("");
  const [markerType, setMarkerType] = useState("food");
  const [keyWords, setKeyWords] = useState([]);
  const [inputWord, setInputWord] = useState("");
  const [isAddKeyWordDisabled, setIsAddKeyWordDisabled] = useState(true);
  const [pin, setPin] = useState({
    latitude: 35.26335507678177,
    longitude: 25.238502809890747,
  });
  const [markerAddress, setMarkerAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [locale, setLocale] = useState(authCtx.currentLocale.toLowerCase());
  useEffect(() => {
    setLocale(authCtx.currentLocale.toLowerCase());
  }, [authCtx.currentLocale]);

  i18n.locale = locale;


  const navigation = useNavigation();
  let progress = getProgress();

  function getProgress() {
    if (currentStep == 1) return 0;
    else if (currentStep == 3) return 1;
    else return currentStep * 0.3;
  }

  const isFirstStepValid = () => {
    if (title.trim().length > 0) return false;
    else return true;
  };

  const isSecondStepValid = () => {
    return !keyWords.length > 0;
  };

  const addKeyWord = () => {
    const keyWordsArray = keyWords.slice(); // Create a copy of the array
    keyWordsArray.push(inputWord);
    setKeyWords(keyWordsArray);
    setInputWord(""); // Clear the input after adding a keyword

    setIsAddKeyWordDisabled(true);
    console.log(isAddKeyWordDisabled);
  };

  const removeKeyWord = (index) => {
    const keyWordsArray = keyWords.slice(); // Create a copy of the array
    keyWordsArray.splice(index, 1); // Remove the keyword at the specified index
    setKeyWords(keyWordsArray);
    setIsAddKeyWordDisabled(true);

    console.log(isAddKeyWordDisabled);
  };

  const getIcon = () => {
    let icon;
    switch (markerType) {
      case "food":
        icon = "restaurant";
        break;
      case "fastFood":
        icon = "fast-food";
        break;
      case "drink":
        icon = "cafe";
        break;
      case "market":
        icon = "cart";
        break;
      case "bank":
        icon = "logo-euro";
        break;
      case "activities":
        icon = "happy";
        break;
      case "publicServices":
        icon = "business";
        break;
      case "beach":
        icon = "sunny";
        break;
      case "monuments":
        icon = "map";
        break;
      case "health":
        icon = "heart-circle-outline";
        break;
      case "gas_station":
        icon = "car";
        break;
      default:
        icon = "location";
        break;
    }

    return icon;
  };
  const submit = () => {
    createMarker();
  };

  const createMarker = async () => {
    const icon = getIcon();
    keyWords.push("all");
    try {
      let response = await MarkerCreateRequest(
        authCtx.token,
        title,
        markerType,
        keyWords,
        pin,
        icon
      );

      console.log(response);

      if (response == 201) {
        showMessage({
          message: "Marker has been created successfully",
          type: "success",
          icon: () => (
            <Ionicons name="ios-checkmark-circle" size={18} color="white" />
          ),
        });
        navigation.navigate("Profile");
      } else {
        showMessage({
          message: "Error creating marker, please try again later",
          type: "danger",
          icon: () => <MaterialIcons name="error" size={18} color="white" />,
        });
      }
    } catch (error) {}
  };

  const moveMarker = async (coordinate) => {
    setPin(coordinate);
    let markerAddress = await getAddress(
      coordinate.latitude,
      coordinate.longitude
    );

    setMarkerAddress(markerAddress);
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
              width={130}
              color="#228B22"
              style={styles.progressBar}
            />
            <View style={styles.header}>
              {[1, 2, 3].map((step) => (
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
                  {i18n.t("admin.create_marker.step.marker_information")}
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
                  value={title}
                  label={i18n.t("admin.create_marker.label.title")}
                  labelStyle={[
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  placeholder=""
                  autoCapitalize="none"
                  maxLength={20}
                  onChangeText={(text) => setTitle(text)}
                />
              </View>
              <View style={styles.row2}>
                <Text
                  style={[
                    styles.label,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                        
                    },
                  ]}
                >
                  {i18n.t("admin.create_marker.label.type")}
                </Text>
              </View>
              <View style={styles.row2}>
                <Picker
                  style={[
                    styles.picker,
                    { color: mode === "light" ? "black" : "white" },
                  ]}
                  selectedValue={markerType}
                  dropdownIconColor={mode === "light" ? "black" : "white"}
                  onValueChange={(itemValue) => {
                    setMarkerType(itemValue);
                  }}
                  selectionColor={'mode === "light" ? "#A9A0A01A" : "#000001A"'}
                >
                  <Picker.Item
                    label="Food"
                    value="food"
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
                    label="Bank"
                    value="bank"
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
                    label="Drink"
                    value="drink"
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
                    label="Beach"
                    value="beach"
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
                    label="Market"
                    value="market"
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
                    label="Health"
                    value="health"
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
                    label="Fast Food"
                    value="fastFood"
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
                    label="Activities"
                    value="activities"
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
                    label="Monuments"
                    value="monuments"
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
                    label="Gas Station"
                    value="gas_station"
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
                </Picker>
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
                  {i18n.t("admin.create_marker.step.key_words")}
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
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  rightIcon={
                    <Ionicons
                      disabled={isAddKeyWordDisabled}
                      name="add-circle"
                      size={26}
                      color={
                        isAddKeyWordDisabled
                          ? "rgba(102, 204, 153,0.3)"
                          : "green"
                      }
                      onPress={addKeyWord}
                    />
                  }
                  maxLength={12}
                  value={inputWord}
                  label={i18n.t("admin.create_marker.label.key_words")}
                  autoCapitalize="none"
                  onChangeText={(text) => {
                    setInputWord(text.trim());
                    setIsAddKeyWordDisabled(
                      text.trim().length == 0 || keyWords.length > 7
                    );
                  }}
                />
              </View>
              <View style={styles.row}>
                <FlatList
                  data={keyWords}
                  numColumns={3}
                  renderItem={({ item, index }) => (
                    <View
                      style={[
                        styles.flatListElement,
                        {
                          backgroundColor:
                            mode === "light" ? "white" : "#121212",
                        },
                      ]}
                    >
                      <View style={styles.closeIcon}>
                        <Ionicons
                          name="close-circle-outline"
                          size={20}
                          color="red"
                          onPress={() => removeKeyWord(index)}
                        />
                      </View>
                      <Text
                        style={{
                          color:
                            mode === "light"
                              ? "#000000"
                              : "rgba(245, 245, 245, 1)",
                        }}
                      >
                        {item}
                      </Text>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
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
                  onPress={() => {
                    setIsLoading(true);
                    setTimeout(() => {
                      setIsLoading(false);
                    }, 2000);
                    setCurrentStep(3);
                  }}
                  title="Next"
                  titleProps={{}}
                  titleStyle={{ marginHorizontal: 5 }}
                />
              </View>
            </View>
          )}

          {/* STEP 3 */}
          {currentStep == 3 && !isLoading && (
            <View>
              <View style={styles.row}>
                <MapView
                  style={styles.map}
                  provider="google"
                  showsCompass={true}
                  showsTraffic={true}
                  showsBuildings={false}
                  showsIndoors={true}
                  minZoomLevel={0}
                  maxZoomLevel={20}
                  // zoomControlEnabled={true}

                  rotateEnabled={true}
                  scrollEnabled={true}
                  loadingEnabled={true}
                  initialRegion={{
                    latitude: 35.26335507678177,
                    longitude: 25.238502809890747,
                    latitudeDelta: 0.6,
                    longitudeDelta: 0.6,
                  }}
                >
                  <Marker
                    draggable={true}
                    coordinate={pin}
                    onDragEnd={(e) => {
                      moveMarker(e.nativeEvent.coordinate);
                    }}
                  >
                    <Ionicons name={"location"} size={31} color="#4169E1" />
                  </Marker>
                </MapView>
              </View>
              {markerAddress != "" && (
                <View style={styles.row}>
                  <Input
                    style={[
                      styles.input,
                      {
                        color:
                          mode === "light"
                            ? "#000000"
                            : "rgba(245, 245, 245, 1)",
                      },
                    ]}
                    value={markerAddress}
                    label={i18n.t("admin.create_marker.label.address")}
                    labelStyle={[
                      {
                        color:
                          mode === "light"
                            ? "#000000"
                            : "rgba(245, 245, 245, 1)",
                      },
                    ]}
                    multiline={true}
                    disabled={true}
                    placeholder=""
                    autoCapitalize="none"
                  />
                </View>
              )}

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

          {currentStep == 3 && isLoading && (
            <LoadingOverlay
              backgroundColor={mode === "light" ? "#FFFAFA" : "#121212"}
            />
          )}

          <View style={styles.footer}></View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default AddMarkerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 11,
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
    padding: 25,
    margin: 10,
  },
  formInputs: {
    borderColor: "#D3D3D3",
    padding: 5,
    justifyContent: "center",
    width: "90%",
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
  picker: {
    flex: 1,
  },
  row2: {
    flexDirection: "row",
    justifyContent: "left",
  },
  label: {
    marginLeft: 12,
    fontFamily: "poppins",
    fontSize: 16,
  },
  input: {
    fontFamily: "poppins",
    fontSize: 16,
  },
  flatListElement: {
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "white",
    padding: 11,
    paddingBottom: 2,
    paddingTop: 21,
    margin: 5,
    flexShrink: 1,
    minWidth: 50,
  },
  closeIcon: {
    position: "absolute",
    top: 2,
    left: 2,
    paddingBottom: 4,
  },
  map: {
    minHeight: 250,
    minWidth: "100%",
  },
});
