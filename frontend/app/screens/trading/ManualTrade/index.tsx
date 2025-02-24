import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";

const ManualTrade = () => {
  // State hooks to manage form input values
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [action, setAction] = useState("Buy"); // Default action is 'Buy'

  // Function to handle trade execution
  const handleTrade = () => {
    if (!symbol || !quantity || !price) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    // Normally, you'd call an API to execute the trade here
    Alert.alert("Trade Executed", `You have ${action} ${quantity} shares of ${symbol} at $${price} per share.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manual Trade</Text>
      <Text style={styles.content}>Here you can manually execute trade transactions.</Text>

      {/* Symbol input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Stock Symbol (e.g., AAPL)"
        value={symbol}
        onChangeText={setSymbol}
      />

      {/* Quantity input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Quantity"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />

      {/* Price input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      {/* Action selection (Buy/Sell) */}
      <View style={styles.actionContainer}>
        <Button title="Buy" onPress={() => setAction("Buy")} color={action === "Buy" ? "#007bff" : "#ccc"} />
        <Button title="Sell" onPress={() => setAction("Sell")} color={action === "Sell" ? "#dc3545" : "#ccc"} />
      </View>

      {/* Execute Trade Button */}
      <Button title="Execute Trade" onPress={handleTrade} color="#28a745" />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    color: "#333",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
});

export default ManualTrade;
