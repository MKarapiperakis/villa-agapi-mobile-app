import {
  Pressable,
  View,
  Text,
  StyleSheet,
  Platform,
  ImageBackground,
  Image,
  Modal,
  Dimensions,
} from "react-native";

import { useContext, useEffect, useState } from "react";

import { getOutsideSources } from "../constants/ImageSources";
import ModalButton from "./ui/ModalButton";

const outsideImageSources = getOutsideSources();

function outsidemageComponent({ title, id }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <ImageBackground
      source={outsideImageSources[id]}
      resizeMode="cover"
      style={styles.gridItem}
    >
      <Pressable
        android_ripple={{ color: "#ccc" }}
        style={({ pressed }) => [
          styles.button,
          pressed ? styles.buttonPressed : null,
        ]}
        onPress={() => {
          setSelectedImage(outsideImageSources[id]);
          setModalVisible(true);
        }}
      ></Pressable>

      
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <Pressable
            // android_ripple={{ color: "#ccc" }}
            onPress={() => {
              setModalVisible(false);
            }}
          >
            <ModalButton
              icon="close"
              color={"white"}
              size={36}
              onPress={() => {
                setModalVisible(false);
              }}
            />

            <Image
              source={outsideImageSources[id]}
              resizeMode="cover"
              style={styles.imageItem}
            />
          </Pressable>
        </View>
      </Modal>
    </ImageBackground>
  );
}

export default outsidemageComponent;
const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    margin: 5,
    height: width > 600 ? 260 : 140,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    overflow: "hidden",
  },
  imageItem: {
    width: Dimensions.get("window").width,
    height: width > 600 ? 530 : 300,
    borderRadius: 5,
    // resizeMode: "cover",
  },
  button: {
    flex: 1,
  },
  buttonPressed: {
    opacity: 0.5,
  },
  container: {
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Set the background color with opacity
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 1,
  },
  centeredView: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.60)", // Set the background color with opacity
    alignItems: "center",
    elevation: 155,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    flex: 1,
    justifyContent: "center",
    overflow: "hidden",
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
});
