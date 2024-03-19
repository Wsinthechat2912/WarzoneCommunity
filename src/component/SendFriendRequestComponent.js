import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import authService from "../entity/auth/authService";

const SendFriendRequestComponent = () => {
  const [email, setEmail] = useState("");

  const handleSendFriendRequest = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter an email address");
      return;
    }

    try {
      const user = await authService.searchUserByEmail(email);
      if (user) {
        console.log("User found:", user);
        Alert.alert(
          "Success",
          "User found! Implement request sending logic here."
        );
      } else {
        Alert.alert("Failed", "No user found with that email");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while searching for the user");
    }
  };

  return (
    <View>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter user's email"
      />
      <Button title="Send Friend Request" onPress={handleSendFriendRequest} />
    </View>
  );
};

export default SendFriendRequestComponent;
