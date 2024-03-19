import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, Alert, StyleSheet } from "react-native";
import authService from "../auth/authService";

const NotifyScreen = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const fetchedRequests = await authService.fetchFriendRequests();
        setRequests(fetchedRequests);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
        Alert.alert("Error", "Could not fetch friend requests.");
      }
    };

    fetchFriendRequests();
  }, []);

  const handleAccept = async (requesterId) => {
    try {
      const result = await authService.respondToFriendRequest(
        requesterId,
        true
      );
      if (result.success) {
        Alert.alert("Success", "Friend request accepted.");
        setRequests(requests.filter((req) => req.id !== requesterId));
      } else {
        Alert.alert("Error", result.message || "Could not accept the request.");
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      Alert.alert(
        "Error",
        "An error occurred while accepting the friend request."
      );
    }
  };

  const handleReject = async (requesterId) => {
    try {
      const result = await authService.respondToFriendRequest(
        requesterId,
        false
      );
      if (result.success) {
        Alert.alert("Success", "Friend request rejected.");
        setRequests(requests.filter((req) => req.id !== requesterId));
      } else {
        Alert.alert("Error", result.message || "Could not reject the request.");
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      Alert.alert(
        "Error",
        "An error occurred while rejecting the friend request."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friend Requests</Text>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text style={styles.requestText}>
              {item.email} wants to be your friend.
            </Text>
            <View style={styles.buttonsContainer}>
              <Button title="Accept" onPress={() => handleAccept(item.id)} />
              <Button
                title="Reject"
                onPress={() => handleReject(item.id)}
                color="#D32F2F"
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  requestItem: {
    backgroundColor: "#FFF",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  requestText: {
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 150,
  },
});

export default NotifyScreen;
