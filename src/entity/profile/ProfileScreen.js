import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { auth, database } from "../../firebase/config";
import { updateEmail, updateProfile } from "firebase/auth";
import { ref, set, onValue } from "firebase/database";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch the current user's data
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setEmail(user.email);
      setName(user.displayName);
      // Here you would also fetch the user's status from your database
      // Assume we have a path like 'users/{uid}/status'
      const statusRef = ref(database, "users/" + user.uid + "/status");
      onValue(statusRef, (snapshot) => {
        setStatus(snapshot.val() || "offline");
      });
    }
  }, []);

  const handleUpdateProfile = async () => {
    setLoading(true);
    const user = auth.currentUser;
    try {
      // Update the user's profile
      if (user) {
        await updateEmail(user, email);
        await updateProfile(user, { displayName: name });
        // Update the user's status
        const statusRef = ref(database, "users/" + user.uid + "/status");
        await set(statusRef, status);
      }
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile: " + error.message);
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
      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
      />
      <Text style={styles.label}>Status</Text>
      <Picker
        selectedValue={status}
        onValueChange={(itemValue, itemIndex) => setStatus(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Online" value="online" />
        <Picker.Item label="Offline" value="offline" />
        <Picker.Item label="Busy" value="busy" />
        <Picker.Item label="Do Not Disturb" value="do_not_disturb" />
      </Picker>
      {loading ? (
        // Show loading indicator while updating profile
        <Text>Updating...</Text>
      ) : (
        <Button title="Update Profile" onPress={handleUpdateProfile} />
      )}
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
