import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Time = ({ isSender, seen, timestamp }) => {
  return (
    <View style={styles.timeContainer}>
      <Text
        style={[
          styles.timeText,
          isSender ? styles.senderTime : styles.receiverTime,
        ]}
      >
        {new Date(timestamp).toLocaleTimeString()}
      </Text>
      {isSender && (
        <Text style={styles.deliveryStatus}>{seen ? "Seen" : "Delivered"}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  timeContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  timeText: {
    fontSize: 10,
  },
  senderTime: {
    color: "white",
  },
  receiverTime: {
    color: "black",
  },
  deliveryStatus: {
    fontSize: 10,
    marginLeft: 5,
  },
});

export default Time;
