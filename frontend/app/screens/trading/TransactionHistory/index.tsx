import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

// Sample transaction data
const sampleTransactions = [
  {
    id: '1',
    date: '2025-02-20',
    quantity: 5,
    purchasePrice: 10.00,
    amount: -50.75,
    purchaseType: 'buy',
    tickerSymbol: 'AAPL',
  },
  {
    id: '2',
    date: '2025-02-21',
    quantity: 3,
    purchasePrice: 500.00,
    amount: 1500.00,
    purchaseType: 'sell',
    tickerSymbol: 'GOOG',
  },
  {
    id: '3',
    date: '2025-02-22',
    quantity: 2,
    purchasePrice: 60.00,
    amount: -120.00,
    purchaseType: 'buy',
    tickerSymbol: 'TSLA',
  },
  // Add more transactions as needed
];

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Set the sample transactions as the state
    setTransactions(sampleTransactions);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionDetails}>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.tickerSymbol}>{item.tickerSymbol}</Text>
      </View>
      <View style={styles.transactionAmount}>
        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
        <Text style={styles.purchasePrice}>Purchase Price: ${item.purchasePrice.toFixed(2)}</Text>
        <Text
          style={[
            styles.amount,
            item.amount < 0 ? styles.negative : styles.positive,
          ]}
        >
          {item.amount < 0
            ? `- $${Math.abs(item.amount).toFixed(2)}`
            : `$${item.amount.toFixed(2)}`}
        </Text>
        <Text style={styles.purchaseType}>{item.purchaseType}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>
      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.noTransactions}>No transactions available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  transactionItem: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  transactionDetails: {
    flex: 3,
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  tickerSymbol: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  transactionAmount: {
    flex: 1,
    alignItems: "flex-end",
  },
  quantity: {
    fontSize: 14,
    color: "#666",
  },
  purchasePrice: {
    fontSize: 14,
    color: "#666",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  positive: {
    color: "green",
  },
  negative: {
    color: "red",
  },
  purchaseType: {
    fontSize: 12,
    color: "#999",
  },
  noTransactions: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});

export default TransactionHistory;
