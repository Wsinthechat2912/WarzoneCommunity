import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Time from "./Time";

const MessageItem = ({ isSender, message }) => {
  return (
    <View
      style={[
        styles.messageContainer,
        isSender ? styles.sender : styles.receiver,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          isSender ? styles.senderText : styles.receiverText,
        ]}
      >
        {message.text}
      </Text>
      <Time isSender={isSender} timestamp={message.timestamp} />
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: "80%",
    padding: 10,
    marginVertical: 5,
    borderRadius: 20,
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
    marginHorizontal: 10,
  },
  sender: {
    alignSelf: "flex-end",
    backgroundColor: "#007bff",
  },
  receiver: {
    backgroundColor: "#e5e5ea",
  },
  messageText: {
    color: "#000",
  },
  senderText: {
    color: "#fff",
  },
});

export default MessageItem;
