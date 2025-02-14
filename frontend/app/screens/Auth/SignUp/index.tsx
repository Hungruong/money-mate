import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  Image, 
  ImageBackground, 
  StatusBar, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { AuthNavigationProp } from "../../../types/navigation";

export default function SignUpScreen() {
  const navigation = useNavigation<AuthNavigationProp>();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="dark-content" />
      <ImageBackground style={styles.background} source={require('@/assets/images/background5.png')}>
        
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>Let's create your own account</Text>

        {/* Input Fields */}
        {["First Name", "Last Name", "Email", "Password"].map((label, index) => (
          <View key={index}>
            <Text style={styles.label}>{label}</Text>
            <TextInput style={styles.input} placeholder={`Enter your ${label.toLowerCase()}`} secureTextEntry={label === "Password"} />
          </View>
        ))}

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.button} onPress={() => console.log("Handle Sign Up")}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>

        {/* Alternative Sign Up */}
        <Text style={styles.orText}>Or sign up with</Text>
        <TouchableOpacity onPress={() => console.log("Handle Google Sign Up")}>
          <Image source={require("@/assets/images/google_logo.jpg")} style={styles.logo} />
        </TouchableOpacity>

        {/* Sign In Navigation */}
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account?</Text>
          <Button title="Sign In" onPress={() => navigation.navigate("SignIn")} color="#91337b" />
        </View>
        
      </ImageBackground>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 10,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 20,
    color: "grey",
    marginVertical: 15,
  },
  label: {
    fontSize: 18,
    marginLeft: 10,
    marginTop: 15,
  },
  input: {
    height: 40,
    width: 370,
    margin: 10,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    color: "grey",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#91337b",
    padding: 15,
    borderRadius: 10,
    width: 370,
    alignSelf: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  orText: {
    textAlign: "center",
    fontSize: 18,
    marginVertical: 15,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignSelf: "center",
  },
  signInContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  signInText: {
    fontSize: 18,
    marginRight: 10,
  },
});
