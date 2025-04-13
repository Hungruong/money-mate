import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Modal, StyleSheet, Dimensions, StatusBar, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

// Define navigation types
type RootStackParamList = {
  Portfolio: undefined;
  TransactionHistory: undefined;
  AutoTrade: undefined;
  ManualTrade: undefined;
  Trading: undefined;
};

type TradingScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const BACKEND_API_URL = "http://localhost:8086/api";

const TradingScreen = () => {
  // Use properly typed navigation
  const navigation = useNavigation<TradingScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ symbol: string, shortName: string, regularMarketPrice: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const searchStock = async () => {
    if (!searchQuery.trim()) {
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

      const results = await response.json();

      if (results && results.length > 0) {
        const formattedData = results.map((stock: { symbol: string, name: string, price: number }) => ({
          symbol: stock.symbol,
          shortName: stock.name,
          regularMarketPrice: stock.price ? stock.price.toString() : "N/A",
        }));
        setSearchResults(formattedData);
        setModalVisible(true);
      } else {
        setSearchResults([]);
        setModalVisible(true);
      }
    } catch (err) {
      setSearchResults([]);
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ec529e" barStyle="light-content" />
      
      {/* App Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Market Trader</Text>
      </View>

      {/* Centered Search Section */}
      <View style={styles.centeredContent}>
        <View style={styles.searchSection}>
          <Text style={styles.searchTitle}>Find Your Next Investment</Text>
          <Text style={styles.searchSubtitle}>Search thousands of stocks in real-time</Text>
          
          <View style={styles.searchInputContainer}>
            <Ionicons name="search-outline" size={22} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter stock name or symbol..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <TouchableOpacity style={styles.searchButton} onPress={searchStock} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Search</Text>
            <Ionicons name="arrow-forward" size={18} color="white" style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>

        {/* Decorative Elements */}
        <View style={styles.decorativeContainer}>
          <View style={[styles.decorativeCircle, styles.decorativeCircle1]} />
          <View style={[styles.decorativeCircle, styles.decorativeCircle2]} />
          <View style={[styles.decorativeCircle, styles.decorativeCircle3]} />
        </View>
      </View>

      {/* Beautiful Popup Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Results</Text>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={22} color="white" />
              </TouchableOpacity>
            </View>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ec529e" />
                <Text style={styles.loadingText}>Searching market data...</Text>
              </View>
            ) : searchResults.length === 0 ? (
              <View style={styles.emptyResultContainer}>
                <Ionicons name="search" size={56} color="#e0e0e0" />
                <Text style={styles.emptyResultTitle}>No Stocks Found</Text>
                <Text style={styles.emptyResultText}>
                  Try searching with a different keyword or stock symbol
                </Text>
              </View>
            ) : (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.symbol}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.stockCard}>
                    <View style={styles.stockCardLeft}>
                      <View style={styles.stockLogoContainer}>
                        <Text style={styles.stockLogoText}>{item.symbol.charAt(0)}</Text>
                      </View>
                      <View style={styles.stockInfo}>
                        <Text style={styles.stockSymbol}>{item.symbol}</Text>
                        <Text style={styles.stockName} numberOfLines={1} ellipsizeMode="tail">
                          {item.shortName}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.stockCardRight}>
                      <Text style={styles.stockPrice}>
                        ${item.regularMarketPrice}
                      </Text>
                      <View style={styles.tradeButtonContainer}>
                        <TouchableOpacity style={styles.tradeButton}>
                          <Text style={styles.tradeButtonText}>Trade</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.resultsList}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate("Portfolio")}
        >
          <Ionicons name="briefcase-outline" size={24} color="#ec529e" />
          <Text style={styles.navButtonText}>Portfolio</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate("TransactionHistory")}
        >
          <Ionicons name="list-outline" size={24} color="#ec529e" />
          <Text style={styles.navButtonText}>Transaction</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, styles.navButtonActive]}
          onPress={() => navigation.navigate("Trading")}
        >
          <Ionicons name="trending-up" size={24} color="#fff" />
          <Text style={styles.navButtonTextActive}>Trading</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate("AutoTrade")}
        >
          <Ionicons name="flash-outline" size={24} color="#ec529e" />
          <Text style={styles.navButtonText}>Auto</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate("ManualTrade")}
        >
          <Ionicons name="hand-left-outline" size={24} color="#ec529e" />
          <Text style={styles.navButtonText}>Manual</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fef4ff",
  },
  header: {
    backgroundColor: "#f9c4f4",
    padding: 16,
    paddingTop: 48,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerTitle: {
    color: "#333",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    position: "relative",
  },
  searchSection: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    elevation: 6,
    shadowColor: "#ec529e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 2,
  },
  searchTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  searchSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  searchInputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff5fd",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#f9c4f4",
  },
  searchIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ec529e",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  decorativeContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  decorativeCircle: {
    position: "absolute",
    borderRadius: 100,
    opacity: 0.1,
  },
  decorativeCircle1: {
    width: 200,
    height: 200,
    backgroundColor: "#ec529e",
    top: "10%",
    left: "-20%",
  },
  decorativeCircle2: {
    width: 150,
    height: 150,
    backgroundColor: "#f9c4f4",
    bottom: "15%",
    right: "-10%",
  },
  decorativeCircle3: {
    width: 100,
    height: 100,
    backgroundColor: "#ec529e",
    top: "60%",
    left: "20%",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ec529e",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  emptyResultContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyResultTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  emptyResultText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  resultsList: {
    paddingVertical: 12,
  },
  stockCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  stockCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  stockLogoContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff0f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  stockLogoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ec529e",
  },
  stockInfo: {
    flex: 1,
  },
  stockSymbol: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  stockName: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
    maxWidth: 150,
  },
  stockCardRight: {
    alignItems: "flex-end",
  },
  stockPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  tradeButtonContainer: {
    flexDirection: "row",
  },
  tradeButton: {
    backgroundColor: "#fff0f5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  tradeButtonText: {
    color: "#ec529e",
    fontWeight: "bold",
    fontSize: 12,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#f9c4f4",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  navButtonActive: {
    backgroundColor: "#ec529e",
    elevation: 4,
    shadowColor: "#ec529e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  navButtonText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  navButtonTextActive: {
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
    marginTop: 4,
  },
});

export default TradingScreen;