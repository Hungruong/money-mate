import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Alert,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

// Hardcoded userId
const USER_ID = "a2b0d0ab-951d-437f-81f7-c228e1d727f2";
const BASE_URL = "http://localhost:8086/api/autotrading"; // Replace with IP if on emulator/device

// Strategy definitions with color coding
const STRATEGIES = [
  { 
    name: "Conservative", 
    value: "conservative", 
    targetReturn: "15%", 
    maxDuration: "30 days",
    color: "#4287f5", // Blue
    lightColor: "#e3f0ff",
    description: "Low risk, steady growth",
    icon: "shield-checkmark-outline", // Protection/safety icon
  },
  { 
    name: "Moderate", 
    value: "moderate", 
    targetReturn: "20%", 
    maxDuration: "10 days",
    color: "#9c42f5", // Purple
    lightColor: "#f3e6ff",
    description: "Balanced risk and reward",
    icon: "git-compare-outline", // Balance icon
  },
  { 
    name: "Aggressive", 
    value: "aggressive", 
    targetReturn: "25%", 
    maxDuration: "5 days",
    color: "#f55442", // Red/Orange
    lightColor: "#fff0ee",
    description: "Higher risk, greater returns",
    icon: "trending-up-outline", // Growth icon
  },
];

// Status colors and icons
const STATUS_COLORS = {
  active: {
    bg: "#4caf50",
    light: "#e8f5e9",
    text: "white",
    icon: "play-circle-outline",
  },
  paused: {
    bg: "#ff9800",
    light: "#fff3e0",
    text: "white",
    icon: "pause-circle-outline",
  },
  stopped: {
    bg: "#f44336",
    light: "#ffebee",
    text: "white",
    icon: "stop-circle-outline",
  },
  closed: {
    bg: "#9e9e9e",
    light: "#f5f5f5",
    text: "white",
    icon: "close-circle-outline",
  }
};

const AutoTrade = () => {
  const [selectedStrategy, setSelectedStrategy] = useState("");
  const [capital, setCapital] = useState("");
  const [currentStrategy, setCurrentStrategy] = useState<{ status: string; capital: number; startDate: string; strategy?: string } | null>(null);
  const [positions, setPositions] = useState<any[]>([]);
  const [autoInvestments, setAutoInvestments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { width } = Dimensions.get('window');
  const isSmallScreen = width < 375;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      await Promise.all([fetchCurrentStrategy(), fetchAutoInvestments()]);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to fetch data. Pull down to refresh.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchData();
  }, [fetchData]);

  const fetchCurrentStrategy = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/current/${USER_ID}`);
      console.log("Fetch Current Strategy Response:", response.data);
      setCurrentStrategy(response.data);
      setPositions(response.data.positions || []);
      return response.data;
    } catch (error: any) {
      console.log("Error fetching current strategy:", error.message);
      if (error.response) {
        console.log("Response data:", error.response.data);
        console.log("Response status:", error.response.status);
      }
      throw error;
    }
  };

  const fetchAutoInvestments = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/investments/${USER_ID}`);
      console.log("Fetch Auto Investments Response:", response.data);
      const autoInvs = response.data.filter((inv: any) => inv.type === "auto");
      setAutoInvestments(autoInvs);
      return autoInvs;
    } catch (error: any) {
      console.log("Error fetching auto investments:", error.message);
      if (error.response) {
        console.log("Response data:", error.response.data);
        console.log("Response status:", error.response.status);
      }
      throw error;
    }
  };

  const startStrategy = async () => {
    console.log("Start Strategy clicked with:", { selectedStrategy, capital });

    if (!selectedStrategy || !capital) {
      Alert.alert("Error", "Please select a strategy and enter capital.");
      return;
    }
    if (currentStrategy?.status === "active") {
      Alert.alert("Error", "An active strategy is already running. Pause or stop it first.");
      return;
    }

    const requestData = {
      userId: USER_ID,
      strategy: selectedStrategy,
      amount: parseFloat(capital),
    };

    try {
      setIsSubmitting(true);
      console.log("Sending request to start strategy:", requestData);
      const response = await axios.post(`${BASE_URL}/start`, requestData);
      console.log("Start Strategy Response:", response.data);

      const newStrategy = {
        strategy: selectedStrategy,
        capital: parseFloat(capital),
        status: "active",
        startDate: new Date().toISOString(),
        positions: response.data.positions || [],
      };

      setCurrentStrategy(newStrategy);
      setPositions(response.data.positions || []);
      await fetchAutoInvestments();
      Alert.alert("Success", `${selectedStrategy} strategy started with $${capital}!`);
      setCapital("");
      setSelectedStrategy("");
    } catch (error: any) {
      console.error("Error starting strategy:", error.message);
      if (error.response) {
        console.log("Response data:", error.response.data);
        console.log("Response status:", error.response.status);
      }
      Alert.alert("Error", `Failed to start strategy: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const performAction = async (action: string, actionFn: () => Promise<void>) => {
    try {
      setActionLoading(action);
      await actionFn();
      await fetchData();
    } catch (error: any) {
      console.error(`Error with ${action}:`, error.message);
      Alert.alert("Error", `Failed to ${action.toLowerCase()} strategy.`);
    } finally {
      setActionLoading(null);
    }
  };

  const pauseStrategy = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/pause/${USER_ID}`);
      console.log("Pause Response:", response.data);
      setCurrentStrategy({ ...currentStrategy, status: "paused", capital: currentStrategy?.capital || 0, startDate: currentStrategy?.startDate || "" });
      Alert.alert("Success", "Strategy paused.");
    } catch (error) {
      console.error("Error pausing strategy:", (error as any).message);
      throw error;
    }
  };

  const stopStrategy = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/stop/${USER_ID}`);
      console.log("Stop Response:", response.data);
      setCurrentStrategy({ ...currentStrategy, status: "stopped", capital: currentStrategy?.capital || 0, startDate: currentStrategy?.startDate || "" });
      Alert.alert("Success", "Strategy stopped.");
    } catch (error: any) {
      console.error("Error stopping strategy:", error.message);
      throw error;
    }
  };

  const resumeStrategy = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/resume/${USER_ID}`);
      console.log("Resume Response:", response.data);
      setCurrentStrategy({ ...currentStrategy, status: "active", capital: currentStrategy?.capital || 0, startDate: currentStrategy?.startDate || "" });
      Alert.alert("Success", "Strategy resumed.");
    } catch (error: any) {
      console.error("Error resuming strategy:", error.message);
      throw error;
    }
  };

  const closeStrategy = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/close/${USER_ID}`);
      console.log("Close Response:", response.data);
      setCurrentStrategy({ ...currentStrategy, status: "closed", capital: 0, startDate: currentStrategy?.startDate ?? "" });
      setPositions([]);
      Alert.alert("Success", "Strategy closed.");
    } catch (error: any) {
      console.error("Error closing strategy:", error.message);
      throw error;
    }
  };

  const sellPosition = async (symbol: string) => {
    try {
      setActionLoading(`sell-${symbol}`);
      const quantity = positions.find((p) => p.symbol === symbol).currentQuantity;
      const response = await axios.post(`${BASE_URL}/sell/${USER_ID}/${symbol}`, { quantity });
      console.log("Sell Response:", response.data);
      const updatedPositions = positions.filter((pos) => pos.symbol !== symbol);
      setPositions(updatedPositions);
      if (updatedPositions.length === 0 && currentStrategy && currentStrategy.status === "stopped") {
        await closeStrategy();
      } else {
        Alert.alert("Success", `Position ${symbol} sold.`);
      }
    } catch (error: any) {
      console.error("Error selling position:", error.message);
      Alert.alert("Error", "Failed to sell position.");
    } finally {
      setActionLoading(null);
    }
  };

  const renderStatusBadge = (status: string) => {
    const statusKey = status.toLowerCase() as keyof typeof STATUS_COLORS;
    const statusStyle = STATUS_COLORS[statusKey] || STATUS_COLORS.closed;

    return (
      <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
        <Ionicons name={statusStyle.icon as any} size={12} color={statusStyle.text} />
        <Text style={[styles.badgeText, { color: statusStyle.text }]}>{status.toUpperCase()}</Text>
      </View>
    );
  };

  const getStrategyInfo = (strategyValue: string | undefined) => {
    return STRATEGIES.find((s) => s.value === strategyValue) || null;
  };

  const renderStrategyDetails = () => {
    if (!currentStrategy) return null;

    const strategyInfo = getStrategyInfo(currentStrategy.strategy);
    const statusKey = (currentStrategy.status?.toLowerCase() || "closed") as keyof typeof STATUS_COLORS;
    const statusStyle = STATUS_COLORS[statusKey];
    
    return (
      <View style={[
        styles.card, 
        strategyInfo ? { borderLeftWidth: 5, borderLeftColor: strategyInfo.color } : {}
      ]}>
        <View style={[
          styles.cardHeader, 
          { backgroundColor: strategyInfo?.lightColor || '#f0f2f5' }
        ]}>
          <View style={styles.strategyHeader}>
            <Text style={styles.cardTitle}>Current Strategy</Text>
            {strategyInfo && (
              <View style={styles.strategyNameContainer}>
                <Ionicons 
                  name={(strategyInfo.icon as any)} 
                  size={18} 
                  color={strategyInfo.color} 
                  style={styles.strategyIcon}
                />
                <Text style={[styles.strategyName, { color: strategyInfo.color }]}>
                  {strategyInfo.name}
                </Text>
              </View>
            )}
          </View>
          {renderStatusBadge(currentStrategy.status)}
        </View>
        
        <View style={styles.cardContent}>
          {strategyInfo && (
            <View style={styles.strategyDescription}>
              <Text style={styles.descriptionText}>{strategyInfo.description}</Text>
            </View>
          )}
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Capital:</Text>
            <Text style={styles.detailValue}>${currentStrategy.capital.toFixed(2)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Target Return:</Text>
            <Text style={styles.detailValue}>{strategyInfo?.targetReturn || 'N/A'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Max Duration:</Text>
            <Text style={styles.detailValue}>{strategyInfo?.maxDuration || 'N/A'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Started:</Text>
            <Text style={styles.detailValue}>
              {new Date(currentStrategy.startDate).toLocaleDateString()}
            </Text>
          </View>
          
          <View style={[styles.statusIndicator, { backgroundColor: statusStyle.light }]}>
            <Ionicons 
              name={(statusStyle.icon as any)} 
              size={18} 
              color={statusStyle.bg} 
              style={styles.statusIcon}
            />
            <Text style={[styles.statusText, { color: statusStyle.bg }]}>
              Status: {currentStrategy.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          {currentStrategy.status === "active" && (
            <>
              <TouchableOpacity 
                style={[
                  styles.actionButton, 
                  { backgroundColor: STATUS_COLORS.paused.bg },
                  actionLoading === "pause" && styles.disabledButton
                ]} 
                onPress={() => performAction("pause", pauseStrategy)}
                disabled={actionLoading !== null}
              >
                {actionLoading === "pause" ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="pause-outline" size={18} color="white" style={styles.actionIcon} />
                    <Text style={styles.actionButtonText}>PAUSE</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.actionButton, 
                  { backgroundColor: STATUS_COLORS.stopped.bg },
                  actionLoading === "stop" && styles.disabledButton
                ]} 
                onPress={() => performAction("stop", stopStrategy)}
                disabled={actionLoading !== null}
              >
                {actionLoading === "stop" ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="stop-outline" size={18} color="white" style={styles.actionIcon} />
                    <Text style={styles.actionButtonText}>STOP</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
          {currentStrategy.status === "paused" && (
            <>
              <TouchableOpacity 
                style={[
                  styles.actionButton, 
                  { backgroundColor: STATUS_COLORS.active.bg },
                  actionLoading === "resume" && styles.disabledButton
                ]} 
                onPress={() => performAction("resume", resumeStrategy)}
                disabled={actionLoading !== null}
              >
                {actionLoading === "resume" ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="play-outline" size={18} color="white" style={styles.actionIcon} />
                    <Text style={styles.actionButtonText}>RESUME</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.actionButton, 
                  { backgroundColor: STATUS_COLORS.stopped.bg },
                  actionLoading === "stop" && styles.disabledButton
                ]} 
                onPress={() => performAction("stop", stopStrategy)}
                disabled={actionLoading !== null}
              >
                {actionLoading === "stop" ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="stop-outline" size={18} color="white" style={styles.actionIcon} />
                    <Text style={styles.actionButtonText}>STOP</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
          {currentStrategy.status === "stopped" && (
            <>
              <TouchableOpacity 
                style={[
                  styles.actionButton, 
                  { backgroundColor: "#9c27b0" },
                  actionLoading?.startsWith("sell-all") && styles.disabledButton
                ]} 
                onPress={() => {
                  setActionLoading("sell-all");
                  Promise.all(positions.map(p => sellPosition(p.symbol)))
                    .finally(() => setActionLoading(null));
                }}
                disabled={actionLoading !== null || positions.length === 0}
              >
                {actionLoading?.startsWith("sell-all") ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="cash-outline" size={18} color="white" style={styles.actionIcon} />
                    <Text style={styles.actionButtonText}>SELL ALL</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.actionButton, 
                  { backgroundColor: STATUS_COLORS.closed.bg },
                  actionLoading === "close" && styles.disabledButton,
                  positions.length > 0 && styles.disabledButton
                ]} 
                onPress={() => performAction("close", closeStrategy)}
                disabled={actionLoading !== null || positions.length > 0}
              >
                {actionLoading === "close" ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="close-outline" size={18} color="white" style={styles.actionIcon} />
                    <Text style={styles.actionButtonText}>CLOSE</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
        
        {positions.length > 0 && currentStrategy.status === "stopped" && (
          <View style={styles.warningContainer}>
            <Ionicons name="alert-circle-outline" size={16} color="#ff9800" />
            <Text style={styles.warningText}>
              You must sell all positions before closing the strategy
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderAutoInvestments = () => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="time-outline" size={20} color="#333" style={styles.cardTitleIcon} />
            <Text style={styles.cardTitle}>Auto Investments</Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          {autoInvestments.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="alert-circle-outline" size={32} color="#999" />
              <Text style={styles.emptyText}>No current auto investments.</Text>
            </View>
          ) : (
            <FlatList
              data={autoInvestments}
              keyExtractor={(item) => item.investmentId}
              renderItem={({ item }) => {
                const strategyInfo = getStrategyInfo(item.strategy);
                return (
                  <View style={[
                    styles.investmentItem,
                    strategyInfo ? { borderLeftWidth: 3, borderLeftColor: strategyInfo.color } : {}
                  ]}>
                    <View style={styles.investmentHeader}>
                      <View style={styles.investmentHeaderLeft}>
                        <Text style={styles.symbolText}>{item.symbol}</Text>
                        {strategyInfo && (
                          <View style={[
                            styles.strategyTag, 
                            { backgroundColor: strategyInfo.lightColor, borderColor: strategyInfo.color }
                          ]}>
                            <Ionicons 
                              name={(strategyInfo.icon as any)} 
                              size={12} 
                              color={strategyInfo.color} 
                              style={styles.tagIcon}
                            />
                            <Text style={[
                              styles.strategyTagText, 
                              { color: strategyInfo.color }
                            ]}>
                              {strategyInfo.name}
                            </Text>
                          </View>
                        )}
                      </View>
                      {renderStatusBadge(item.status)}
                    </View>
                    <View style={styles.investmentDetails}>
                      <View style={styles.investmentMetric}>
                        <Ionicons name="cart-outline" size={16} color="#666" style={styles.metricIcon} />
                        <Text style={styles.investmentText}>
                          Bought: {item.totalBoughtQuantity}
                        </Text>
                      </View>
                      <View style={styles.investmentMetric}>
                        <Ionicons name="cash-outline" size={16} color="#666" style={styles.metricIcon} />
                        <Text style={styles.investmentText}>
                          Sold: {item.totalSoldQuantity}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          )}
        </View>
      </View>
    );
  };

  const renderStrategyCard = (strategy: typeof STRATEGIES[0]) => {
    return (
      <TouchableOpacity
        style={[
          styles.strategyCard,
          { borderColor: strategy.color, backgroundColor: strategy.lightColor },
          selectedStrategy === strategy.value ? { borderWidth: 2 } : { borderWidth: 1 },
          isSmallScreen ? styles.smallStrategyCard : {}
        ]}
        onPress={() => setSelectedStrategy(strategy.value)}
        disabled={isSubmitting}
      >
        <View style={styles.strategyCardHeader}>
          <Ionicons name={(strategy.icon as any)} size={24} color={strategy.color} style={styles.strategyCardIcon} />
          <Text style={[styles.strategyCardTitle, { color: strategy.color }]}>
            {strategy.name}
          </Text>
        </View>
        <Text style={styles.strategyCardDescription}>{strategy.description}</Text>
        <View style={styles.strategyMetrics}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Return Target</Text>
            <Text style={[styles.metricValue, { color: strategy.color }]}>
              {strategy.targetReturn}
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Max Duration</Text>
            <Text style={[styles.metricValue, { color: strategy.color }]}>
              {strategy.maxDuration}
            </Text>
          </View>
        </View>
        {selectedStrategy === strategy.value && (
          <View style={[styles.selectedIndicator, { backgroundColor: strategy.color }]}>
            <Ionicons name="checkmark" size={10} color="white" />
            <Text style={styles.selectedText}>Selected</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderNewStrategyForm = () => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="add-circle-outline" size={20} color="#333" style={styles.cardTitleIcon} />
            <Text style={styles.cardTitle}>Start New Strategy</Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.inputLabel}>Select Strategy:</Text>
          
          <View style={[styles.strategySelector, isSmallScreen && { flexDirection: 'column' }]}>
            {STRATEGIES.map((strategy) => renderStrategyCard(strategy))}
          </View>

          <Text style={styles.inputLabel}>Capital Allocation ($):</Text>
          <View style={styles.inputContainer}>
            <View style={styles.dollarSignContainer}>
              <Text style={styles.dollarSign}>$</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={capital}
              onChangeText={setCapital}
              placeholderTextColor="#999"
              editable={!isSubmitting}
            />
          </View>

          <TouchableOpacity 
            style={[
              styles.submitButton,
              selectedStrategy ? { backgroundColor: getStrategyInfo(selectedStrategy)?.color || "#2196f3" } : { backgroundColor: "#2196f3" },
              (!selectedStrategy || !capital || isSubmitting) && styles.disabledButton
            ]} 
            onPress={startStrategy}
            disabled={!selectedStrategy || !capital || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="rocket-outline" size={20} color="white" style={styles.submitIcon} />
                <Text style={styles.submitButtonText}>START STRATEGY</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPositions = () => {
    if (positions.length === 0) return null;
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="list-outline" size={20} color="#333" style={styles.cardTitleIcon} />
            <Text style={styles.cardTitle}>Current Positions</Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <FlatList
            data={positions}
            keyExtractor={(item) => item.symbol}
            renderItem={({ item }) => {
              const strategyInfo = currentStrategy ? getStrategyInfo(currentStrategy.strategy) : null;
              // Calculate if position is in profit or loss
              const isProfit = item.currentPrice > item.averagePrice;
              const profitLossPercent = ((item.currentPrice - item.averagePrice) / item.averagePrice * 100).toFixed(2);
              
              return (
                <View style={[
                  styles.positionItem,
                  strategyInfo ? { borderLeftWidth: 3, borderLeftColor: strategyInfo.color } : {}
                ]}>
                  <View style={styles.positionInfo}>
                    <Text style={styles.symbolText}>{item.symbol}</Text>
                    <View style={styles.positionDetails}>
                      <View style={styles.positionMetric}>
                        <Ionicons name="layers-outline" size={14} color="#666" style={styles.metricIcon} />
                        <Text style={styles.positionText}>
                          {item.currentQuantity} shares @ ${parseFloat(item.averagePrice).toFixed(2)}
                        </Text>
                      </View>
                      <View style={styles.positionMetric}>
                        <Ionicons name="wallet-outline" size={14} color="#666" style={styles.metricIcon} />
                        <Text style={styles.valueText}>
                          Value: ${parseFloat(item.currentValue).toFixed(2)}
                        </Text>
                      </View>
                      <View style={styles.profitLossContainer}>
                        <Ionicons 
                          name={isProfit ? "trending-up-outline" : "trending-down-outline"} 
                          size={14} 
                          color={isProfit ? "#4caf50" : "#f44336"} 
                          style={styles.metricIcon} 
                        />
                        <Text style={[
                          styles.profitLossText,
                          { color: isProfit ? "#4caf50" : "#f44336" }
                        ]}>
                          {isProfit ? "+" : ""}{profitLossPercent}%
                        </Text>
                      </View>
                    </View>
                  </View>
                  {currentStrategy && currentStrategy.status !== "active" && (
                    <TouchableOpacity 
                      style={[
                        styles.sellPositionButton, 
                        { backgroundColor: STATUS_COLORS.stopped.bg },
                        actionLoading === `sell-${item.symbol}` && styles.disabledButton
                      ]} 
                      onPress={() => sellPosition(item.symbol)}
                      disabled={actionLoading !== null}
                    >
                      {actionLoading === `sell-${item.symbol}` ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <>
                          <Ionicons name="cash-outline" size={14} color="white" style={styles.sellIcon} />
                          <Text style={styles.sellPositionText}>SELL</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
          />
        </View>
      </View>
    );
  };

  if (isLoading && !isRefreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196f3" />
        <Text style={styles.loadingText}>Loading trading data...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={["#2196f3"]}
          tintColor="#2196f3"
        />
      }
    >
      <View style={styles.header}>
        <Ionicons name="trending-up" size={28} color="#333" style={styles.headerIcon} />
        <Text style={styles.headerTitle}>Auto Trading</Text>
      </View>
      
      {currentStrategy && renderStrategyDetails()}
      {positions.length > 0 && renderPositions()}
      {!currentStrategy || currentStrategy.status === "closed" ? renderNewStrategyForm() : null}
      {renderAutoInvestments()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9DDE0",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  card: {
    backgroundColor: "#D6EBFF",
    borderRadius: 8,
    margin: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitleIcon: {
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardContent: {
    padding: 12,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 4,
  },
  strategyHeader: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  strategyNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  strategyIcon: {
    marginRight: 4,
  },
  strategyName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  strategyDescription: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  statusIcon: {
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    padding: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 4,
  },
  actionIcon: {
    marginRight: 4,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    padding: 8,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 4,
  },
  warningText: {
    color: "#ff9800",
    fontSize: 12,
    marginLeft: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  strategySelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  strategyCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    flex: 1,
    maxWidth: "32%",
  },
  smallStrategyCard: {
    maxWidth: "100%",
  },
  strategyCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  strategyCardIcon: {
    marginRight: 8,
  },
  strategyCardTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  strategyCardDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  strategyMetrics: {
    marginTop: 8,
  },
  metricItem: {
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 10,
    color: "#999",
  },
  metricValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
  selectedIndicator: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    right: 8,
    top: 8,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  selectedText: {
    color: "white",
    fontSize: 8,
    fontWeight: "bold",
    marginLeft: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    height: 44,
  },
  dollarSignContainer: {
    paddingHorizontal: 12,
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
    height: "100%",
  },
  dollarSign: {
    fontSize: 16,
    color: "#666",
  },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#333",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: 4,
  },
  submitIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyStateContainer: {
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  investmentItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
  },
  investmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  investmentHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  strategyTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
    borderWidth: 1,
  },
  tagIcon: {
    marginRight: 2,
  },
  strategyTagText: {
    fontSize: 10,
    fontWeight: "500",
  },
  symbolText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  investmentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  investmentMetric: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  metricIcon: {
    marginRight: 4,
  },
  investmentText: {
    fontSize: 12,
    color: "#666",
  },
  positionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
  },
  positionInfo: {
    flex: 1,
  },
  positionDetails: {
    marginTop: 4,
  },
  positionMetric: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  positionText: {
    fontSize: 12,
    color: "#666",
  },
  valueText: {
    fontSize: 12,
    color: "#666",
  },
  profitLossContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  profitLossText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  sellPositionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  sellIcon: {
    marginRight: 4,
  },
  sellPositionText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default AutoTrade;