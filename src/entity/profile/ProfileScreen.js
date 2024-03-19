import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { auth, database } from "../../firebase/config";
import { ref, set, onValue } from "firebase/database";
import authService from "../auth/authService";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setEmail(user.email || "");
      setName(user.displayName || "");
      const statusRef = ref(database, `users/${user.uid}/status`);
      onValue(statusRef, (snapshot) => {
        setStatus(snapshot.val() || "offline");
      });
    }
  }, []);

  const updateUserEmail = async () => {
    setLoading(true);
    try {
      await authService.updateEmail(email.trim());
      Alert.alert(
        "Verify New Email",
        "A verification link has been sent to your new email address. Please verify to complete the email update."
      );
    } catch (error) {
      Alert.alert("Update Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserName = async () => {
    setLoading(true);
    try {
      await authService.updateProfile(name);
      Alert.alert("Success", "Name updated successfully!");
    } catch (error) {
      Alert.alert("Update Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async () => {
    setLoading(true);
    try {
      const statusRef = ref(database, `users/${user.uid}/status`);
      await set(statusRef, status);
      Alert.alert("Success", "Status updated successfully!");
    } catch (error) {
      Alert.alert("Update Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      navigation.navigate("Home"); // Navigate to HomePage after sign out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Name"
      />
      <Button title="Update Name" onPress={updateUserName} disabled={loading} />

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
      />
      <Button
        title="Update Email"
        onPress={updateUserEmail}
        disabled={loading}
      />

      <Text style={styles.label}>Status</Text>
      <Picker
        selectedValue={status}
        onValueChange={(itemValue) => setStatus(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Online" value="online" />
        <Picker.Item label="Offline" value="offline" />
        <Picker.Item label="Busy" value="busy" />
        <Picker.Item label="Do Not Disturb" value="do_not_disturb" />
      </Picker>
      <Button
        title="Update Status"
        onPress={updateUserStatus}
        disabled={loading}
      />

      {loading && <Text>Updating...</Text>}

      <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
  },
  picker: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
  },
  signOutButton: {
    backgroundColor: "#D32F2F",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 20,
    minWidth: 150,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  signOutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  profileDetailsContainer: {
    width: "80%",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginBottom: 20,
  },
  profileDetailText: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default ProfileScreen;
