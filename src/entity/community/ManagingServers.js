import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import ServerService from "./ServerService";
import { useNavigation } from "@react-navigation/native";

const ManagingServers = () => {
  const [serverName, setServerName] = useState("");
  const [serverIdentifier, setServerIdentifier] = useState("");
  const navigation = useNavigation();

  const handleCreateServer = async () => {
    if (!serverName.trim()) {
      Alert.alert("Error", "Please enter a server name.");
      return;
    }
    try {
      const serverId = await ServerService.createServer(serverName);
      Alert.alert("Success", `Server created! ID: ${serverId}`);
      setServerName("");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleJoinServer = async () => {
    if (!serverIdentifier.trim()) {
      Alert.alert("Error", "Please enter a server ID or name to join.");
      return;
    }
    try {
      let serverId;
      if (serverIdentifier.match(/^[-\w]{20}$/)) {
        serverId = serverIdentifier;
        await ServerService.joinServerById(serverId);
      } else {
        serverId = await ServerService.joinServerByName(serverIdentifier);
      }
      Alert.alert("Success", "Joined server successfully");
      setServerIdentifier("");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Create or Join a Server</Text>
        <TextInput
          placeholder="Enter Server Name"
          value={serverName}
          onChangeText={setServerName}
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleCreateServer}>
          <Text style={styles.buttonText}>Create Server</Text>
        </TouchableOpacity>
        <TextInput
          placeholder="Enter Server ID or Name to Join"
          value={serverIdentifier}
          onChangeText={setServerIdentifier}
          style={styles.input}
        />
        <TouchableOpacity
          style={[styles.button, styles.joinButton]}
          onPress={handleJoinServer}
        >
          <Text style={styles.buttonText}>Join Server</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAEAEA",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 25,
  },
  input: {
    width: "100%",
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#007BFF",
    marginBottom: 15,
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  joinButton: {
    backgroundColor: "#28A745",
    shadowColor: "#28A745",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
});

export default ManagingServers;
