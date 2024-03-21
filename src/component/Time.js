import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Ensure you have expo icons installed

const Time = ({ isSender, seen, timestamp }) => {
  const timeString = new Date(timestamp).toLocaleTimeString([], {
    timeStyle: "short",
  }); // Formats time more concisely

  return (
    <View style={[styles.timeContainer, isSender && styles.senderContainer]}>
      <Text
        style={[
          styles.timeText,
          isSender ? styles.senderTime : styles.receiverTime,
        ]}
      >
        {timeString}
      </Text>
      {isSender && (
        <Ionicons
          name={seen ? "checkmark-done" : "checkmark"}
          size={12}
          color={seen ? "lightgreen" : "white"}
          style={styles.statusIcon}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  senderContainer: {
    justifyContent: "flex-end",
  },
  timeText: {
    fontSize: 12,
    color: "#ccc",
  },
  senderTime: {
    color: "#ddd",
    marginRight: 4,
  },
  receiverTime: {
    color: "#666",
  },
  statusIcon: {
    marginLeft: 5,
  },
});

export default Time;
