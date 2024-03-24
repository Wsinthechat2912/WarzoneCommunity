import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Text,
} from "react-native";
import ServerService from "./ServerService";

const ServerChatScreen = ({ route }) => {
  const { serverId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState({});

  const fetchAndSetUserDetails = async (userId) => {
    if (!users[userId]) {
      const userDetails = await ServerService.fetchUserDetails(userId);
      setUsers((prevUsers) => ({ ...prevUsers, [userId]: userDetails }));
    }
  };

  useEffect(() => {
    const unsubscribe = ServerService.fetchMessages(
      serverId,
      (fetchedMessages) => {
        const groupedMessages = groupMessagesByUser(fetchedMessages);
        setMessages(groupedMessages);
        groupedMessages.forEach((message) => {
          if (message.isFirstMessageByUser) {
            fetchAndSetUserDetails(message.userId);
          }
        });
      }
    );
    return () => unsubscribe && unsubscribe();
  }, [serverId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      await ServerService.sendMessage(serverId, { text: newMessage });
      setNewMessage("");
    }
  };

  // Function to group messages by user
  const groupMessagesByUser = (messages) => {
    const grouped = [];
    let lastUserId = null;

    messages.forEach((message) => {
      if (message.userId !== lastUserId) {
        grouped.push({ ...message, isFirstMessageByUser: true });
        lastUserId = message.userId;
      } else {
        grouped.push({ ...message, isFirstMessageByUser: false });
      }
    });

    return grouped;
  };

  // Function to dynamically assign a color to a user
  const getUserColor = (userId) => {
    const colors = [
      "#64B5F6", // Blue
      "#81C784", // Green
      "#FFB74D", // Orange
      "#E57373", // Red
      "#BA68C8", // Purple
      "#4DB6AC", // Teal
      "#FFD54F", // Yellow
      "#90A4AE", // Blue Grey
      "#A1887F", // Brown
      "#F06292", // Pink
    ];
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            {item.isFirstMessageByUser && (
              <Text
                style={[styles.userName, { color: getUserColor(item.userId) }]}
              >
                {users[item.userId]?.name || item.userId}{" "}
              </Text>
            )}
            <Text style={styles.message}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          style={styles.input}
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5E5E5",
    padding: 10,
  },
  messageContainer: {
    marginBottom: 5,
  },
  userName: {
    fontWeight: "bold",
  },
  message: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginVertical: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#FFF",
  },
});

export default ServerChatScreen;
