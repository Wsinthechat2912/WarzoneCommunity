import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../entity/auth/LoginScreen";
import HomePage from "../entity/auth/HomePage";
import SignupScreen from "../entity/auth/SignupScreen";
import TabNavigator from "./TabNavigator";
import ProfileScreen from "../entity/profile/ProfileScreen";
import AddFriend from "../entity/message/AddFriend";
import MessagingScreen from "../entity/message/MessagingScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomePage}
        options={{ title: "Welcome To Warzone Community" }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Log In" }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignupScreen}
        options={{ title: "Sign Up" }}
      />
      <Stack.Screen
        name="HomeTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
      <Stack.Screen
        name="AddFriend"
        component={AddFriend}
        options={{ title: "Add Friend" }}
      />
      <Stack.Screen
        name="MessagingScreen"
        component={MessagingScreen}
        options={({ route }) => ({
          title: route.params.friendName || "Messaging",
        })}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
