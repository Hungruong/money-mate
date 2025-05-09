import React, { useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthNavigator from "./navigation/AuthNavigator";
import BottomTabNavigator from "./navigation/BottomTabNavigator";


import { UserProvider } from "./screens/Auth/UserContext"; // Import the UserProvider
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
    <UserProvider>

    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Main" component={RootNavigator} options={{ headerShown: false }} />
      </RootStack.Navigator>

    </NavigationContainer>
    </UserProvider>
  );
}

