import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Image, 
  ImageBackground, 
  StyleSheet, 
  Linking, 
  StatusBar, 
  TouchableOpacity, 
  Alert 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthNavigationProp } from "../../../types/navigation";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8087";

export default function SignInScreen({ setIsAuthenticated }: { setIsAuthenticated: (value: boolean) => void }) {
  const navigation = useNavigation<AuthNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signin`, {
        email,
        password,
      });

      // Handle successful login
      const { token, userName } = response.data;
      Alert.alert("Login Successful", `Welcome, ${userName}!`);

      // Store the token securely
      await AsyncStorage.setItem("authToken", token);

      // Set authentication state and navigate to the next screen
      setIsAuthenticated(true);
      navigation.navigate("Home");
    } catch (error: any) {
      // Handle login failure
      if (error.response) {
        if (error.response.status === 401) {
          Alert.alert("Login Failed", "Invalid email or password.");
        } else {
          Alert.alert("Error", `Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        Alert.alert("Error", "No response from server. Please try again.");
      } else {
        Alert.alert("Error", "An unexpected error occurred.");
      }
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="black" barStyle="dark-content" />

      <ImageBackground style={styles.background} source={require('@/assets/images/background5.png')}>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>Hi! Welcome back</Text>

        {/* Email Input */}
        <Text style={styles.textLabel}>Email</Text>
        <TextInput
          style={styles.inputTextbox}
          placeholder="Please enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Password Input */}
        <Text style={styles.textLabel}>Password</Text>
        <TextInput
          style={styles.inputTextbox}
          placeholder="Please enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Forgot Password */}
        <Text style={styles.forgotPasswordText} onPress={() => Linking.openURL('YOUR_FORGOT_PASSWORD_LINK')}>
          Forgot Password?
        </Text>

        {/* Sign In Button */}
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>SIGN IN</Text>
        </TouchableOpacity>

        {/* Alternative Sign In */}
        <Text style={styles.text}>Or sign in with</Text>
        <TouchableOpacity onPress={() => console.log("Handle Google Sign In")}>
          <Image source={require("@/assets/images/google_logo.jpg")} style={styles.logo} />
        </TouchableOpacity>

        {/* Sign Up Section */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={[styles.signUpText, { color: "#91337b", textDecorationLine: "underline" }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  root: {
    flex: 1, 
    alignContent: "center",
  },
  background: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  title: {
    textAlign: "center", 
    fontSize: 30,
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 10,
    textAlign: "center", 
    fontSize: 20, 
    color: "grey",
    marginBottom: 30,
  },
  textLabel: {
    marginTop: 20,
    fontSize: 20,
    left: 10,
  },
  inputTextbox: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    color: "grey",
    borderRadius: 10,
    paddingLeft: 10,
  },
  forgotPasswordText: {
    color: "#91337b", 
    textAlign: "right",
    marginTop: 10,
    right: 10,
    fontSize: 15,
    textDecorationLine: "underline",
  },
  button: {
    marginTop: 30,
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
  text: {
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
  signUpContainer: {
    flexDirection: "row", 
    alignItems: "center", 
    alignSelf: "center", 
    marginTop: 30,
  },
  signUpText: {
    fontSize: 18,
    marginRight: 10,
  },
});