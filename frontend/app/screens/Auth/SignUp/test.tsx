import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigationProp } from "../../../types/navigation";

export default function SignUpScreen() {
  const navigation = useNavigation<AuthNavigationProp>();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Sign Up</Text>
      <Button title="Go to Sign In" onPress={() => navigation.navigate("SignIn")} />
      <Button title="Sign Up" onPress={() => console.log("Handle Sign Up")} />
    </View>
  );
}