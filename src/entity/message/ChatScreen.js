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
import { Avatar } from "react-native-paper";

const ChatScreen = () => {
  const navigation = useNavigation();
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const fetchedFriends = await authService.fetchFriends();
        setFriends(fetchedFriends);
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      }
    };

    fetchFriends();
  }, []);

  const navigateToChat = (friend) => {
    navigation.navigate("MessagingScreen", {
      userId: friend.id,
      userName: friend.name,
      avatar: friend.avatar,
    });
  };

  const renderHeader = () => {
    return (
      <View>
        <TouchableOpacity
          style={styles.addFriendButton}
          onPress={() => navigation.navigate("AddFriend")}
        >
          <Ionicons name="person-add" size={24} color="white" />
          <Text style={styles.addFriendButtonText}>Add Friend</Text>
        </TouchableOpacity>
        <Text style={styles.friendsLabel}>Your Friends:</Text>
      </View>
    );
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
            <Avatar.Text
              size={40}
              label={item.name.charAt(0)}
              style={styles.avatar}
            />
            <Text style={styles.friendName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListHeaderComponent={renderHeader}
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
    marginLeft: 10,
  },
  avatar: {
    marginRight: 10,
  },
  friendsLabel: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 20,
    marginBottom: 10,
  },
});

export default ChatScreen;
