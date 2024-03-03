import React, { useState } from "react";
import { Button, TextInput, View, Text, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import authService from "./authService";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setIsLoading(true);
    setError(""); // Clear out any previous errors

    if (!email || !password) {
      setError("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    try {
      const isValidUser = await authService.login(
        email.trim(),
        password.trim()
      );
      if (isValidUser) {
        navigation.navigate("Chat");
      } else {
        setError("Invalid credentials");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ marginBottom: 20, borderWidth: 1, padding: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
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
