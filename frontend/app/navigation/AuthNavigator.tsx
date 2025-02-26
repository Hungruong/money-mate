import { createStackNavigator } from "@react-navigation/stack";
import SignInScreen from "../screens/Auth/SignIn";
import SignUpScreen from "../screens/Auth/SignUp";
import { AuthStackParamList } from "../types/navigation";
import  GroupCreate from '../screens/Auth/SignIn/groupCreate';


type RootStackParamList = {
  GroupCreate:undefined;
  SignUp:undefined;
  SignIn:undefined;
};
const Stack = createStackNavigator<RootStackParamList>();
const AuthNavigator=()=> {
  return (
    <Stack.Navigator initialRouteName="SignIn" >
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="GroupCreate" component={GroupCreate} />
    </Stack.Navigator>
  );
}

export default AuthNavigator