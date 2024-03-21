import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ChatHeader = ({ userName, status }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userStatus}>{status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  userInfoContainer: {
    alignItems: "center",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  userStatus: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
});

export default ChatHeader;
