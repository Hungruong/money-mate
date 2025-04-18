import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Image, 
  ImageBackground, 
  StatusBar, 
  TouchableOpacity, 
  Alert, 
  StyleSheet 
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { AuthNavigationProp } from "../../../types/navigation";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8087";

export default function SignUpScreen() {
  const navigation = useNavigation<AuthNavigationProp>();

  // State for form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setuserName] = useState("");

  const handleSignUp = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
        firstName,
        lastName,
        email,
        password,
        userName,
      });

      // Handle successful registration
      Alert.alert("Registration Successful", "You can now log in.");
      navigation.navigate("SignIn");
    } catch (error: any) {
      // Handle registration failure
      if (error.response) {
        Alert.alert("Registration Failed", error.response.data || "Something went wrong.");
      } else if (error.request) {
        Alert.alert("Error", "No response from server. Please try again.");
      } else {
        Alert.alert("Error", "An unexpected error occurred.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="dark-content" />
      <ImageBackground style={styles.background} source={require('@/assets/images/background5.png')}>
        
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>Let's create your own account</Text>

        {/* Input Fields */}
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your last name"
          value={lastName}
          onChangeText={setLastName}
        />
        <Text style={styles.label}>User Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your last name"
          value={userName}
          onChangeText={setuserName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
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
          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Text style={[styles.signInText, { color: "#91337b", textDecorationLine: "underline" }]}>Sign In</Text>
          </TouchableOpacity>
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