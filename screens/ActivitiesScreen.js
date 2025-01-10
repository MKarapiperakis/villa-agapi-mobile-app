import React, { useContext, useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  FlatList,
  ImageBackground,
  Pressable,
} from "react-native";
import { AuthContext } from "../store/auth-context";
import i18n from "../translations/i18n";
import { useNavigation } from "@react-navigation/native";
const ActivitiesScreen = () => {
  const [mode, setMode] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef(null);
  const width = Dimensions.get("window").width;

  const nav = useNavigation();
  useEffect(() => {
    nav.setOptions({
      headerStyle: {
        backgroundColor: mode === "light" ? "#FFFAFA" : "#121212",
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: mode === "light" ? "#000000" : "#ffffff", // Text color
    });
  }, [nav, mode]);

  const data = [
    { id: "1", image: require("../assets/images/activities/activity1.jpg") },
    { id: "2", image: require("../assets/images/activities/activity2.png") },
    { id: "3", image: require("../assets/images/activities/activity3.jpg") },
    { id: "4", image: require("../assets/images/activities/activity4.jpg") },
    { id: "5", image: require("../assets/images/activities/activity5.jpg") },
    { id: "6", image: require("../assets/images/activities/activity6.jpg") },
    { id: "7", image: require("../assets/images/activities/activity7.jpg") }
  ];

  const authCtx = useContext(AuthContext);
  const [locale, setLocale] = useState(authCtx.currentLocale.toLowerCase());

  useEffect(() => {
    setLocale(authCtx.currentLocale.toLowerCase());
  }, [authCtx.currentLocale]);

  useEffect(() => {
    setMode(authCtx.currentMode);
  }, [authCtx.currentMode]);

  i18n.locale = locale;

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / Dimensions.get("window").width);
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    const nextPage = currentPage + 1;
    if (nextPage < data.length) {
      scrollViewRef.current.scrollTo({ x: nextPage * width, animated: true });
      setCurrentPage(nextPage);
    }
  };

  const goToPrevPage = () => {
    const prevPage = currentPage - 1;
    if (prevPage >= 0) {
      scrollViewRef.current.scrollTo({ x: prevPage * width, animated: true });
      setCurrentPage(prevPage);
    }
  };

  const goToFirstPage = () => {
    scrollViewRef.current.scrollTo({ x: 0, animated: true });
    setCurrentPage(0);
  };

  const goToLastPage = () => {
    const lastPage = data.length - 1;
    scrollViewRef.current.scrollTo({ x: lastPage * width, animated: true });
    setCurrentPage(lastPage);
  };

  return (
    <View
      style={[
        styles.rootContainer,
        { backgroundColor: mode === "light" ? "#FFFAFA" : "#121212" },
      ]}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollViewDetails}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {data.map((item) => (
          <View key={item.id}>
            <ImageBackground
              source={item.image}
              resizeMode="cover"
              style={styles.gridItem}
            ></ImageBackground>
            <View
              style={[
                styles.textContainer,
                { backgroundColor: mode === "light" ? "#FFFAFA" : "#121212" },
              ]}
            >
              <ScrollView
                style={styles.scrollViewDetails}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
              >
                <Text
                  style={[
                    styles.title,
                    { color: mode === "light" ? "#121212" : "#FFFAFA" },
                  ]}
                >
                  {i18n.t(`activities.activity${item.id}.title`)}
                </Text>
                <Text
                  style={[
                    styles.additionalText,
                    { color: mode === "light" ? "#121212" : "#FFFAFA" },
                  ]}
                >
                  {i18n.t(`activities.activity${item.id}.text`)}
                </Text>
              </ScrollView>
            </View>
          
            <View
              style={StyleSheet.create({
                marginBottom: 20,
              })}
            ></View>
          </View>
        ))}
      </ScrollView>
      {/* <View style={styles.pagination}>
              <Pressable
                onPress={goToFirstPage}
                style={[
                  styles.nextPage,
                  {
                    backgroundColor: mode === "light" ? "#121212" : "#FFFAFA",
                    marginRight: 5,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.pageText,
                    { color: mode === "light" ? "#FFFAFA" : "#121212" },
                  ]}
                >
                  {"<<"}
                </Text>
              </Pressable>
              <Pressable
                onPress={goToPrevPage}
                style={[
                  styles.prevPage,
                  { backgroundColor: mode === "light" ? "#121212" : "#FFFAFA" },
                ]}
              >
                <Text
                  style={[
                    styles.pageText,
                    { color: mode === "light" ? "#FFFAFA" : "#121212" },
                  ]}
                >
                  {"<"}
                </Text>
              </Pressable>
              <View style={styles.currentPage}>
                <Text
                  style={[
                    styles.pageText,
                    { color: mode === "light" ? "#121212" : "#FFFAFA" },
                  ]}
                >
                  {" "}
                  {currentPage + 1}
                </Text>
              </View>
              <Pressable
                onPress={goToNextPage}
                style={[
                  styles.nextPage,
                  { backgroundColor: mode === "light" ? "#121212" : "#FFFAFA" },
                ]}
              >
                <Text
                  style={[
                    styles.pageText,
                    { color: mode === "light" ? "#FFFAFA" : "#121212" },
                  ]}
                >
                  {">"}
                </Text>
              </Pressable>
              <Pressable
                onPress={goToLastPage}
                style={[
                  styles.nextPage,
                  { backgroundColor: mode === "light" ? "#121212" : "#FFFAFA" },
                ]}
              >
                <Text
                  style={[
                    styles.pageText,
                    { color: mode === "light" ? "#FFFAFA" : "#121212" },
                  ]}
                >
                  {">>"}
                </Text>
              </Pressable>
            </View> */}
    </View>
  );
};

export default ActivitiesScreen;

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  scrollViewDetails: {
    flex: 1,
  },
  gridItem: {
    width: width,
    height: height / 3,
    backgroundColor: "white",
    elevation: 4,
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    overflow: "hidden",
  },
  container: {
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Set the background color with opacity
  },
  title: {
    fontSize: width > 600 ? 31 : 22,
    color: "white",
    marginHorizontal: 3,
    textAlign: "center",
    fontFamily: "poppinsBold",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 15
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: "white",
  },
  textContainer: {
    padding: 2,
    flex: 1,
    width: width,
    alignItems: "center",
  },
  additionalText: {
    fontSize: width > 600 ? 24 : 17,
    color: "white",
    fontFamily: "openSans",
    textAlign: "justify",
    width: width - 10,
    margin: 5,
    paddingHorizontal: 6,
  },
  currentPage: {
    padding: 10,
    alignItems: "center",
    alignSelf: "center",
  },

  prevPage: {
    padding: 6,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 5,
    zIndex: 1,
    alignItems: "center", // Center horizontally
    justifyContent: "center", // Center vertically
    paddingHorizontal: 15
  },

  nextPage: {
    padding: 6,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 5,
    zIndex: 1,
    alignItems: "center", // Center horizontally
    justifyContent: "center", // Center vertically
    marginLeft: 5,
    paddingHorizontal: 15
  },

  pageText: {
    color: "white",
    fontFamily: "poppinsBold",
    fontSize: 17
  },
});
