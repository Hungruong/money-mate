import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

const ManualTrade = ({ navigation }) => {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [action, setAction] = useState("Buy");
  const [userId] = useState("a2b0d0ab-951d-437f-81f7-c228e1d727f2"); // Mock UUID, replace with auth

  const handleQuantityChange = (value) => {
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
        <TouchableOpacity
          style={[
            styles.button,
            styles.buyButton,
            action === "Buy" && styles.activeButton,
          ]}
          onPress={() => setAction("Buy")}
        >
          <Text style={styles.buttonText}>Buy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            styles.sellButton,
            action === "Sell" && styles.activeButton,
          ]}
          onPress={() => setAction("Sell")}
        >
          <Text style={styles.buttonText}>Sell</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.button, styles.submitButton]}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Next: Confirm Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5d0fe",
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
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100, // Ensures consistent width
  },
  buyButton: {
    backgroundColor: "#007bff", // Blue for Buy
    opacity: 0.5, // Dim when inactive
  },
  sellButton: {
    backgroundColor: "#dc3545", // Red for Sell
    opacity: 0.5, // Dim when inactive
  },
  submitButton: {
    backgroundColor: "#28a745", // Green for Submit
    width: "100%", // Full width for submit button
  },
  activeButton: {
    opacity: 1, // Fully opaque when active
    borderWidth: 2, // Add border to highlight active state
    borderColor: "#000",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ManualTrade;