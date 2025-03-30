import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Modal, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const BACKEND_API_URL = "http://localhost:8086/api";

const TradingScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const searchStock = async () => {
    if (!searchQuery.trim()) {
      setDashboardData([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_API_URL}/search/stocks?query=${searchQuery}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const searchResults = await response.json();

      if (searchResults && searchResults.length > 0) {
        const formattedData = searchResults.map((stock) => ({
          symbol: stock.symbol,
          shortName: stock.name,
          regularMarketPrice: stock.price ? stock.price.toString() : "N/A",
        }));
        setDashboardData(formattedData);
        setModalVisible(true); // Show popup card
      } else {
        setDashboardData([]);
      }
    } catch (err) {
      setError(err.message); // Show error in modal
      setDashboardData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar and Button */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Search stocks..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchStock}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Dashboard Placeholder */}
      <View style={styles.dashboard}>
        <Text style={styles.dashboardTitle}>Market Dashboard</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          !dashboardData.length && <Text>Search for stocks to see results</Text>
        )}
      </View>

      {/* Popup Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Search Results</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : dashboardData.length === 0 ? (
              <Text>No stocks found</Text>
            ) : (
              <FlatList
                data={dashboardData}
                keyExtractor={(item) => item.symbol}
                renderItem={({ item }) => (
                  <View style={styles.stockCard}>
                    <Text style={styles.stockName}>
                      {item.shortName} ({item.symbol})
                    </Text>
                    <Text
                      style={[
                        styles.stockPrice,
                        { color: item.regularMarketPrice === "N/A" ? "gray" : "green" },
                      ]}
                    >
                      ${item.regularMarketPrice}
                    </Text>
                  </View>
                )}
                style={styles.flatList}
              />
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <LinearGradient colors={["rgba(58, 131, 244, 0.4)", "rgba(9, 181, 211, 0.4)"]} style={styles.gradientButton}>
          <TouchableOpacity onPress={() => navigation.navigate("Portfolio")}>
            <Text style={styles.navButtonText}>User Portfolio</Text>
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient colors={["rgba(58, 131, 244, 0.4)", "rgba(9, 181, 211, 0.4)"]} style={styles.gradientButton}>
          <TouchableOpacity onPress={() => navigation.navigate("TransactionHistory")}>
            <Text style={styles.navButtonText}>View Transactions</Text>
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient colors={["rgba(58, 131, 244, 0.4)", "rgba(9, 181, 211, 0.4)"]} style={styles.gradientButton}>
          <TouchableOpacity onPress={() => navigation.navigate("AutoTrade")}>
            <Text style={styles.navButtonText}>Auto Trade</Text>
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient colors={["rgba(58, 131, 244, 0.4)", "rgba(9, 181, 211, 0.4)"]} style={styles.gradientButton}>
          <TouchableOpacity onPress={() => navigation.navigate("ManualTrade")}>
            <Text style={styles.navButtonText}>Manual Trade</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
    backgroundColor: "#d8bfd8",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  textInput: {
    flex: 1,
    padding: 3,
    backgroundColor: "white",
    borderRadius: 4,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  searchButton: {
    marginLeft: 4,
    padding: 8,
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  dashboard: {
    flex: 1,
    marginTop: 4,
    backgroundColor: "white",
    padding: 4,
    borderRadius: 8,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  stockCard: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  stockName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  stockPrice: {
    fontSize: 16,
  },
  errorText: {
    color: "red",
  },
  flatList: {
    maxHeight: 300,
  },
  closeButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: "#FF4444",
    borderRadius: 4,
    alignItems: "center",
  },
  bottomButtons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingVertical: 4,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  gradientButton: {
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  navButtonText: {
    color: "black",
  },
});

export default TradingScreen;