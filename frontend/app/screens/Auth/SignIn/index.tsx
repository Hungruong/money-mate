import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigationProp } from "../../../types/navigation";

export default function SignInScreen({ setIsAuthenticated }: { setIsAuthenticated: (value: boolean) => void }) {
  const navigation = useNavigation<AuthNavigationProp>();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Sign In</Text>
      <Button title="Go to Sign Up" onPress={() => navigation.navigate("SignUp")} />
      <Button title="Sign In" onPress={() => setIsAuthenticated(true)} />
    </View>
  );
}