import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet,
} from "react-native";
import { ref, onValue, push, set, off } from "firebase/database";
import { database } from "../../firebase/config";

const ChatScreen = () => {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = ref(database, "messages/");
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const parsedMessages = data
        ? Object.keys(data).map((key) => {
            return { id: key, ...data[key] };
          })
        : [];
      setMessages(parsedMessages);
    });

    return () => off(messagesRef);
  }, []);

  const sendMessage = () => {
    const newMessageRef = push(ref(database, "messages/"));
    set(newMessageRef, {
      text: messageText,
      createdAt: Date.now(),
    });
    setMessageText("");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.message}>{item.text}</Text>
        )}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          placeholderTextColor="#666"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#282c34",
  },
  message: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#1A73E8",
    alignSelf: "flex-start",
    borderRadius: 20,
    maxWidth: "80%",
    color: "#fff",
    margin: 8,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#555",
    backgroundColor: "#333",
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#555",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    color: "#000",
  },
  sendButton: {
    backgroundColor: "#1A73E8",
    borderRadius: 20,
    padding: 10,
  },
  sendButtonText: {
    color: "#fff",
  },
});

export default ChatScreen;
