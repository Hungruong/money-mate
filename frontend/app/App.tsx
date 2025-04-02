import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthNavigator from "./navigation/AuthNavigator";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import GroupSavingNavigator from "./navigation/GroupSavingNavigator"; // Import the correct navigator
import BillSplitNavigator from "./navigation/BillSplitNavigator"; // Import the correct navigator

const RootStack = createStackNavigator();

function RootNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AuthNavigator setIsAuthenticated={setIsAuthenticated} />;
  }

  return <BottomTabNavigator />;
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Main"
          component={RootNavigator}
          options={{ headerShown: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
