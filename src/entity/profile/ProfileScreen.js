import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { TextInput, Button, Text, Avatar, useTheme } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { auth } from "../../firebase/config";
import authService from "../auth/authService";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const { colors } = useTheme();
  const [name, setName] = useState(auth.currentUser?.displayName || "");
  const [email, setEmail] = useState(auth.currentUser?.email || "");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserStatus = async () => {
      const userId = auth.currentUser?.uid;
      const profile = await authService.getUserProfile(userId);
      setStatus(profile.status);
    };

    fetchUserStatus();
  }, []);

  const sendPasswordResetEmail = async () => {
    try {
      await authService.sendPasswordResetEmail(auth.currentUser.email);
      Alert.alert("Password Reset", "Password reset email sent successfully.");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // Function to confirm password reset
  const confirmResetPassword = () => {
    Alert.alert(
      "Reset Password",
      "Are you sure you want to reset your password?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: sendPasswordResetEmail },
      ]
    );
  };

  const handleUpdate = async () => {
    setLoading(true);
    const userId = auth.currentUser?.uid;

    try {
      let emailUpdated = false;

      if (name !== auth.currentUser?.displayName || status) {
        await authService.updateProfile(userId, {
          name,
          email: auth.currentUser?.email,
          status,
        });
      }

      if (email !== auth.currentUser?.email) {
        await authService.updateEmail(email);
        emailUpdated = true;
      }

      if (emailUpdated) {
        Alert.alert(
          "Verify Email",
          "Please check your new email address to verify it. You may need to log in again once verified."
        );
      } else {
        Alert.alert("Success", "Profile updated successfully.");
      }
    } catch (error) {
      Alert.alert("Error updating profile", error.message);
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await authService.signOutUser();
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Avatar.Text
        size={100}
        label={name.charAt(0).toUpperCase()}
        style={{
          backgroundColor: colors.primary,
          alignSelf: "center",
          marginVertical: 20,
        }}
      />
      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        keyboardType="email-address"
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
        icon="email"
        mode="contained"
        onPress={confirmResetPassword}
        style={styles.button}
        disabled={loading}
      >
        Password Reset
      </Button>
      <Button
        icon="update"
        mode="contained"
        onPress={handleUpdate}
        style={styles.button}
        disabled={loading}
      >
        Update Profile
      </Button>
      <Button
        icon="logout"
        mode="contained"
        onPress={handleSignOut}
        style={[styles.button, styles.signOutButton]}
      >
        Sign Out
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 5,
    marginBottom: 10,
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  picker: {
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: "#D32F2F",
  },
});

export default ProfileScreen;
