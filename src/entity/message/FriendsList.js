import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const FriendsList = ({ friends }) => {
  const navigation = useNavigation();
  const handleSelectUser = (selectedUserId, selectedUserName) => {
    navigation.navigate("MessagingScreen", {
      userId: selectedUserId,
      userName: selectedUserName,
    });
  };

  return (
    <FlatList
      data={friends}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleSelectUser(item.id, item.name)}>
          <Text>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default FriendsList;
