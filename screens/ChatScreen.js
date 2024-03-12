import React, { useState, useEffect, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, SafeAreaView, Keyboard } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { showMessage } from "react-native-flash-message";
import socket from "../util/socket";
import { AuthContext } from "../store/auth-context";
import { LinearGradient } from "expo-linear-gradient";

const Chatscreen = ({ route }) => {
  const { userId, name, role } = route.params;
  const authContext = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [mode, setMode] = useState("");
  const [typing, setTyping] = useState(false);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    setMode(authCtx.currentMode);
  }, [authCtx.currentMode]);

  useEffect(() => {
    if (role !== "admin") {
      showMessage({
        message: `Your host will be here soon to help you. Please wait!`,
        type: "info",
      });
    }

    socket.connect();

    socket.emit("join-room", "room", name, (message) => {});

    const handleJoined = (username) => {
      if (name === username) {
        console.log("user joined the chat room");
      } else {
        showMessage({
          message: `User ${username} has joined the chat room`,
          type: "info",
        });
      }
    };

    const handleDisconnected = (username) => {
      if (name === username) {
        console.log("user left the chat room");
      } else {
        showMessage({
          message: `User ${username} has left the chat room`,
          type: "info",
        });
      }
    };

    const handleReceiveMessage = (message) => {
      console.log(`receive message id is ${JSON.stringify(message)}`);

      const response = {
        _id: Math.random().toString(36).substring(7),
        text: message.text,
        createdAt: new Date(),
        user: {
          _id: message.user.userId,
          name: message.user.name,
          avatar:
            message.user.role === "admin"
              ? require("../assets/person.jpg")
              : "",
        },
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [response])
      );
    };

    const handleTyping = (username) => {
      setTyping(true);
    };

    const handleNotTyping = (username) => {
      setTyping(false);
    };

    socket.on("joined", handleJoined);
    socket.on("disconnected", handleDisconnected);
    socket.on("receive-message", handleReceiveMessage);
    socket.on("isTyping", handleTyping);
    socket.on("isNotTyping", handleNotTyping);

    return () => {
      socket.emit("leave-room", "room", name);
      socket.disconnect();
      socket.off("joined", handleJoined);
      socket.off("disconnected", handleDisconnected);
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [name, role]);

  const submitChatMessage = () => {
    Keyboard.dismiss();

    if (chatMessage.trim() === "") {
      return;
    }

    const newMessage = {
      _id: Math.random().toString(36).substring(7),
      text: chatMessage,
      createdAt: new Date(),
      user: {
        _id: 1,
        userId,
        name,
        role,
      },
      sent: true,
    };

    socket.emit("message", newMessage, "room");

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [newMessage])
    );
    setChatMessage("");
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: mode === "light" ? "#FFFAFA" : "#121212" },
      ]}
    >
      <GiftedChat
        messages={messages}
        onInputTextChanged={(text) => {
          if (text.length > 0) socket.emit("isTyping", name, "room");
          else socket.emit("isNotTyping", name, "room");
          setChatMessage(text);
        }}
        onSend={() => submitChatMessage()}
        user={{ _id: 1 }}
        text={chatMessage}
        keyboardShouldPersistTaps="never"
        scrollToBottom
        renderUsernameOnMessage={role === "admin" ? true : false}
        isTyping={typing}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: "white",
  },
  background: {
    flex: 1,
  },
});

export default Chatscreen;
