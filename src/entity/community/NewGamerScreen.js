import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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

  const ServerItem = ({ server }) => (
    <TouchableOpacity
      style={styles.serverItem}
      onPress={() =>
        navigation.navigate("ServerChatScreen", { serverId: server.id })
      }
      activeOpacity={0.7}
    >
      <Ionicons name="chatbox-ellipses-outline" size={24} color="#4F8EF7" />
      <Text style={styles.serverText}>{server.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="game-controller" size={30} color="#333" />
        <Text style={styles.title}>Gamer's Hub</Text>
      </View>
      <FlatList
        data={servers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ServerItem server={item} />}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.manageButton}
          onPress={() => navigation.navigate("ManagingServers")}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.manageButtonText}>Create/Join Server</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECEFF1",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#37474F",
    marginLeft: 10,
  },
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
  },
  serverItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  serverText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#333",
    marginLeft: 10,
  },
  footer: {
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  manageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  manageButtonText: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "600",
    marginLeft: 10,
  },
});

export default NewGamerScreen;
