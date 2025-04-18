import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView, StatusBar, Image } from "react-native";
import axios from "axios";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { Ionicons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

// Use your machine's IP if testing on emulator/physical device
const BASE_URL = "http://localhost:8086"; // Try "http://192.168.1.x:8086" if localhost fails

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
        setPrice(Number(response.data)); // Ensure it's a number
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

  // Get stock icon based on symbol (this is just a placeholder function)
  const getStockIcon = (symbol: string) => {
    const icons: {[key: string]: string} = {
      'AAPL': 'apple',
      'GOOG': 'google',
      'MSFT': 'microsoft',
      'AMZN': 'amazon',
      'FB': 'facebook',
      'TSLA': 'car-electric',
      'NFLX': 'television',
    };
    
    return icons[symbol as keyof typeof icons] || 'chart-line';
  };

  // Determine action colors - pastel theme
  const getActionColors = (action: string) => {
    if (action.toLowerCase() === 'buy') {
      return {
        main: '#a7f3d0', // pastel green
        text: '#047857', // darker green for text
        icon: 'trending-up'
      };
    } else {
      return {
        main: '#fecaca', // pastel red
        text: '#b91c1c', // darker red for text
        icon: 'trending-down'
      };
    }
  };
  
  const actionColors = getActionColors(action);

  if (!symbol || !quantity || !action || !userId) {
    return (
      <SafeAreaView style={[styles.errorContainer, { backgroundColor: '#fef3c7' }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#fef3c7" />
        <Ionicons name="alert-circle-outline" size={60} color="#d97706" />
        <Text style={[styles.errorText, { color: '#92400e' }]}>Invalid order data. Please go back and try again.</Text>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: '#f59e0b' }]} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: '#e0e7ff' }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#e0e7ff" />
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={[styles.loadingText, { color: '#4338ca' }]}>Retrieving latest price...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.errorContainer, { backgroundColor: '#fee2e2' }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#fee2e2" />
        <Ionicons name="close-circle-outline" size={60} color="#dc2626" />
        <Text style={[styles.errorText, { color: '#991b1b' }]}>{error}</Text>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: '#ef4444' }]} onPress={handleCancel}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#f5f3ff' }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f3ff" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Order Confirmation</Text>
        <View style={[styles.actionBadge, { backgroundColor: actionColors.main }]}>
          <MaterialCommunityIcons name={actionColors.icon as "symbol" | "function" | "solid" | "filter" | "card" | "key" | "history" | "routes" | "navigation" | "loading" | "trending-up" | "trending-down" | "map" | "at" | "sort" | "chart-line"} size={18} color={actionColors.text} style={styles.actionIcon} />
          <Text style={[styles.actionText, { color: actionColors.text }]}>
            {action.toUpperCase()}
          </Text>
        </View>
      </View>
      
      <View style={styles.card}>
        <View style={styles.symbolContainer}>
          <View style={styles.iconAndSymbol}>
            <View style={[styles.iconCircle, { backgroundColor: '#ddd6fe' }]}>
              <MaterialCommunityIcons name={getStockIcon(symbol) as "symbol" | "function" | "solid" | "filter" | "card" | "navigation" | "cancel" | "map" | "at" | "sort" | "key" | "repeat" | "anchor" | "link" | "opacity" | "margin" | "wrap" | "scale"} size={24} color="#7c3aed" />
            </View>
            <View style={[styles.symbolBadge, { backgroundColor: '#ede9fe' }]}>
              <Text style={[styles.symbolText, { color: '#7c3aed' }]}>{symbol}</Text>
            </View>
          </View>
          <Text style={styles.priceText}>${price?.toFixed(2) || "N/A"}</Text>
        </View>
        
        <View style={[styles.divider, { backgroundColor: '#e5e7eb' }]} />
        
        <View style={styles.detailRow}>
          <View style={styles.detailLabelContainer}>
            <FontAwesome name="balance-scale" size={16} color="#6b7280" style={styles.detailIcon} />
            <Text style={styles.detailLabel}>Quantity</Text>
          </View>
          <Text style={styles.detailValue}>{quantity} shares</Text>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailLabelContainer}>
            <FontAwesome name="tag" size={16} color="#6b7280" style={styles.detailIcon} />
            <Text style={styles.detailLabel}>Price per Share</Text>
          </View>
          <Text style={styles.detailValue}>${price?.toFixed(2) || "N/A"}</Text>
        </View>
        
        <View style={[styles.divider, { backgroundColor: '#e5e7eb' }]} />
        
        <View style={styles.totalRow}>
          <View style={styles.detailLabelContainer}>
            <FontAwesome name="money" size={18} color="#111827" style={styles.detailIcon} />
            <Text style={styles.totalLabel}>Total Amount</Text>
          </View>
          <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
        </View>
      </View>
      
      <View style={[styles.noteContainer, { backgroundColor: '#dbeafe' }]}>
        <Ionicons name="information-circle-outline" size={24} color="#2563eb" />
        <Text style={[styles.noteText, { color: '#1e40af' }]}>
          Once confirmed, this order will be executed immediately at the current market price.
        </Text>
      </View>
      
      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#a7f3d0' }]} 
          onPress={handleConfirm}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#047857" />
          <Text style={[styles.buttonText, { color: '#047857' }]}>Confirm Order</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#fecaca' }]} 
          onPress={handleCancel}
        >
          <Ionicons name="close-circle-outline" size={20} color="#b91c1c" />
          <Text style={[styles.buttonText, { color: '#b91c1c' }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footerContainer}>
        <View style={[styles.securityBadge, { backgroundColor: '#d1fae5' }]}>
          <Ionicons name="shield-checkmark-outline" size={16} color="#065f46" />
          <Text style={[styles.securityText, { color: '#065f46' }]}>Secure Transaction</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  actionBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionIcon: {
    marginRight: 5,
  },
  actionText: {
    fontWeight: "700",
    fontSize: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  symbolContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  iconAndSymbol: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  symbolBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  symbolText: {
    fontSize: 18,
    fontWeight: "700",
  },
  priceText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailIcon: {
    marginRight: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: "#6b7280",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  noteText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
  },
  buttonGroup: {
    width: "100%",
    marginTop: 10,
    gap: 16,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 18,
    marginLeft: 8,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  footerContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  securityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  securityText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  }
});

export default ConfirmOrder;