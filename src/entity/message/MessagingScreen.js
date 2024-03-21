import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Ensure you have expo icons installed
import { auth } from "../../firebase/config";
import {
  sendMessage,
  listenForMessages,
  getConversationId,
} from "./MessageService";
import MessageItem from "../../component/MessageItem";
import ChatHeader from "../../component/ChatHeader";

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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ChatHeader userName={userName} status="Online" />
      <View style={styles.container}>
        <FlatList
          style={{ flex: 1 }}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageItem
              isSender={item.senderId === currentUserId}
              message={item}
            />
          )}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            style={styles.sendButton}
          >
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginRight: 10,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
  },
  sendButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 50,
  },
});

export default MessagingScreen;
