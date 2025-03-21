import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Picker, Button, Switch, FlatList } from "react-native";

const AutoTrade = () => {
  const [selectedStock, setSelectedStock] = useState(""); // Stock selection
  const [condition, setCondition] = useState("<"); // Rule condition (>, <, =)
  const [price, setPrice] = useState(""); // Target price
  const [tradeAction, setTradeAction] = useState("Buy"); // Buy/Sell
  const [quantity, setQuantity] = useState(""); // Shares to trade
  const [rules, setRules] = useState([]); // List of active rules

  const addRule = () => {
    if (selectedStock && price && quantity) {
      const newRule = {
        id: Date.now(),
        stock: selectedStock,
        condition,
        price,
        action: tradeAction,
        quantity,
        enabled: true,
      };
      setRules([...rules, newRule]);
      setPrice(""); // Reset input fields
      setQuantity("");
    }
  };

  const toggleRule = (id) => {
    setRules(
      rules.map((rule) =>
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Auto Trade</Text>
      
      {/* Stock Selection */}
      <Text style={styles.label}>Select Stock:</Text>
      <Picker
        selectedValue={selectedStock}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedStock(itemValue)}
      >
        <Picker.Item label="Select a stock..." value="" />
        <Picker.Item label="Tesla (TSLA)" value="TSLA" />
        <Picker.Item label="Apple (AAPL)" value="AAPL" />
        <Picker.Item label="Amazon (AMZN)" value="AMZN" />
      </Picker>

      {/* Rule Setup */}
      <Text style={styles.label}>Set Rule:</Text>
      <View style={styles.ruleContainer}>
        <Text>[ IF ]</Text>
        <Text>{selectedStock || "Stock"}</Text>
        <Picker
          selectedValue={condition}
          style={styles.smallPicker}
          onValueChange={(itemValue) => setCondition(itemValue)}
        >
          <Picker.Item label="<" value="<" />
          <Picker.Item label=">" value=">" />
          <Picker.Item label="=" value="=" />
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Price"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
      </View>

      <View style={styles.ruleContainer}>
        <Text>[ THEN ]</Text>
        <Picker
          selectedValue={tradeAction}
          style={styles.smallPicker}
          onValueChange={(itemValue) => setTradeAction(itemValue)}
        >
          <Picker.Item label="Buy" value="Buy" />
          <Picker.Item label="Sell" value="Sell" />
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />
      </View>

      <Button title="Add Rule" onPress={addRule} />

      {/* Active Rules List */}
      <Text style={styles.label}>Active Rules:</Text>
      <FlatList
        data={rules}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.ruleItem}>
            <Text>
              {item.stock} {item.condition} {item.price} → {item.action} {item.quantity}
            </Text>
            <Switch
              value={item.enabled}
              onValueChange={() => toggleRule(item.id)}
            />
          </View>
        )}
      />
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
  smallPicker: {
    height: 40,
    width: 80,
    backgroundColor: "white",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    backgroundColor: "white",
    flex: 1,
    paddingHorizontal: 10,
    marginLeft: 5,
  },
  ruleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ruleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "white",
    marginTop: 5,
  },
});

export default AutoTrade;
