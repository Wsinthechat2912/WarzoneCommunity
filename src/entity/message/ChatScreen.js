import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
} from "react-native";

const mockMessages = [
  { id: "1", text: "Hello there!", author: "UserA" },
  { id: "2", text: "Hi! How are you?", author: "UserB" },
];

const ChatScreen = () => {
  const [messageText, setMessageText] = useState("");

  const sendMessage = () => {
    console.log(messageText);
    setMessageText("");
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={mockMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.message}>{`${item.author}: ${item.text}`}</Text>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  message: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f3f3f3",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#cccccc",
    padding: 10,
  },
});

export default ChatScreen;
