import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
} from "react-native";
import { auth } from "../../firebase/config";
import {
  sendMessage,
  listenForMessages,
  getConversationId,
} from "./MessageService";

const MessagingScreen = ({ route }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { userId: recipientId, userName } = route.params;
  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    if (!currentUserId || !recipientId) return;
    const conversationId = getConversationId(currentUserId, recipientId);
    const unsubscribe = listenForMessages(conversationId, setMessages);
    return () => unsubscribe();
  }, [recipientId, currentUserId]);

  const handleSendMessage = async () => {
    if (!message.trim() || !currentUserId || !recipientId) return;
    const conversationId = getConversationId(currentUserId, recipientId);
    await sendMessage(conversationId, message.trim(), recipientId);
    setMessage("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.userName}>{userName}</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text
            style={[
              styles.message,
              item.senderId === currentUserId ? styles.sent : styles.received,
            ]}
          >
            {item.text}
          </Text>
        )}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  message: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  sent: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C5",
  },
  received: {
    alignSelf: "flex-start",
    backgroundColor: "#ECECEC",
  },
});

export default MessagingScreen;
