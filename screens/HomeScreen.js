import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import { Dimensions, View, StyleSheet, Image, FlatList } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { AuthContext } from "../store/auth-context";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import Category from "../models/category";
import CategoryGridTile from "../components/CategoryGridTile";
import {
  getNightImageSources,
  getDayImageSources,
} from "../constants/ImageSources";

function HomeScreen({ route, navigation }) {
  function renderCategoryItem(itemData) {
    function pressHandler() {
      navigation.navigate(itemData.item.title, {
        categoryId: itemData.item.id,
      });
    }

    return (
      <CategoryGridTile
        title={itemData.item.title}
        color={itemData.item.color}
        id={itemData.item.id}
        onPress={pressHandler}
      />
    );
  }

  const width = Dimensions.get("window").width;
  const [imageLoop, setImageLoop] = useState(true);
  const [imagePlay, setImagePlay] = useState(true);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("");

  const CATEGORIES = [
    new Category("0", "Inside", "#f5428d"),
    new Category("1", "Outside", "#f54242"),
    new Category("2", "Activities", "#f5a442"),
    new Category("3", "Locations", "#f5a442"),
  ];

  const dayImageSources = getDayImageSources();

  const nightImageSources = getNightImageSources();

  let authCtx = useContext(AuthContext);

  useEffect(() => {
    setMode(authCtx.currentMode);
  }, [authCtx.currentMode]);

  return (
    <View style={{ flex: 1 }}>
      {/* {loading && (
        <View style={styles.loading}>
          <LoadingOverlay
            backgroundColor={mode === "light" ? "#FFFAFA" : "#121212"}
          />
        </View>
      )} */}

      <Carousel
        loop={imageLoop}
        width={width}
        height={width / 2}
        autoPlay={imagePlay}
        data={[...new Array(6).keys()]}
        scrollAnimationDuration={5000}
        // onSnapToItem={(index) => console.log("current index:", index)}
        renderItem={({ index }) => (
          <View
            style={{
              flex: 1,
              borderWidth: 1,
              justifyContent: "center",
            }}
          >
            <Image
              style={styles.image}
              source={
                mode == "light"
                  ? dayImageSources[index]
                  : nightImageSources[index]
              }
              onLoad={() => {
                setLoading(false);
              }}
            />
          </View>
        )}
      />

      <View
        style={{
          flex: 1,
          backgroundColor: mode === "light" ? "#FFFAFA" : "#121212",
        }}
      >
        <FlatList
          data={CATEGORIES}
          keyExtractor={(item) => item.id}
          renderItem={renderCategoryItem}
          numColumns={2}
        />
      </View>
    </View>
  );
}

const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 22,
  },
});

export default HomeScreen;
