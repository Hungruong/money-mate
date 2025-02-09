import { StackNavigationProp } from "@react-navigation/stack";

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Trading: undefined;
  "Group Saving": undefined;
  "Bill Split": undefined;
  Profile: undefined;
};

export type AuthNavigationProp = StackNavigationProp<AuthStackParamList>;

export default {};