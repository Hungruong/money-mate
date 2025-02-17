import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthNavigator from "./navigation/AuthNavigator";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import UserProfileNavigator from "./navigation/UserProfileNavigator"; 
import EditProfileScreen from "./screens/profile/EditProfile";


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
      <RootNavigator />
    </NavigationContainer>
  );
}