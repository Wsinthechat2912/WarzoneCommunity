import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import authService from "../auth/authService";
import { Ionicons } from "@expo/vector-icons";

const ChatScreen = () => {
  const navigation = useNavigation();
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      const fetchedFriends = await authService.fetchFriends();
      setFriends(fetchedFriends);
    };

    fetchFriends();
  }, []);

  const navigateToChat = (friend) => {
    navigation.navigate("MessagingScreen", {
      friendId: friend.id,
      friendName: friend.name,
      friendAvatarUrl: friend.avatarUrl,
      friendStatus: friend.status,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.friendItem}
            onPress={() => navigateToChat(item)}
          >
            <Text style={styles.friendName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <TouchableOpacity
            style={styles.addFriendButton}
            onPress={() => navigation.navigate("AddFriend")}
          >
            <Ionicons name="person-add" size={24} color="white" />
            <Text style={styles.addFriendButtonText}>Add Friend</Text>
          </TouchableOpacity>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  friendItem: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  friendName: {
    fontSize: 18,
    color: "#333333",
    marginLeft: 10,
  },
  addFriendButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
  },
  addFriendButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 5,
  },
});

export default ChatScreen;
