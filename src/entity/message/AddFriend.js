import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import authService from "../auth/authService";

const AddFriend = () => {
  const [email, setEmail] = useState("");

  const handleAddFriend = async () => {
    if (!email.trim()) {
      Alert.alert("Input Error", "Please enter an email address.");
      return;
    }

    const result = await authService.sendFriendRequest(email.trim());
    if (result.success) {
      Alert.alert("Success", "Friend request sent successfully.");
      setEmail("");
    } else {
      Alert.alert("Failed", result.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter User's email"
        style={styles.input}
        keyboardType="email-address"
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
