import { createStackNavigator } from "@react-navigation/stack";
import SignInScreen from "../screens/Auth/SignIn";
import SignUpScreen from "../screens/Auth/SignUp";
import { AuthStackParamList } from "../types/navigation";

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthNavigator({ setIsAuthenticated }: { setIsAuthenticated: (value: boolean) => void }) {
  return (
    <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn">
        {(props) => <SignInScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}