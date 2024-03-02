import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../entity/auth/LoginScreen";
import ChatScreen from "../entity/message/ChatScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Log In" }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ title: "Chat" }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
