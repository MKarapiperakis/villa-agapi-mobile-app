import {
  Pressable,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
} from "react-native";

import { getCategoriesSources } from "../constants/ImageSources";

const categoriesImageSources = getCategoriesSources();

function CategoryGridTile({ title, color, onPress, id }) {
  return (
    <ImageBackground
      source={categoriesImageSources[id]}
      resizeMode="cover"
      style={styles.gridItem}
    >
      <Pressable
        android_ripple={{ color: "#ccc" }}
        style={({ pressed }) => [
          styles.button,
          pressed ? styles.buttonPressed : null,
        ]}
        onPress={onPress}
      ></Pressable>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </ImageBackground>
  );
}

export default CategoryGridTile;
const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    margin: 5,
    height: width > 600 ? 260 : 150,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    overflow: "hidden",
  },
  button: {
    flex: 1,
  },
  buttonPressed: {
    opacity: 0.5,
  },
  container: {
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Set the background color with opacity
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 1,
  },
  title: {
    fontSize: 16,
    color: "white",
    marginHorizontal: 3,
    textAlign: "center",
    fontFamily: "poppins",
  },
});
