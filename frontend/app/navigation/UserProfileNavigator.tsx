import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/profile/Profile';
import EditProfileScreen from '../screens/profile/EditProfile';
import ChangePassword from '../screens/profile/ChangePassword';
import HomeScreen from '../screens/home';


type RootStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  Auth: undefined;
  HomeScreen: undefined; // Add the "HomeScreen" key to the type
  GroupCreate:undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
 return (
     <Stack.Navigator>
       <Stack.Screen name="Profile" component={ProfileScreen} />
       <Stack.Screen name="EditProfile" component={EditProfileScreen} />
       <Stack.Screen name="ChangePassword" component={ChangePassword} />
       <Stack.Screen name="HomeScreen" component={HomeScreen} /> 
      
     </Stack.Navigator>

 );
};

export default AppNavigator;