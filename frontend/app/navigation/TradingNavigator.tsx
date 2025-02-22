import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TradingScreen from "../screens/trading/Trading";
import Portfolio from "../screens/trading/Portfolio";
import TransactionHistory from "../screens/trading/TransactionHistory"; 
import AutoTrade from "../screens/trading/AutoTrade";
import ManualTrade from "../screens/trading/ManualTrade";


const Stack = createStackNavigator();

const TradingNavigator = () => {
  return (
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Trading" component={TradingScreen} />
        <Stack.Screen name="Portfolio" component={Portfolio} />
        <Stack.Screen name="TransactionHistory" component={TransactionHistory} />
        <Stack.Screen name="AutoTrade" component={AutoTrade} />
        <Stack.Screen name="ManualTrade" component={ManualTrade} />
      </Stack.Navigator>

  );
};

export default TradingNavigator;
