import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AutoTrade = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Auto Trade</Text>
      <Text style={styles.content}>Here you can set up automatic trading strategies.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    color: "#333",
  },
});

export default AutoTrade;
