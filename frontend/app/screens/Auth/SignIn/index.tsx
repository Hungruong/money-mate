import React, { useCallback } from "react";
import { 
  View, 
  Text, 
  Button, 
  TextInput, 
  Image, 
  ImageBackground, 
  StyleSheet, 
  Linking, 
  StatusBar, 
  TouchableOpacity 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigationProp } from "../../../types/navigation";


export default function SignInScreen({ setIsAuthenticated }: { setIsAuthenticated: (value: boolean) => void }) {
  const navigation = useNavigation<AuthNavigationProp>();

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="black" barStyle="dark-content" />

      <ImageBackground style={styles.background} source={require('@/assets/images/background5.png')}>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>Hi! Welcome back</Text>

        {/* Email Input */}
        <Text style={styles.textLabel}>Email</Text>
        <TextInput style={styles.inputTextbox} placeholder="  Please enter your email" />

        {/* Password Input */}
        <Text style={styles.textLabel}>Password</Text>
        <TextInput style={styles.inputTextbox} placeholder="  Please enter your password" secureTextEntry />

        {/* Forgot Password */}
        <Text style={styles.forgotPasswordText} onPress={() => Linking.openURL('YOUR_FORGOT_PASSWORD_LINK')}>
          Forgot Password?
        </Text>

        {/* Sign In Button */}
        <TouchableOpacity style={styles.button} onPress={() => setIsAuthenticated(true)}>
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
          <Button title="Sign Up" onPress={() => navigation.navigate("SignUp")} color="#91337b" />
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
    height: "100%",
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
    width: 370,
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


