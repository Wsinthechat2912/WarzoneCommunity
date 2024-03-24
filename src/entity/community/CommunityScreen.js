import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const CommunityScreen = () => {
  const navigation = useNavigation();

  const navigateToNewGamer = () => {
    navigation.navigate("NewGamerScreen");
  };

  const navigateToExperiencedGamer = () => {
    navigation.navigate("ExperiencedGamerScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Community Screen</Text>
      <TouchableOpacity style={styles.button} onPress={navigateToNewGamer}>
        <Text style={styles.buttonText}>New Gamer</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={navigateToExperiencedGamer}
      >
        <Text style={styles.buttonText}>Experienced Gamer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CommunityScreen;
