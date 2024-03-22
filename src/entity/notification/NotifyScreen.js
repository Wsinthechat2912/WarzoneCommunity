import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import authService from "../auth/authService";
import { Button } from "react-native-paper";

const NotifyScreen = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const fetchedRequests = await authService.fetchFriendRequests();
        const requestsWithSenderDetails = await Promise.all(
          fetchedRequests.map(async (req) => {
            const senderDetails = await authService.getUserProfile(
              req.senderId
            );
            return {
              ...req,
              senderName: senderDetails.name,
            };
          })
        );
        setRequests(requestsWithSenderDetails);
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
              {item.senderName}wants to be your friend.
            </Text>
            <View style={styles.buttonsContainer}>
              <Button
                mode="contained"
                onPress={() => handleAccept(item.id)}
                style={styles.acceptButton}
              >
                Accept
              </Button>
              <Button
                mode="outlined"
                onPress={() => handleReject(item.id)}
                color="#D32F2F"
                style={styles.rejectButton}
              >
                Reject
              </Button>
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
    padding: 20,
    backgroundColor: "#F7F7F7", // Light grey background
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  requestItem: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  requestText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    marginLeft: 20,
  },
  acceptButton: {
    marginRight: 10,
  },
  rejectButton: {
    marginLeft: 10,
  },
});

export default NotifyScreen;
