import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

const ManualTrade = ({ navigation }) => {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [action, setAction] = useState("Buy");
  const [userId] = useState("a2b0d0ab-951d-437f-81f7-c228e1d727f2"); // Mock UUID, replace with auth

  const handleQuantityChange = (value: string) => {
    if (value === "" || (Number(value) >= 1 && !isNaN(Number(value)))) {
      setQuantity(value);
    }
  };

  const handleSubmit = () => {
    if (!symbol || !quantity) {
      alert("Error: Please fill in all fields.");
      return;
    }
    navigation.navigate("ConfirmOrder", { symbol, quantity, action, userId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manual Trade</Text>
      <Text style={styles.content}>Enter your trade details below.</Text>

      <TextInput
        style={styles.input}
        placeholder="Stock Symbol (e.g., AAPL)"
        value={symbol}
        onChangeText={setSymbol}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity (min: 1)"
        keyboardType="numeric"
        value={quantity}
        onChangeText={handleQuantityChange}
      />
      <View style={styles.actionContainer}>
        <Button
          title="Buy"
          onPress={() => setAction("Buy")}
          color={action === "Buy" ? "#007bff" : "#ccc"}
        />
        <Button
          title="Sell"
          onPress={() => setAction("Sell")}
          color={action === "Sell" ? "#dc3545" : "#ccc"}
        />
      </View>
      <Button title="Next: Confirm Order" onPress={handleSubmit} color="#28a745" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  content: {
    fontSize: 18,
    color: "#666",
    marginBottom: 32,
  },
  input: {
    width: "100%",
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fafafa",
    marginBottom: 16,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
});

export default ManualTrade;