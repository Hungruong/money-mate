import React, { FC } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import axios from "axios";

const BASE_URL = "http://localhost:8086"; // Replace with your machine’s IP

import { NavigationProp, RouteProp } from "@react-navigation/native";

type ConfirmOrderProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
};

const ExecuteTrade: FC<ConfirmOrderProps> = ({ navigation, route })=> {
  const { symbol, quantity, price, action, userId } = route.params || {};
  const totalPrice = Number(quantity) * Number(price);

  const handleComplete = async () => {
    try {
      const endpoint = action === "Buy" ? "/buy" : "/sell";
      console.log(`Executing trade: ${BASE_URL}/api/investments${endpoint}`);
      console.log("Request body:", { userId, symbol, quantity: Number(quantity) });
      const response = await axios.post(`${BASE_URL}/api/investments${endpoint}`, {
        userId,
        symbol,
        quantity: Number(quantity),
      });
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);
      // Handle response.data as a string or object
      const message = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
      alert(message);
      navigation.navigate("ManualTrade");
    } catch (error: any) {
      console.error("Error executing trade:", error.message);
      if (error.response) {
        console.error("Response error status:", error.response.status);
        console.error("Response error data:", error.response.data);
        const errorMessage = typeof error.response.data === "string" ? error.response.data : JSON.stringify(error.response.data);
        alert(errorMessage);
      } else {
        alert("Error executing trade: " + error.message);
      }
    }
  };

  if (!symbol || !quantity || !price || !action || !userId) {
    return (
      <View style={styles.container}>
        <Text>Invalid order data. Please go back and try again.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Execute Trade</Text>
      <Text style={styles.content}>Your order is ready to be executed.</Text>

      <View style={styles.summary}>
        <Text><Text style={styles.bold}>Asset Symbol:</Text> {symbol}</Text>
        <Text><Text style={styles.bold}>Amount:</Text> {quantity} shares</Text>
        <Text><Text style={styles.bold}>Price per Share:</Text> ${Number(price).toFixed(2)}</Text>
        <Text><Text style={styles.bold}>Total Price:</Text> ${totalPrice.toFixed(2)}</Text>
        <Text><Text style={styles.bold}>Action:</Text> {action}</Text>
      </View>

      <Button title="Complete Trade" onPress={handleComplete} color="#28a745" />
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
});

export default ExecuteTrade;