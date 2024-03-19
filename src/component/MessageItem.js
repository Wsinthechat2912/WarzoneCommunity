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
      <Time
        isSender={isSender}
        seen={message.seen}
        timestamp={message.timestamp}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: "80%",
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  sender: {
    alignSelf: "flex-end",
    backgroundColor: "#4CAF50",
  },
  receiver: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
  },
  messageText: {
    fontSize: 16,
  },
  senderText: {
    color: "white",
  },
  receiverText: {
    color: "black",
  },
});

export default MessageItem;
