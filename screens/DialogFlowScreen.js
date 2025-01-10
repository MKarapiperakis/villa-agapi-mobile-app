import React, { useState, useEffect, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  SafeAreaView,
  Platform
} from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { dialogFlowRequest } from "../api/DialogFlowRequest";
import { AuthContext } from "../store/auth-context";
import { useNavigation } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";

function DialogFlowScreen() {
  const [messages, setMessages] = useState([]);
  const [chatbotResponse, setChatBotResponse] = useState("");
  const [typing, setTyping] = useState(false);
  const [mode, setMode] = useState("");
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();



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

  useEffect(() => {
    sendWelcomeMessage();
  }, []);

  useEffect(() => {
    setMode(authCtx.currentMode);
  }, [authCtx.currentMode]);

  async function dialogFlowIntegration(text) {
    try {
      setTyping(true);
      const res = await dialogFlowRequest(text);
      setChatBotResponse(res.response);
      setTyping(false);
      const botMessage = {
        _id: Math.random().toString(36).substring(7),
        text: res.response,
        createdAt: new Date(),

        user: {
          _id: 2,
          name: "Chatbot",
          avatar: require("../assets/avatar.jpg"),
        },
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [botMessage])
      );

      if (res.response === "Of course, how can I help you?") {
        generalMessage(
          "Here are some common questions:\nWifi\nContact host\nEmergency\nInformation\nProblem\nOther"
        );
      }
      if (res.response === "What kind of problem?") {
        generalMessage(
          "Here are some common problems:\nWifi\nAir condition\nElectricity\nHouse keys\nOther"
        );
      }
      if (res.response === "What kind of information do you need?") {
        generalMessage(
          "Here are some common cases:\nWifi\nLocal area\nCharges\nHouse keys\nWater\nOther"
        );
      }
      if (res.response === "Of course, I am connecting you with Manos.") {
        setTimeout(() => {
          navigation.navigate("Live Chat", {
            userId: authCtx.userId,
            name: authCtx.userName,
            role: authCtx.role,
          });
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const sendWelcomeMessage = () => {
    const welcomeMessage = {
      _id: Math.random().toString(36).substring(7),
      text: "Welcome! How may I assist you today?  I'm here to address any inquiries you may have about the house and the surrounding area. If you wish to communicate directly with your host, simply type 'connect me with host,' and you'll be connected for a personalized chat experience",
      createdAt: new Date(),
      user: {
        _id: 2,
        name: "Chatbot",
        avatar: require("../assets/avatar.jpg"),
      },
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [welcomeMessage])
    );
  };

  const generalMessage = (res) => {
    const genMessage = {
      _id: Math.random().toString(36).substring(7),
      text: res,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: "Chatbot",
        avatar: require("../assets/avatar.jpg"),
      },
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [genMessage])
    );
  };

  const onSend = (newMessages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
    const userMessage = newMessages[0].text;

    dialogFlowIntegration(userMessage);

    Keyboard.dismiss();
  };

  //change message box
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#121212",
          },
        }}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container,{ backgroundColor: mode === "light" ? "#FFFAFA" : "#121212" }]}>
      <GiftedChat
        messages={messages}
        isTyping={typing}
        scrollToBottom
        // renderBubble={renderBubble}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: 1,
        }}
      />
    </SafeAreaView>
  );
}

export default DialogFlowScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    fontFamily: "poppins",
  },
  background: {
    flex: 1,
  },
});
