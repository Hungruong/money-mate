import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState<{
    holdings: {
      symbol: string;
      currentQuantity: number;
      totalBoughtQuantity: number;
      totalSoldQuantity: number;
      averagePrice: number;
      status: string;
    }[];
    availableBalance: number;
  }>({
    holdings: [],
    availableBalance: 0,
  });
  const hardcodedUserId = "a2b0d0ab-951d-437f-81f7-c228e1d727f2";

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(`http://localhost:8086/api/investments/${hardcodedUserId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Raw API Response:", data);

        let holdingsData = [];
        if (Array.isArray(data)) {
          holdingsData = data;
        } else if (data && Array.isArray(data.holdings)) {
          holdingsData = data.holdings;
        }

        setPortfolio({
          holdings: holdingsData.map((item: any) => ({
            symbol: item.symbol || "N/A",
            currentQuantity: item.current_quantity || item.currentQuantity || 0,
            totalBoughtQuantity: item.total_bought_quantity || item.totalBoughtQuantity || 0,
            totalSoldQuantity: item.total_sold_quantity || item.totalSoldQuantity || 0,
            averagePrice: item.average_price || item.averagePrice || 0,
            status: item.status || "Unknown",
          })),
          availableBalance: data?.available_balance || data?.availableBalance || 0,
        });
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        setPortfolio({
          holdings: [],
          availableBalance: 0,
        });
      }
    };

    fetchPortfolio();
  }, []);

  const totalHoldingsValue = portfolio.holdings.reduce(
    (acc, holding) => acc + Number(holding.currentQuantity) * Number(holding.averagePrice),
    0
  );
  const totalPortfolioValue = totalHoldingsValue + portfolio.availableBalance;

  const PortfolioItem = ({
    symbol,
    currentQuantity,
    totalBoughtQuantity,
    totalSoldQuantity,
    averagePrice,
    status,
  }: {
    symbol: string;
    currentQuantity: number;
    totalBoughtQuantity: number;
    totalSoldQuantity: number;
    averagePrice: number;
    status: string;
  }) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>Stock Symbol: {symbol}</Text> {/* Changed from "Symbol" to "Stock Symbol" */}
        <Text style={styles.itemText}>Current Quantity: {Number(currentQuantity).toFixed(4)}</Text>
        <Text style={styles.itemText}>Total Bought: {Number(totalBoughtQuantity).toFixed(4)}</Text>
        <Text style={styles.itemText}>Total Sold: {Number(totalSoldQuantity).toFixed(4)}</Text>
        <Text style={styles.itemText}>Avg. Price: ${Number(averagePrice).toFixed(2)}</Text>
        <Text style={styles.itemText}>Status: {status}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Portfolio</Text>
      <Text style={styles.content}>Track your stock investments</Text>
      <View style={styles.summaryContainer}>
        <Text style={styles.totalValue}>Total Holdings Value: ${totalHoldingsValue.toFixed(2)}</Text>
        <Text style={styles.totalValue}>Available Balance: ${portfolio.availableBalance.toFixed(2)}</Text>
        <Text style={styles.totalValue}>Total Portfolio Value: ${totalPortfolioValue.toFixed(2)}</Text>
      </View>
      {portfolio.holdings.length > 0 ? (
        <FlatList
          data={portfolio.holdings}
          renderItem={({ item }) => (
            <PortfolioItem
              symbol={item.symbol}
              currentQuantity={item.currentQuantity}
              totalBoughtQuantity={item.totalBoughtQuantity}
              totalSoldQuantity={item.totalSoldQuantity}
              averagePrice={item.averagePrice}
              status={item.status}
            />
          )}
          keyExtractor={(item) => `${item.symbol}-${item.currentQuantity}`}
        />
      ) : (
        <Text style={styles.noDataText}>No investments available.</Text>
      )}
      
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
    marginBottom: 5,
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
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Portfolio;