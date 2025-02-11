import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import ProfileScreen from '../screens/profile/Profile';
import EditProfileScreen from '../screens/profile/EditProfile';

type RootStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
};


const Stack = createStackNavigator<RootStackParamList>();


const AppNavigator = () => {
 return (
     <Stack.Navigator>
       <Stack.Screen name="Profile" component={ProfileScreen} />
       <Stack.Screen name="EditProfile" component={EditProfileScreen} />
     </Stack.Navigator>

 );
};

export default AppNavigator;