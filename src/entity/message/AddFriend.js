import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet, Text } from "react-native";
import authService from "../auth/authService";

const AddFriend = () => {
  const [identifier, setIdentifier] = useState("");

  const handleAddFriend = async () => {
    if (!identifier.trim()) {
      Alert.alert("Input Error", "Please enter a valid identifier.");
      return;
    }

    const result = await authService.sendFriendRequest(identifier.trim());
    if (result.success) {
      Alert.alert("Success", "Friend request sent successfully.");
      setIdentifier("");
    } else {
      Alert.alert("Failed", result.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={identifier}
        onChangeText={setIdentifier}
        placeholder="Enter user's name, email or ID"
        style={styles.input}
        keyboardType="default"
      />
      <Button title="Send Friend Request" onPress={handleAddFriend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 5,
  },
});

export default AddFriend;
