import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {createAppContainer} from 'react-navigation'; 
import { createStackNavigator } from "@react-navigation/stack";
import AuthNavigator from "./navigation/AuthNavigator";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import UserProfileNavigator from "./navigation/UserProfileNavigator"; 
import EditProfileScreen from "./screens/profile/EditProfile";
import ChangePassword from "./screens/profile/ChangePassword";


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