import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

// Hardcoded userId
const USER_ID = "a2b0d0ab-951d-437f-81f7-c228e1d727f2";
const BASE_URL = "http://localhost:8086/api/autotrading"; // Replace with IP if on emulator/device

// Strategy definitions
const STRATEGIES = [
  { name: "Conservative", value: "conservative", targetReturn: "15%", maxDuration: "30 days" },
  { name: "Moderate", value: "moderate", targetReturn: "20%", maxDuration: "10 days" },
  { name: "Aggressive", value: "aggressive", targetReturn: "25%", maxDuration: "5 days" },
];

const AutoTrade = () => {
  const [selectedStrategy, setSelectedStrategy] = useState("");
  const [capital, setCapital] = useState("");
  const [currentStrategy, setCurrentStrategy] = useState<{ status: string; capital: number; startDate: string } | null>(null);
  const [positions, setPositions] = useState<any[]>([]);
  const [autoInvestments, setAutoInvestments] = useState<any[]>([]);

  useEffect(() => {
    fetchCurrentStrategy();
    fetchAutoInvestments();
  }, []);

  const fetchCurrentStrategy = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/current/${USER_ID}`);
      console.log("Fetch Current Strategy Response:", response.data);
      setCurrentStrategy(response.data);
      setPositions(response.data.positions || []);
    } catch (error: any) {
      console.log("Error fetching current strategy:", error.message);
      if (error.response) {
        console.log("Response data:", error.response.data);
        console.log("Response status:", error.response.status);
      }
    }
  };

  const fetchAutoInvestments = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/investments/${USER_ID}`);
      console.log("Fetch Auto Investments Response:", response.data);
      const autoInvs = response.data.filter((inv: any) => inv.type === "auto");
      setAutoInvestments(autoInvs);
    } catch (error: any) {
      console.log("Error fetching auto investments:", error.message);
      if (error.response) {
        console.log("Response data:", error.response.data);
        console.log("Response status:", error.response.status);
      }
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
      fetchAutoInvestments();
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
      Alert.alert("Error", "Failed to pause strategy.");
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
      Alert.alert("Error", "Failed to stop strategy.");
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
      Alert.alert("Error", "Failed to resume strategy.");
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
      Alert.alert("Error", "Failed to close strategy.");
    }
  };

  const sellPosition = async (symbol: string) => {
    try {
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
    }
  };

  const renderStrategyDetails = () => {
    if (!currentStrategy) return null;

    const strategyInfo = STRATEGIES.find((s) => s.value === (currentStrategy as { status: string; capital: number; startDate: string; strategy: string }).strategy);
    return (
      <View style={styles.strategyDetails}>
        <Text style={styles.label}>Current Strategy: {strategyInfo?.name}</Text>
        <Text>Status: {currentStrategy.status.toUpperCase()}</Text>
        <Text>Capital Allocated: ${currentStrategy.capital}</Text>
        <Text>Target Return: {strategyInfo?.targetReturn}</Text>
        <Text>Max Duration: {strategyInfo?.maxDuration}</Text>
        <Text>Start Date: {new Date(currentStrategy.startDate).toLocaleDateString()}</Text>

        {currentStrategy.status === "active" && (
          <View style={styles.buttonRow}>
            <Button title="Pause" onPress={pauseStrategy} />
            <Button title="Stop" onPress={stopStrategy} />
          </View>
        )}
        {currentStrategy.status === "paused" && (
          <View style={styles.buttonRow}>
            <Button title="Resume" onPress={resumeStrategy} />
            <Button title="Stop" onPress={stopStrategy} />
          </View>
        )}
        {currentStrategy.status === "stopped" && (
          <View style={styles.buttonRow}>
            <Button
              title="Sell All & Close"
              onPress={() => positions.forEach((p) => sellPosition(p.symbol))}
            />
            <Button title="Close" onPress={closeStrategy} />
          </View>
        )}
      </View>
    );
  };

  const renderAutoInvestments = () => {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current Auto Investments</Text>
        {autoInvestments.length === 0 ? (
          <Text style={styles.cardText}>No current auto investments.</Text>
        ) : (
          <FlatList
            data={autoInvestments}
            keyExtractor={(item) => item.investmentId}
            renderItem={({ item }) => (
              <View style={styles.cardItem}>
                <Text style={styles.cardText}>
                  Stock: {item.symbol} | Type: {item.type} | Strategy: {item.strategy}
                </Text>
                <Text style={styles.cardText}>
                  Status: {item.status} | Bought: {item.totalBoughtQuantity} | Sold: {item.totalSoldQuantity}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Auto Trading System</Text>

      {!currentStrategy || currentStrategy.status === "closed" ? (
        <View>
          <Text style={styles.label}>Select Strategy:</Text>
          <Picker
            selectedValue={selectedStrategy}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedStrategy(itemValue)}
          >
            <Picker.Item label="Select a strategy..." value="" />
            {STRATEGIES.map((strategy) => (
              <Picker.Item key={strategy.value} label={strategy.name} value={strategy.value} />
            ))}
          </Picker>

          <Text style={styles.label}>Capital Allocation ($):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={capital}
            onChangeText={setCapital}
          />

          <Button title="Start Strategy" onPress={startStrategy} />
          {renderAutoInvestments()}
        </View>
      ) : null}

      {renderStrategyDetails()}

      {positions.length > 0 && (
        <>
          <Text style={styles.label}>Current Positions:</Text>
          <FlatList
            data={positions}
            keyExtractor={(item) => item.symbol}
            renderItem={({ item }) => (
              <View style={styles.positionItem}>
                <Text>
                  {item.symbol} - {item.currentQuantity} shares @ ${item.averagePrice} (Value: $
                  {item.currentValue})
                </Text>
                {currentStrategy && currentStrategy.status !== "active" && (
                  <Button title="Sell" onPress={() => sellPosition(item.symbol)} />
                )}
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5d0fe",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: "bold",
  },
  picker: {
    height: 40,
    backgroundColor: "white",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    backgroundColor: "white",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  strategyDetails: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  positionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    marginTop: 5,
    borderRadius: 5,
  },
  card: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  cardText: {
    fontSize: 14,
    color: "#666",
  },
  cardItem: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});

export default AutoTrade;