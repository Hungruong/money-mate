import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Modal,
  TextInput,
  Alert,
  ActivityIndicator
} from "react-native";

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
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState<{
    symbol: string;
    currentQuantity: number;
    totalBoughtQuantity: number;
    totalSoldQuantity: number;
    averagePrice: number;
    status: string;
  } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState('buy');
  const [quantity, setQuantity] = useState('');
  const [sortBy, setSortBy] = useState('symbol');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const hardcodedUserId = "a2b0d0ab-951d-437f-81f7-c228e1d727f2";

  const fetchPortfolio = async () => {
    setIsLoading(true);
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
      Alert.alert("Error", "Failed to load portfolio data. Please try again.");
      setPortfolio({
        holdings: [],
        availableBalance: 0,
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPortfolio();
  };

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const sortedHoldings = [...portfolio.holdings].sort((a, b) => {
    let valueA = (a as any)[sortBy];
    let valueB = (b as any)[sortBy];
    
    if (typeof valueA === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }
    
    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const totalHoldingsValue = portfolio.holdings.reduce(
    (acc, holding) => acc + Number(holding.currentQuantity) * Number(holding.averagePrice),
    0
  );
  const totalPortfolioValue = totalHoldingsValue + portfolio.availableBalance;

  const handleTransaction = async () => {
    if (!selectedHolding || !quantity || isNaN(Number(quantity))) {
      Alert.alert("Error", "Please enter a valid quantity");
      return;
    }

    const qtyNum = Number(quantity);
    if (qtyNum <= 0) {
      Alert.alert("Error", "Quantity must be greater than zero");
      return;
    }

    if (transactionType === 'sell' && qtyNum > selectedHolding.currentQuantity) {
      Alert.alert("Error", "Cannot sell more than you own");
      return;
    }

    const transactionCost = qtyNum * selectedHolding.averagePrice;
    if (transactionType === 'buy' && transactionCost > portfolio.availableBalance) {
      Alert.alert("Error", "Insufficient funds for this purchase");
      return;
    }

    // Here you would call your API to execute the transaction
    // For demo purposes, we'll update locally
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update portfolio locally for demo
      const updatedHoldings = portfolio.holdings.map(holding => {
        if (holding.symbol === selectedHolding.symbol) {
          const newCurrentQty = transactionType === 'buy' 
            ? holding.currentQuantity + qtyNum 
            : holding.currentQuantity - qtyNum;
            
          return {
            ...holding,
            currentQuantity: newCurrentQty,
            totalBoughtQuantity: transactionType === 'buy' 
              ? holding.totalBoughtQuantity + qtyNum 
              : holding.totalBoughtQuantity,
            totalSoldQuantity: transactionType === 'sell' 
              ? holding.totalSoldQuantity + qtyNum 
              : holding.totalSoldQuantity,
          };
        }
        return holding;
      });
      
      const updatedBalance = transactionType === 'buy'
        ? portfolio.availableBalance - transactionCost
        : portfolio.availableBalance + transactionCost;
        
      setPortfolio({
        holdings: updatedHoldings,
        availableBalance: updatedBalance
      });
      
      setModalVisible(false);
      setQuantity('');
      Alert.alert("Success", `Successfully ${transactionType === 'buy' ? 'bought' : 'sold'} ${qtyNum} shares of ${selectedHolding.symbol}`);
    } catch (error) {
      console.error("Transaction error:", error);
      Alert.alert("Error", "Transaction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const PortfolioItem = ({ item }: { item: any }) => {
    const currentValue = Number(item.currentQuantity) * Number(item.averagePrice);
    const percentOfPortfolio = totalPortfolioValue > 0 
      ? ((currentValue / totalPortfolioValue) * 100).toFixed(2) 
      : '0.00';
      
    return (
      <TouchableOpacity 
        style={styles.itemContainer}
        onPress={() => {
          setSelectedHolding(item);
          setModalVisible(true);
        }}
      >
        <View style={styles.itemHeader}>
          <Text style={styles.symbolText}>{item.symbol}</Text>
          <Text style={styles.valueText}>${currentValue.toFixed(2)}</Text>
        </View>
        
        <View style={styles.itemDetails}>
          <View style={styles.detailColumn}>
            <Text style={styles.itemText}>Qty: {Number(item.currentQuantity).toFixed(4)}</Text>
            <Text style={styles.itemText}>Avg. Price: ${Number(item.averagePrice).toFixed(2)}</Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={styles.itemText}>Status: {item.status}</Text>
            <Text style={styles.itemText}>Portfolio: {percentOfPortfolio}%</Text>
          </View>
        </View>
        
        <View style={styles.transactionSummary}>
          <Text style={styles.itemTextSmall}>Bought: {Number(item.totalBoughtQuantity).toFixed(4)}</Text>
          <Text style={styles.itemTextSmall}>Sold: {Number(item.totalSoldQuantity).toFixed(4)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTransactionModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {selectedHolding?.symbol} - ${Number(selectedHolding?.averagePrice).toFixed(2)}
          </Text>
          
          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              style={[
                styles.toggleButton, 
                transactionType === 'buy' ? styles.activeToggle : null
              ]}
              onPress={() => setTransactionType('buy')}
            >
              <Text style={styles.toggleText}>Buy</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.toggleButton, 
                transactionType === 'sell' ? styles.activeToggle : null
              ]}
              onPress={() => setTransactionType('sell')}
            >
              <Text style={styles.toggleText}>Sell</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.inputLabel}>Quantity:</Text>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            placeholder="Enter quantity"
          />
          
          {selectedHolding && (
            <View style={styles.transactionPreview}>
              <Text style={styles.previewText}>
                {transactionType === 'buy' ? 'Cost' : 'Proceeds'}: 
                ${(Number(quantity || 0) * Number(selectedHolding.averagePrice)).toFixed(2)}
              </Text>
              {transactionType === 'sell' && (
                <Text style={styles.previewText}>
                  Current holdings: {Number(selectedHolding.currentQuantity).toFixed(4)}
                </Text>
              )}
              {transactionType === 'buy' && (
                <Text style={styles.previewText}>
                  Available balance: ${portfolio.availableBalance.toFixed(2)}
                </Text>
              )}
            </View>
          )}
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                setModalVisible(false);
                setQuantity('');
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.confirmButton]}
              onPress={handleTransaction}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const SortButton = ({ title, sortKey }: { title: string; sortKey: string }) => (
    <TouchableOpacity 
      style={styles.sortButton} 
      onPress={() => handleSort(sortKey)}
    >
      <Text style={styles.sortButtonText}>
        {title} {sortBy === sortKey && (sortOrder === 'asc' ? '↑' : '↓')}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading && !refreshing) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text style={styles.loadingText}>Loading portfolio...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Portfolio</Text>
      <Text style={styles.content}>Track and manage your stock investments</Text>
      
      <View style={styles.summaryContainer}>
        <Text style={styles.totalValue}>
          Total Portfolio Value: ${totalPortfolioValue.toFixed(2)}
        </Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryValue}>
            Holdings: ${totalHoldingsValue.toFixed(2)}
          </Text>
          <Text style={styles.summaryValue}>
            Cash: ${portfolio.availableBalance.toFixed(2)}
          </Text>
        </View>
      </View>
      
      <View style={styles.sortContainer}>
        <Text style={styles.sortTitle}>Sort by:</Text>
        <View style={styles.sortButtons}>
          <SortButton title="Symbol" sortKey="symbol" />
          <SortButton title="Quantity" sortKey="currentQuantity" />
          <SortButton title="Price" sortKey="averagePrice" />
        </View>
      </View>
      
      {portfolio.holdings.length > 0 ? (
        <FlatList
          data={sortedHoldings}
          renderItem={({ item }) => <PortfolioItem item={item} />}
          keyExtractor={(item) => `${item.symbol}-${item.currentQuantity}`}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.noDataText}>No investments available.</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {
              // Here you would navigate to a screen to add a new investment
              Alert.alert("Info", "This would navigate to 'Add Investment' screen");
            }}
          >
            <Text style={styles.addButtonText}>Add Your First Investment</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {renderTransactionModal()}
      
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={onRefresh}
      >
        <Text style={styles.refreshButtonText}>Refresh Data</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fed0f0",
    padding: 20,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#3d3440", 
    textAlign: "center",
  },
  content: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  summaryContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryValue: {
    fontSize: 16,
    color: "#666",
  },
  sortContainer: {
    marginBottom: 15,
  },
  sortTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  sortButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sortButton: {
    backgroundColor: "#e9d5ff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  sortButtonText: {
    color: "#4a148c",
    fontWeight: "bold",
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  symbolText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4a148c",
  },
  valueText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  itemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailColumn: {
    flex: 1,
  },
  itemText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  transactionSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  itemTextSmall: {
    fontSize: 12,
    color: "#666",
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  addButton: {
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#8b5cf6",
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  refreshButton: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#a855f7",
    borderRadius: 8,
    alignItems: "center",
  },
  refreshButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  activeToggle: {
    backgroundColor: "#8b5cf6",
  },
  toggleText: {
    fontWeight: "bold",
    color: "#333",
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  transactionPreview: {
    marginBottom: 20,
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 5,
  },
  previewText: {
    fontSize: 14,
    marginBottom: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#e2e8f0",
  },
  confirmButton: {
    backgroundColor: "#8b5cf6",
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff",
  }
});

export default Portfolio;