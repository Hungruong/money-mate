import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";

// Sample data for portfolio (this would typically come from an API)
const samplePortfolio = [
  { symbol: "AAPL", quantity: 10, price: 150, currentPrice: 155 },
  { symbol: "TSLA", quantity: 5, price: 700, currentPrice: 715 },
  { symbol: "GOOG", quantity: 2, price: 2800, currentPrice: 2850 },
];

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(samplePortfolio);
  
  // Calculate the total portfolio value
  const totalValue = portfolio.reduce(
    (acc, investment) => acc + investment.quantity * investment.currentPrice,
    0
  );

  // Portfolio item component
  const PortfolioItem = ({ symbol, quantity, price, currentPrice }) => {
    const profitLoss = (currentPrice - price) * quantity;

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>Symbol: {symbol}</Text>
        <Text style={styles.itemText}>Quantity: {quantity}</Text>
        <Text style={styles.itemText}>Purchase Price: ${price}</Text>
        <Text style={styles.itemText}>Current Price: ${currentPrice}</Text>
        <Text
          style={[
            styles.itemText,
            { color: profitLoss >= 0 ? "green" : "red" },
          ]}
        >
          {profitLoss >= 0 ? "Profit" : "Loss"}: ${profitLoss.toFixed(2)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Portfolio</Text>
      <Text style={styles.content}>Here you can manage your stock portfolio.</Text>

      {/* Portfolio Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.totalValue}>Total Portfolio Value: ${totalValue.toFixed(2)}</Text>
      </View>

      {/* List of investments */}
      <FlatList
        data={portfolio}
        renderItem={({ item }) => (
          <PortfolioItem
            symbol={item.symbol}
            quantity={item.quantity}
            price={item.price}
            currentPrice={item.currentPrice}
          />
        )}
        keyExtractor={(item) => item.symbol + item.quantity}
      />

      {/* Add more investments button (this could navigate to another page) */}
      <TouchableOpacity style={styles.addButton} onPress={() => alert("Navigate to add investment page")}>
        <Text style={styles.addButtonText}>+ Add Investment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f5d0fe",
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
    marginBottom: 20,
  },
  summaryContainer: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 12,
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  addButton: {
    marginTop: 30,
    padding: 12,
    backgroundColor: "#007bff",
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 18,
    color: "#fff",
  },
});

export default Portfolio;
