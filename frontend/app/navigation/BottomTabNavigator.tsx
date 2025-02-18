import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/home";
import TradingScreen from "../screens/trading";
import GroupSavingScreen from "../screens/GroupSaving";
import BillSplitScreen from "../screens/BillSplit";
import AppNavigator from "./UserProfileNavigator";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: "#ffffff", height: 60 },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: "home",
            Trading: "swap-horizontal",
            "Group Saving": "people",
            "Bill Split": "receipt",
            Profile: "person",
          };

          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Trading" component={TradingScreen} />
      <Tab.Screen name="Group Saving" component={GroupSavingScreen} />
      <Tab.Screen name="Bill Split" component={BillSplitScreen} />
      <Tab.Screen name="Profile" component={AppNavigator} />
    </Tab.Navigator>
  );
}