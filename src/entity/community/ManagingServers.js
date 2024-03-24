import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
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
      navigation.goBack(); // Navigate back to the previous screen
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
        // It's an ID
        serverId = serverIdentifier;
        await ServerService.joinServerById(serverId);
      } else {
        // It's a name
        serverId = await ServerService.joinServerByName(serverIdentifier);
      }

      Alert.alert("Success", "Joined server successfully");
      setServerIdentifier("");
      navigation.goBack(); // Navigate back to the previous screen
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create or Join a Server</Text>
      <TextInput
        placeholder="Enter Server Name"
        value={serverName}
        onChangeText={setServerName}
        style={styles.input}
      />
      <Button title="Create Server" onPress={handleCreateServer} />
      <TextInput
        placeholder="Enter Server ID or Name to Join"
        value={serverIdentifier}
        onChangeText={setServerIdentifier}
        style={styles.input}
      />
      <Button title="Join Server" onPress={handleJoinServer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 5,
    padding: 10,
  },
});

export default ManagingServers;
