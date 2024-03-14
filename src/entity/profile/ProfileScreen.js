import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { auth, database } from "../../firebase/config";
import { ref, set, onValue } from "firebase/database";
import authService from "../auth/authService";

const ProfileScreen = () => {
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
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
});

export default ProfileScreen;
