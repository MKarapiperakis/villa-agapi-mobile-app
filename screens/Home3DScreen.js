import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Dimensions,
  View,
  StyleSheet,
  FlatList,
  Animated,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ImageBackground,
  Switch,
  Easing,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Linking
} from "react-native";
import Image360Viewer from "../components/Image360Viewer";
import _ from "lodash";
import { AuthContext } from "../store/auth-context";
import { Image } from "expo-image";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { ProblemRequest } from "../api/ProblemRequest";
import { Input, Button } from "react-native-elements";
import { showMessage, hideMessage } from "react-native-flash-message";
import * as Clipboard from "expo-clipboard";

function Home3DScreen() {
  const { height } = Dimensions.get("window");
  
  const width = Dimensions.get("window").width;
  const authCtx = useContext(AuthContext);
  const [mode, setMode] = useState("");
  const [subject, setSubject] = useState("");
  const [problem, setProblem] = useState("");
  const [floor, setFloor] = useState(1);
  const [is2D, setIs2D] = useState("true");
  const [isEnabled, setIsEnabled] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef(null);
  const bounceValue = useRef(new Animated.Value(1)).current;
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const images = _.reverse([
    require(`../assets/images/home/1.png`),
    require(`../assets/images/home/2.png`),
    require(`../assets/images/home/3.png`),
    require(`../assets/images/home/4.png`),
    require(`../assets/images/home/5.png`),
    require(`../assets/images/home/6.png`),
    require(`../assets/images/home/6_5.png`),
    require(`../assets/images/home/7.png`),
    require(`../assets/images/home/8.png`),
    require(`../assets/images/home/9.png`),
    require(`../assets/images/home/10.png`),
    require(`../assets/images/home/11.png`),
    require(`../assets/images/home/12.png`),
    require(`../assets/images/home/13.png`),
    require(`../assets/images/home/14.png`),
    require(`../assets/images/home/15.png`),
    require(`../assets/images/home/16.png`),
    require(`../assets/images/home/17.png`),
    require(`../assets/images/home/18.png`),
    require(`../assets/images/home/19.png`),
    require(`../assets/images/home/20.png`),
  ]);

  const data = [
    {
      id: "1",
      image: require("../assets/images/inside/inside7.jpg"),
      title: "Bedroom 1",
      content: [
        "Air conditioning",
        "Double wardrobe",
        "Double bed",
        "Towels",
        "Sheets",
        "Baby cot (on request)",
      ],
    },
    {
      id: "2",
      image: require("../assets/images/inside/inside10.jpg"),
      title: "Bedroom 2",
      content: [
        "Air conditioning",
        "Double wardrobe",
        "Double bed",
        "Towels",
        "Sheets",
      ],
    },
    {
      id: "3",
      image: require("../assets/images/inside/inside9.jpg"),
      title: "Bedroom 3",
      content: ["Double wardrobe", "Single bed", "Towels", "Sheets", "Iron"],
    },
    {
      id: "4",
      image: require("../assets/images/inside/inside11.jpg"),
      title: "Bathroom 1",
      content: ["Bathtub", "Hot water", "Towels", "Hair dryer"],
    },
    {
      id: "5",
      image: require("../assets/images/inside/inside12.jpg"),
      title: "Bathroom 2",
      content: ["Shower", "Hot water"],
    },
    {
      id: "6",
      image: require("../assets/images/inside/inside8.jpg"),
      title: "Second floor",
      content: [
        "Two single beds",
        "Workspace",
        "Air conditioning",
        "First Aid kit",
      ],
    },
    {
      id: "7",
      image: require("../assets/images/inside/inside6.jpg"),
      title: "Kitchen",
      content: [
        "Coffee Machine",
        "Dishwasher",
        "Refrigerator",
        "Microwave",
        "Toaster",
        "Oven",
        "Baby highchair (on request)",
      ],
    },
    {
      id: "8",
      image: require("../assets/images/inside/inside5.jpg"),
      title: "Living room",
      content: [
        "Fireplace",
        "DVD",
        "TV",
        "Washing machine (basement)",
        "Safebox (basement)",
      ],
    },
  ];

  const [totalPages, setTotalPages] = useState(data.length);

  const Image2D = require(`../assets/images/home/2d.png`);
  const floor2 = require(`../assets/images/home/floor2.jpeg`);

  const [isCircleVisible, setIsCircleVisible] = useState(true);
  const arrowBounceValue = useRef(new Animated.Value(1)).current;

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
      arrowBounceValue.setValue(1);
    }
  }, [isCircleVisible]);

  useEffect(() => {
    setMode(authCtx.currentMode);
  }, [authCtx.currentMode]);

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    setIs2D((prevIs2D) => !prevIs2D);
  };

  const updateFloor = (increment) => {
    setFloor((prevFloor) => prevFloor + increment);
  };

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / Dimensions.get("window").width);
    setCurrentPage(page);
  };

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

  const handlePaginationDotPress = (index) => {
    flatListRef.current.scrollToIndex({ index, animated: true });
  };

  const submitProblem = async () => {
    try {
      let response = await ProblemRequest(
        authCtx.userName,
        authCtx.token,
        subject,
        problem
      );

      if (response == "200") {
        setSubject("");
        setProblem("");
        showMessage({
          message: "Your report has been submited!",
          type: "success",
          icon: (props) => (
            <Ionicons name="ios-checkmark-circle" size={18} color="white" />
          ),
        });
      } else {
        showMessage({
          message:
            "There was an error trying to submit your report, please try again later!",
          type: "danger",
          icon: (props) => (
            <MaterialIcons name="error" size={18} color="white" />
          ),
        });
      }
    } catch (error) {
      console.log("error submitting problem ", error);
    }
  };
  function submitHandler() {
    submitProblem();
  }

  const renderItem = ({ item }) => (
    <ImageBackground source={item.image} style={styles.gridItem}>
      <View style={styles.details}>
        <Text style={styles.detailsTitle}>{item.title}</Text>
        <View style={styles.detailsContent}>
          {item.content.map((contentItem, index) => (
            <View key={index} style={styles.contentItemContainer}>
              <Ionicons name="ios-checkmark-circle" size={18} color="white" />
              <Text style={styles.contentItem}>{contentItem}</Text>
            </View>
          ))}
        </View>
      </View>
    </ImageBackground>
  );

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {Array.from({ length: totalPages }).map((_, index) => (
        <Text
          key={index}
          style={[
            styles.paginationDot,
            {
              backgroundColor:
                index === currentPage
                  ? "#2979FF"
                  : mode === "dark"
                  ? "white"
                  : "rgba(0, 0, 0, 0.5)",
            },
          ]}
          // onPress={() => handlePaginationDotPress(index)}
        />
      ))}
    </View>
  );

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: mode === "light" ? "#FFFAFA" : "#121212",
          },
        ]}
      >
        {isCircleVisible && (
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
                isCircleVisible ? "caret-forward-outline" : "caret-back-outline"
              }
              size={23}
              color="#2979FF"
            />
          </Animated.View>
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={[
              styles.floorContainer,
              {
                backgroundColor: mode === "light" ? "#FFFAFA" : "#121212",
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                {
                  color:
                    mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                  borderBottomColor:
                    mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                },
              ]}
            >
              {floor === 1 ? "First" : "Second"} floor{" "}
              {floor === 1 && (
                <MaterialCommunityIcons
                  name="stairs-up"
                  size={21}
                  onPress={() => updateFloor(1)}
                />
              )}
              {floor > 1 && (
                <MaterialCommunityIcons
                  name="stairs-down"
                  size={21}
                  onPress={() => updateFloor(-1)}
                />
              )}
            </Text>

            {!is2D && floor === 1 && (
              <Image360Viewer
                srcset={images}
                width={width}
                height={width > 600 ? width /1.8 : height / 3.5}
              />
            )}
            {is2D && floor === 1 && (
              <Image
                source={Image2D}
                style={{ width: width / 1, height: width > 600 ? width /1.6 : height / 3.5}}
              />
            )}

            {floor === 2 && (
              <Image
                source={floor2}
                style={{
                  width: width / 1.1,
                  height: height / 3,
                  marginBottom: 15,
                  borderRadius: 12,
                }}
              />
            )}

            {floor === 1 && (
              <View style={styles.dimensionSwitch}>
                <Text
                  style={[
                    styles.dimension,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                >
                  2D
                </Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
                <Text
                  style={[
                    styles.dimension,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                >
                  3D
                </Text>
              </View>
            )}
          </View>

          <View>
            <FlatList
              ref={flatListRef}
              data={data}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              onScroll={handleScroll}
              scrollEventThrottle={16}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
            {renderPagination()}
          </View>

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
                Report a problem
              </Text>
              <View style={styles.row}>
                <Input
                  label="Subject"
                  placeholder="Briefly describe your issue"
                  value={subject}
                  maxLength={30}
                  autoCorrect={true}
                  enterKeyHint="next"
                  onChangeText={(text) => setSubject(text)}
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    this.secondTextInput.focus();
                  }}
                  style={[
                    styles.input,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                      borderBottomWidth: 0,
                      width: "90%",
                    },
                  ]}
                  labelStyle={[
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                />
              </View>
              <View style={styles.row}>
                <Input
                  style={[
                    styles.multiInput,
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
                  inputContainerStyle={{
                    borderWidth: 1,
                    borderRadius: 12,
                    padding: 15,
                    marginTop: 12,
                  }}
                  value={problem}
                  label="Description"
                  autoCapitalize="none"
                  placeholder="Describe your problem ..."
                  maxLength={120}
                  autoCorrect={true}
                  multiline={true}
                  numberOfLines={3}
                  ref={(input) => {
                    this.secondTextInput = input;
                  }}
                  onChangeText={(text) => setProblem(text)}
                />
              </View>

              <View style={styles.buttonsContainer}>
                <Button
                  disabled={subject.length === 0 || problem.length === 0}
                  buttonStyle={{ width: 135, height: 40 }}
                  containerStyle={{ margin: 5 }}
                  disabledStyle={{
                    backgroundColor: "#4169E1",
                    opacity: 0.7,
                  }}
                  disabledTitleStyle={{ color: "white" }}
                  linearGradientProps={null}
                  iconContainerStyle={{ background: "#000" }}
                  loadingProps={{ animating: true }}
                  onPress={submitHandler}
                  title="Submit"
                  titleStyle={{ marginHorizontal: 5 }}
                />
              </View>
            </View>
          </View>

          <View style={styles.formInputs}>
            <View
              style={[
                styles.contactContainer,
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
                Contact Information
              </Text>
              <View style={styles.row}>
                <MaterialCommunityIcons
                  name="email"
                  size={27}
                  color={
                    mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)"
                  }
                  style={styles.icon}
                  onPress={() => Linking.openURL(`mailto:villa-agapi@otenet.gr`)}
                />
                <TouchableOpacity
                  onPress={() => copyToClipboard("villa-agapi@otenet.gr")}
                  style={[styles.input]}
                >
                  <TextInput
                    style={[
                      styles.input,
                      {
                        fontSize: 17,
                        color:
                          mode === "light"
                            ? "#000000"
                            : "rgba(245, 245, 245, 1)",
                        borderColor: mode === "light" ? "#1A1110" : "#E0E0E0",
                      },
                    ]}
                    editable={false}
                    value="villa-agapi@otenet.gr"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.row}>
                <MaterialCommunityIcons
                  name="phone"
                  size={27}
                  color={
                    mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)"
                  }
                  onPress={() => Linking.openURL(Platform.OS === "ios" ? `tel://306944247486` : `tel: +30 6944247486`)}
                />
                <TouchableOpacity
                  onPress={() => copyToClipboard("+30 6944247486")}
                  style={[styles.input]}
                >
                  <TextInput
                    style={[
                      styles.input,
                      {
                        fontSize: 17,
                        color:
                          mode === "light"
                            ? "#000000"
                            : "rgba(245, 245, 245, 1)",
                        borderColor: mode === "light" ? "#1A1110" : "#E0E0E0",
                      },
                    ]}
                    editable={false}
                    value="(+30) 6944247486       "
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.row}>
                <MaterialIcons
                  name="sms"
                  size={27}
                  color={
                    mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)"
                  }
                  onPress={() => Linking.openURL(Platform.OS === "ios" ? `sms://306944247486?body=Let me know how I can help you` : `sms:+306944247486?body=Let me know how I can help you`)}
                />
                <TouchableOpacity
                  onPress={() => copyToClipboard("+30 6945773737")}
                  style={[styles.input]}
                >
                  <TextInput
                    style={[
                      styles.input,
                      {
                        fontSize: 17,
                        color:
                          mode === "light"
                            ? "#000000"
                            : "rgba(245, 245, 245, 1)",
                        borderColor: mode === "light" ? "#1A1110" : "#E0E0E0",
                      },
                    ]}
                    editable={false}
                    value="(+30) 6945773737        "
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: "poppins",
    fontSize: 23,

    padding: 0,
    margin: 10,
  },
  label2: {
    fontFamily: "poppins",
    fontSize: 23,
    padding: 0,
    margin: 10,
  },
  dimensionSwitch: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  dimension: {
    fontFamily: "poppins",
    fontSize: 23,
    marginHorizontal: 10,
    paddingVertical: 5,
  },
  floorContainer: {
    flexDirection: "colunmn", // This makes the children Views align horizontally.
    justifyContent: "space-between", // Adjust this to control the spacing between the duration sections.
    alignItems: "center", // Vertically align children in the middle.
    // Add padding to space them out from the edges if needed.
    alignItems: "center",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
    marginTop: 25,
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
    padding: 5,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  paginationDot: {
    width: height < 800 ? 6 : 8,
    height: height < 800 ? 6 : 8,
    borderRadius: 4,
    marginHorizontal: 5,
    overflow: "hidden",
  },
  gridItem: {
    width: Dimensions.get("window").width, // Set width to 100% of the window width
    height: height / 3,
    backgroundColor: "white",
    elevation: 4,
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    overflow: "hidden",
  },
  details: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.50)", // Set the background color with opacity
    textAlign: "center",
    justifyContent: "center",
  },
  detailsTitle: {
    textAlign: "center",
    fontFamily: "poppins",
    color: "white",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    fontSize: 23,
    padding: 3,
  },
  contentItemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  contentItem: {
    fontFamily: "poppins",
    color: "white",
    fontSize: height < 800 ? 14 : 18,
    marginLeft: 8,
    marginTop: 1,
  },
  detailsContent: {
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 8,
  },
  circle: {
    position: "absolute",
    bottom: 14,
    right: 17,
    width: 60,
    height: 60,
    borderRadius: 25,
    zIndex: 99,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleButton: {
    color: "#2979FF", // Adjust the color based on your design
    textAlign: "center",
    marginTop: 10,
    position: "absolute",
    bottom: 30,
    zIndex: 99,
    right: 0,
  },
  input: {
    paddingHorizontal: 3,
    borderColor: "#1A1110",
    borderRadius: 4,
    fontSize: height < 800 ? 14 : 17,
    fontFamily: "poppins",
    marginLeft: 2,
  },
  row: {
    flexDirection: "row",
    marginTop: 15,
  },
  icon: {
    marginTop: 2,
  },
  multiInput: {
    paddingHorizontal: 3,
    borderRadius: 12,
    fontSize: height < 800 ? 14 : 17,
    fontFamily: "poppins",
    width: "90%",
    color: "#4169E1",
    marginLeft: 2,
  },
  buttonsContainer: {
    alignItems: "center",
  },
  sbutton: {
    borderRadius: 6,
    paddingVertical: 5,
    marginHorizontal: 4,
    paddingHorizontal: 23,
    backgroundColor: "#1A1A1A",
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginTop: 21,
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
  contactContainer: {
    flexDirection: "column",
    justifyContent: "center",
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
});

export default Home3DScreen;
