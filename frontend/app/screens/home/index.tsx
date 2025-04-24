import React from "react";
import { View, Text } from "react-native";
import { useUser } from "../Auth/UserContext"; // Adjust the import path as necessary

export default function HomeScreen() {
  const { userId } = useUser(); // Access userId from UserContext

  console.log("@Home User ID:", userId); // Log the userId to the console

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Home</Text>
      {userId ? (
        <Text>Welcome! Your User ID is: {userId}</Text>
      ) : (
        <Text>Loading user information...</Text>
      )}
    </View>
  );
}