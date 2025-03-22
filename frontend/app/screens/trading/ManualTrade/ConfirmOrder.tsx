import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import axios from "axios";

// Use your machine's IP if testing on emulator/physical device
const BASE_URL = "http://localhost:8086"; // Try "http://192.168.1.x:8086" if localhost fails

import { NavigationProp, RouteProp } from "@react-navigation/native";

type ConfirmOrderProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
};

const ConfirmOrder: React.FC<ConfirmOrderProps> = ({ navigation, route }) => {
  const { symbol, quantity, action, userId } = route.params || {};
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        console.log(`Fetching price from: ${BASE_URL}/api/investments/price/${symbol}`);
        const response = await axios.get(`${BASE_URL}/api/investments/price/${symbol}`);
        console.log("Response status:", response.status);
        console.log("Response data:", response.data);
        setPrice(Number(response.data)); // Ensure it’s a number
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching price:", error.message);
        if (error.response) {
          console.error("Response error data:", error.response.data);
          console.error("Response status:", error.response.status);
        } else if (error.request) {
          console.error("No response received:", error.request);
        }
        setError("Failed to fetch price: " + (error.message || "Unknown error"));
        setLoading(false);
      }
    };
    if (symbol) fetchPrice();
  }, [symbol]);

  const totalPrice = price ? Number(quantity) * price : 0;

  const handleConfirm = () => {
    if (!price) {
      alert("Price not available yet. Please wait or try again.");
      return;
    }
    navigation.navigate("ExecuteTrade", { symbol, quantity, price, action, userId });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  if (!symbol || !quantity || !action || !userId) {
    return (
      <View style={styles.container}>
        <Text>Invalid order data. Please go back and try again.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading price...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
        <Button title="Go Back" onPress={handleCancel} color="#dc3545" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Order</Text>
      <Text style={styles.content}>Please review your order details below.</Text>

      <View style={styles.summary}>
        <Text><Text style={styles.bold}>Asset Symbol:</Text> {symbol}</Text>
        <Text><Text style={styles.bold}>Amount:</Text> {quantity} shares</Text>
        <Text><Text style={styles.bold}>Price per Share:</Text> ${price?.toFixed(2) || "N/A"}</Text>
        <Text><Text style={styles.bold}>Total Price:</Text> ${totalPrice.toFixed(2)}</Text>
        <Text><Text style={styles.bold}>Action:</Text> {action}</Text>
      </View>

      <View style={styles.buttonGroup}>
        <Button title="Confirm Order" onPress={handleConfirm} color="#28a745" />
        <View style={styles.buttonSpacer} />
        <Button title="Cancel" onPress={handleCancel} color="#dc3545" />
      </View>
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
  summary: {
    marginBottom: 32,
    fontSize: 16,
    color: "#333",
  },
  bold: {
    fontWeight: "600",
  },
  buttonGroup: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  buttonSpacer: {
    width: 20,
  },
});

export default ConfirmOrder;