import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";


const TradingScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);


  return (
    <View style={{ flex: 1, padding: 4, backgroundColor: "gray-100" }}>
      {/* Search Bar */}
      <TextInput 
        style={{ padding: 3, backgroundColor: "white", borderRadius: 4, shadowColor: "black", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 }}
        placeholder="Search stocks..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        
      />

      {/* Dashboard */}
      <View style={{ marginTop: 4, backgroundColor: "white", padding: 4, borderRadius: 8, shadowColor: "black", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 2 }}>Market Dashboard</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList 
            data={dashboardData}
            keyExtractor={(item) => item.symbol}
            renderItem={({ item }) => (
              <View style={{ padding: 2, borderBottomWidth: 1, borderBottomColor: "gray" }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.shortName} ({item.symbol})</Text>
                <Text style={{ color: "green", fontSize: 16 }}>{`$${item.regularMarketPrice}`}</Text>
              </View>
            )}
          />
        )}
      </View>
      
      {/* Bottom Buttons */}
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", justifyContent: "space-around", backgroundColor: "white", paddingVertical: 4, shadowColor: "black", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 }}>
        <TouchableOpacity style={{ padding: 12, backgroundColor: "#F08080", borderRadius: 8 }} onPress={() => navigation.navigate("Portfolio")}> 
          <Text style={{ color: "white" }}>User Portfolio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 12, backgroundColor: "#F08080", borderRadius: 8 }} onPress={() => navigation.navigate("TransactionHistory")}> 
          <Text style={{ color: "white" }}>View Transactions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 12, backgroundColor: "#F08080", borderRadius: 8 }} onPress={() => navigation.navigate("AutoTrade")}> 
          <Text style={{ color: "white" }}>Auto Trade</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 12, backgroundColor: "#F08080", borderRadius: 8 }} onPress={() => navigation.navigate("ManualTrade")}> 
          <Text style={{ color: "white" }}>Manual Trade</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TradingScreen;
