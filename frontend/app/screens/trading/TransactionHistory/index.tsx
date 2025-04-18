import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  RefreshControl,
  Modal,
  ScrollView,
  Dimensions
} from "react-native";
import { useFonts, PlayfairDisplay_400Regular } from "@expo-google-fonts/playfair-display";
import { FontAwesome } from '@expo/vector-icons';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  const [filterType, setFilterType] = useState("all"); // "all", "buy", "sell"
  
  const hardcodedUserId = "27431f9a-3b99-426f-909e-5301102b115d";

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
  });

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8086/api/transactions/user/${hardcodedUserId}`);
      console.info("Response Status:", response.status);
      const data = await response.json();
      console.info("Raw Data:", data);

      const formattedTransactions = data.map((transaction: any) => ({
        id: transaction.transactionId,
        date: new Date(transaction.timestamp).toLocaleDateString(),
        tickerSymbol: transaction.investment?.symbol || "N/A",
        quantity: transaction.quantity,
        purchasePrice: transaction.price,
        amount: transaction.totalAmount * (transaction.type === "sell" ? -1 : 1),
        purchaseType: transaction.type,
        timestamp: transaction.timestamp,
      }));
      setTransactions(formattedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  const handleTransactionPress = (transaction: any) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  const getFilteredTransactions = () => {
    if (filterType === "all") return transactions;
    return transactions.filter(t => t.purchaseType === filterType);
  };

  const renderItem = ({ item }: { item: any }) => {
    // Background colors for buy and sell transactions
    const buyColors = { mainBg: "#d6ebff", secondaryBg: "#f5f9ff" };
    const sellColors = { mainBg: "#FCE4EC", secondaryBg: "#F8BBD0" };
    const bgColors = item.purchaseType === "buy" ? buyColors : sellColors;

    return (
      <TouchableOpacity
        style={styles.transactionItem}
        onPress={() => handleTransactionPress(item)}
        activeOpacity={0.9}
      >
        <View style={[
          styles.gradientBackground,
          { backgroundColor: bgColors.mainBg }
        ]}>
          <View style={styles.transactionDetails}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.tickerSymbol}>{item.tickerSymbol}</Text>
          </View>
          <View style={styles.transactionAmount}>
            <Text style={styles.quantity}>Qty: {item.quantity}</Text>
            <Text style={styles.purchasePrice}>${item.purchasePrice.toFixed(2)}</Text>
            <Text
              style={[
                styles.amount,
                item.amount < 0 ? styles.negative : styles.positive,
              ]}
            >
              {item.amount < 0
                ? `-$${Math.abs(item.amount).toFixed(2)}`
                : `$${item.amount.toFixed(2)}`}
            </Text>
            <View style={[
              styles.purchaseTypeContainer, 
              item.purchaseType === "buy" ? styles.buyType : styles.sellType
            ]}>
              <FontAwesome 
                name={item.purchaseType === "buy" ? "arrow-down" : "arrow-up"} 
                size={10} 
                color="#ffffff" 
                style={styles.typeIcon} 
              />
              <Text style={styles.purchaseType}>{item.purchaseType.toUpperCase()}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTransactionModal = () => {
    if (!selectedTransaction) return null;
    
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedTransaction.tickerSymbol}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <FontAwesome name="times" size={24} color="#4A4A4A" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalBody}>
                <View style={styles.transactionDetailRow}>
                  <Text style={styles.detailLabel}>Transaction Type:</Text>
                  <View style={[
                    styles.purchaseTypeContainer,
                    selectedTransaction.purchaseType === "buy" ? styles.buyType : styles.sellType,
                    styles.modalTypeTag
                  ]}>
                    <FontAwesome 
                      name={selectedTransaction.purchaseType === "buy" ? "arrow-down" : "arrow-up"} 
                      size={12} 
                      color="#ffffff" 
                      style={styles.typeIcon} 
                    />
                    <Text style={styles.purchaseType}>
                      {selectedTransaction.purchaseType.toUpperCase()}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.transactionDetailRow}>
                  <Text style={styles.detailLabel}>Date:</Text>
                  <Text style={styles.detailValue}>{selectedTransaction.date}</Text>
                </View>
                
                <View style={styles.transactionDetailRow}>
                  <Text style={styles.detailLabel}>Quantity:</Text>
                  <Text style={styles.detailValue}>{selectedTransaction.quantity}</Text>
                </View>
                
                <View style={styles.transactionDetailRow}>
                  <Text style={styles.detailLabel}>Price per Share:</Text>
                  <Text style={styles.detailValue}>${selectedTransaction.purchasePrice.toFixed(2)}</Text>
                </View>
                
                <View style={styles.transactionDetailRow}>
                  <Text style={styles.detailLabel}>Total Amount:</Text>
                  <Text style={[
                    styles.detailValue, 
                    styles.totalAmount,
                    selectedTransaction.amount < 0 ? styles.negative : styles.positive
                  ]}>
                    {selectedTransaction.amount < 0
                      ? `-$${Math.abs(selectedTransaction.amount).toFixed(2)}`
                      : `$${selectedTransaction.amount.toFixed(2)}`}
                  </Text>
                </View>
                
                <View style={styles.transactionDetailRow}>
                  <Text style={styles.detailLabel}>Transaction ID:</Text>
                  <Text style={styles.detailValue}>{selectedTransaction.id}</Text>
                </View>
              </ScrollView>
              
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.primaryButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.actionButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  if (!fontsLoaded) {
    return <View style={styles.loadingContainer}><Text>Loading...</Text></View>;
  }

  return (
    <View style={[styles.container, { backgroundColor: "#ffe9f0" }]}>
      {/* Title with icons */}
      <View style={styles.titleContainer}>
        <FontAwesome name="history" size={24} color="#4A4A4A" />
        <Text style={styles.title}>Transaction History</Text>
        <FontAwesome name="line-chart" size={24} color="#4A4A4A" />
      </View>

      {/* Filter tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filterType === "all" && styles.activeFilterTab]}
          onPress={() => setFilterType("all")}
        >
          <Text style={[styles.filterText, filterType === "all" && styles.activeFilterText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filterType === "buy" && styles.activeFilterTab]}
          onPress={() => setFilterType("buy")}
        >
          <Text style={[styles.filterText, filterType === "buy" && styles.activeFilterText]}>
            Buy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filterType === "sell" && styles.activeFilterTab]}
          onPress={() => setFilterType("sell")}
        >
          <Text style={[styles.filterText, filterType === "sell" && styles.activeFilterText]}>
            Sell
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        {loading && transactions.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading transactions...</Text>
          </View>
        ) : getFilteredTransactions().length > 0 ? (
          <FlatList
            data={getFilteredTransactions()}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#4A90E2", "#50C878"]}
                tintColor="#4A90E2"
              />
            }
          />
        ) : (
          <View style={styles.emptyContainer}>
            <FontAwesome name="inbox" size={50} color="#BBBBBB" />
            <Text style={styles.noTransactions}>
              {filterType === "all" 
                ? "No transactions available." 
                : `No ${filterType} transactions found.`}
            </Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={onRefresh}
            >
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {renderTransactionModal()}
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#757575',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "400",
    textAlign: "center",
    color: "#000000",
    fontFamily: "PlayfairDisplay_400Regular",
    letterSpacing: 1.5,
    marginHorizontal: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    padding: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeFilterTab: {
    backgroundColor: '#4A90E2',
  },
  filterText: {
    fontWeight: '600',
    color: '#4A4A4A',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingBottom: 20,
  },
  transactionItem: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  gradientBackground: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionDetails: {
    flex: 2,
  },
  date: {
    fontSize: 12,
    color: "#5d4037",
    fontWeight: "500",
    marginBottom: 4,
  },
  tickerSymbol: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3e2723",
  },
  transactionAmount: {
    flex: 1.2,
    alignItems: "flex-end",
  },
  quantity: {
    fontSize: 14,
    color: "#5d4037",
    fontWeight: "500",
    marginBottom: 4,
  },
  purchasePrice: {
    fontSize: 14,
    color: "#5d4037",
    fontWeight: "500",
    marginBottom: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  positive: {
    color: "#00c853",
  },
  negative: {
    color: "#d81b60",
  },
  purchaseTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  buyType: {
    backgroundColor: "#00c853",
  },
  sellType: {
    backgroundColor: "#d81b60",
  },
  typeIcon: {
    marginRight: 4,
  },
  purchaseType: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },
  noTransactions: {
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  refreshButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#4A90E2',
    borderRadius: 20,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24,
  },
  modalContent: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: "PlayfairDisplay_400Regular",
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
    maxHeight: 300,
  },
  transactionDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalTypeTag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    alignItems: 'center',
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default TransactionHistory;