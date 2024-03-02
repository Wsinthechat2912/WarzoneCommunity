import React, { useState } from "react";
import { Button, TextInput, View, Text, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import authService from "./authService";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setIsLoading(true);
    const isValidUser = await authService.login(username);
    setIsLoading(false);

    if (isValidUser) {
      navigation.navigate("Chat");
    } else {
      setError("Invalid username");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ marginBottom: 20, borderWidth: 1, padding: 10 }}
      />
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Log In" onPress={handleLogin} />
      )}
    </View>
  );
};

export default LoginScreen;
