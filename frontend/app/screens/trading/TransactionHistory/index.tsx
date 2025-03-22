import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const hardcodedUserId = "27431f9a-3b99-426f-909e-5301102b115d";

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`http://localhost:8086/api/transactions/user/${hardcodedUserId}`);
        console.info("Response Status:", response.status); // Log HTTP status
        const data = await response.json();
        console.info("Raw Data:", data); // Log raw response data

        const formattedTransactions = data.map((transaction: any) => {
          console.info("Mapping Transaction:", transaction); // Log each transaction being mapped
          return {
            id: transaction.transactionId,
            date: new Date(transaction.timestamp).toLocaleDateString(),
            tickerSymbol: transaction.investment?.symbol || "N/A",
            quantity: transaction.quantity,
            purchasePrice: transaction.price,
            amount: transaction.totalAmount * (transaction.type === "sell" ? -1 : 1),
            purchaseType: transaction.type,
          };
        });

        console.info("Formatted Transactions:", formattedTransactions); // Log formatted data
        setTransactions(formattedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error); // Log errors
      }
    };

    fetchTransactions();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
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

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5d0fe",
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