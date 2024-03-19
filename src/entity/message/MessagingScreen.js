import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
} from "react-native";
import { auth, database } from "../../firebase/config";
import { ref, push, onValue, set, off } from "firebase/database";

const MessagingScreen = ({ route }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { friendId } = route.params;

  useEffect(() => {
    const messagesRef = ref(database, `messages/${friendId}`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const loadedMessages = Object.keys(data)
        .map((key) => ({
          id: key,
          ...data[key],
        }))
        .sort((a, b) => a.timestamp - b.timestamp);
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [friendId]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const chatPath = `messages/${friendId}`;
    const newMessageRef = push(ref(database, chatPath));
    set(newMessageRef, {
      text: message.trim(),
      senderId: auth.currentUser.uid,
      timestamp: Date.now(),
    });
    setMessage("");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text
            style={[
              styles.message,
              item.senderId === auth.currentUser.uid
                ? styles.sent
                : styles.received,
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
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
