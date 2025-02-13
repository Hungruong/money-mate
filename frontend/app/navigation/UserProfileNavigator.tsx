import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import ProfileScreen from '../screens/profile/Profile';
import EditProfileScreen from '../screens/profile/EditProfile';
import HomeScreen from '../screens/home';
import TradingScreen from '../screens/trading';
import GroupSavingScreen from '../screens/GroupSaving';
import BillSplitScreen from '../screens/BillSplit';
import SignInScreen from '../screens/Auth/SignIn';

type RootStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Trading: undefined;
  Billsplit: undefined;
  GroupSaving: undefined;
  HomeScreen: undefined;

  
};


const Stack = createStackNavigator<RootStackParamList>();


const AppNavigator = () => {
 return (
     <Stack.Navigator>
       <Stack.Screen name="Profile" component={ProfileScreen} />
       <Stack.Screen name="EditProfile" component={EditProfileScreen} />
       <Stack.Screen name="Trading" component={TradingScreen} />
       <Stack.Screen name="Billsplit" component={BillSplitScreen} />
       <Stack.Screen name="GroupSaving" component={GroupSavingScreen} />
       <Stack.Screen name="HomeScreen" component={HomeScreen} />
       
     </Stack.Navigator>

 );
};

export default AppNavigator;