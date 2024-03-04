import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "../entity/profile/ProfileScreen";
import ChatScreen from "../entity/message/ChatScreen";
import NotifyScreen from "../entity/notification/NotifyScreen";
import CommunityScreen from "../entity/community/CommunityScreen";
import { Ionicons } from "@expo/vector-icons";

const Tabs = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"; // Removed "ios-" prefix
          } else if (route.name === "Notifications") {
            iconName = focused ? "notifications" : "notifications-outline"; // Removed "ios-" prefix
          } else if (route.name === "Communities") {
            iconName = focused ? "people" : "people-outline"; // Removed "ios-" prefix
          } else if (route.name === "Chats") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline"; // Removed "ios-" prefix
          }

          // Return the Ionicon component with the correct icon name
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tabs.Screen name="Communities" component={CommunityScreen} />
      <Tabs.Screen name="Chats" component={ChatScreen} />
      <Tabs.Screen name="Notifications" component={NotifyScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
};

export default TabNavigator;
