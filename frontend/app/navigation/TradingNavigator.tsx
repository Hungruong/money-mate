import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TradingScreen from "../screens/trading/Trading";
import Portfolio from "../screens/trading/Portfolio";
import TransactionHistory from "../screens/trading/TransactionHistory"; 
import AutoTrade from "../screens/trading/AutoTrade";
import ManualTrade from "../screens/trading/ManualTrade";
import ConfirmOrder from "../screens/trading/ManualTrade/ConfirmOrder";
import ExecuteTrade from "../screens/trading/ManualTrade/ExecuteTrade";

const Stack = createStackNavigator();

const TradingNavigator = () => {
  return (
      <Stack.Navigator initialRouteName="Trading">
        <Stack.Screen name="Trading" component={TradingScreen} />
        <Stack.Screen name="Portfolio" component={Portfolio} />
        <Stack.Screen name="TransactionHistory" component={TransactionHistory} />
        <Stack.Screen name="AutoTrade" component={AutoTrade} />
        <Stack.Screen name="ManualTrade" component={ManualTrade} />
        <Stack.Screen name="ConfirmOrder" component={ConfirmOrder} />
        <Stack.Screen name="ExecuteTrade" component={ExecuteTrade} />
      </Stack.Navigator>

  );
};

export default TradingNavigator;
