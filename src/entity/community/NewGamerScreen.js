import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import ServerService from "./ServerService";
import { useNavigation } from "@react-navigation/native";

const NewGamerScreen = () => {
  const [servers, setServers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    let isActive = true;

    const fetchServers = async () => {
      const unsubscribe = ServerService.fetchUserServers((userServers) => {
        if (isActive) {
          setServers(userServers);
        }
      });
      // Cleanup function
      return unsubscribe;
    };
    fetchServers();
    return () => {
      isActive = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Servers</Text>
      <FlatList
        data={servers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button
            title={item.name}
            onPress={() =>
              navigation.navigate("ServerChatScreen", { serverId: item.id })
            }
          />
        )}
      />
      <Button
        title="Create/Join Server"
        onPress={() => navigation.navigate("ManagingServers")}
        style={styles.manageButton}
      />
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
  manageButton: {
    marginTop: 20,
  },
});

export default NewGamerScreen;
