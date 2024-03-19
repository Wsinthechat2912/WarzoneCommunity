import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

const FriendsList = ({ friends, onSelectFriend }) => {
  return (
    <FlatList
      data={friends}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onSelectFriend(item.id)}>
          <Text>{item.email}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default FriendsList;
