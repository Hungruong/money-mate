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
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthNavigationProp } from "../../../types/navigation";
import { useUser } from "../UserContext";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8087";
const screenWidth = Dimensions.get('window').width;

export default function SignInScreen({ setIsAuthenticated }: { setIsAuthenticated: (value: boolean) => void }) {
  const navigation = useNavigation<AuthNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { setUserId } = useUser();

  const handleSignIn = async () => {
    if (!email.trim()) {
      window.alert("Email Required: Please enter your email address");
      return;
    }
    
    if (!password.trim()) {
      window.alert("Password Required: Please enter your password");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signin`, {
        email,
        password,
      });

      const { token, userName, userId } = response.data;
      setUserId(userId);

      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("userId", userId);

      setIsAuthenticated(true);
      window.alert(`Welcome Back! Hello, ${userName}!`);
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          window.alert("Authentication Failed: The email or password you entered is incorrect.");
        } else {
          window.alert("Server Error: We're having trouble connecting to our servers. Please try again later.");
        }
      } else if (error.request) {
        window.alert("Connection Error: Unable to reach our servers. Please check your internet connection.");
      } else {
        window.alert("Sign In Error: Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign In pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidView}
      >
        <ImageBackground 
          style={styles.background} 
          source={require('@/assets/images/background5.png')}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <View style={styles.contentContainer}>
              <View style={styles.headerContainer}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to continue</Text>
              </View>

              <View style={styles.formCard}>
                {/* Email Input */}
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={[
                  styles.inputContainer,
                  emailFocused && styles.inputContainerFocused
                ]}>
                  <TextInput
                    style={styles.input}
                    placeholder="your.email@example.com"
                    placeholderTextColor="#A0A0A0"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                </View>

                {/* Password Input */}
                <Text style={styles.inputLabel}>Password</Text>
                <View style={[
                  styles.inputContainer,
                  passwordFocused && styles.inputContainerFocused
                ]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#A0A0A0"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                </View>

                {/* Forgot Password */}
                <TouchableOpacity 
                  style={styles.forgotPasswordContainer} 
                  onPress={() => Linking.openURL('YOUR_FORGOT_PASSWORD_LINK')}
                >
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                {/* Sign In Button */}
                <TouchableOpacity 
                  style={styles.signInButton} 
                  onPress={handleSignIn}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.signInButtonText}>SIGN IN</Text>
                  )}
                </TouchableOpacity>

                {/* Or Separator */}
                <View style={styles.orContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.orText}>OR</Text>
                  <View style={styles.divider} />
                </View>

                {/* Social Sign In */}
                <TouchableOpacity 
                  style={styles.googleButton}
                  onPress={handleGoogleSignIn}
                  activeOpacity={0.8}
                >
                  <Image 
                    source={require("@/assets/images/google_logo.jpg")} 
                    style={styles.googleIcon} 
                  />
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>
              </View>
              
              {/* Sign Up Section */}
              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                  <Text style={styles.signUpText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardAvoidView: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    width: screenWidth * 0.88,
    maxWidth: 360,
    alignItems: "center",
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333333",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
  formCard: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    marginBottom: 16,
    overflow: "hidden",
  },
  inputContainerFocused: {
    borderColor: "#91337B",
    borderWidth: 1.5,
    shadowColor: "#91337B",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333333",
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 24,
    marginRight: 4,
  },
  forgotPasswordText: {
    color: "#91337B",
    fontSize: 14,
    fontWeight: "600",
  },
  signInButton: {
    backgroundColor: "#91337B",
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#91337B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#EEEEEE",
  },
  orText: {
    color: "#999999",
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: "500",
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    borderRadius: 12,
  },
  googleButtonText: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "500",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  footerText: {
    color: "#666666",
    fontSize: 16,
    marginRight: 8,
  },
  signUpText: {
    color: "#91337B",
    fontSize: 16,
    fontWeight: "600",
  }
});