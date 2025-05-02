import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/profile/Profile';
import EditProfileScreen from '../screens/profile/EditProfile';
import ChangePassword from '../screens/profile/ChangePassword';
import HomeScreen from '../screens/home';
import StripePaymentForm from '../screens/profile/Payment';

type RootStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  Auth: undefined;
  HomeScreen: undefined;
  Payment: undefined; 
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
 return (
     <Stack.Navigator>
       <Stack.Screen name="Profile" component={ProfileScreen} />
       <Stack.Screen name="EditProfile" component={EditProfileScreen} />
       <Stack.Screen name="ChangePassword" component={ChangePassword} />
       <Stack.Screen name="HomeScreen" component={HomeScreen} /> 
       <Stack.Screen name="Payment" component={StripePaymentForm} />
     </Stack.Navigator>
 );
};

export default AppNavigator;