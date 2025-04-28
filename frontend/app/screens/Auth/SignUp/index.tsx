import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Image, 
  ImageBackground, 
  StatusBar, 
  TouchableOpacity, 
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { AuthNavigationProp } from "../../../types/navigation";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8087";
const screenWidth = Dimensions.get('window').width;

export default function SignUpScreen() {
  const navigation = useNavigation<AuthNavigationProp>();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const updateFormField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { firstName, lastName, userName, email, password } = formData;
    if (!firstName.trim() || !lastName.trim() || !userName.trim() || 
        !email.trim() || !password.trim()) {
      window.alert("Missing Information: Please fill in all fields");
      return false;
    }
    if (password.length < 6) {
      window.alert("Password Too Short: Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, formData);
      window.alert("Account created successfully! Please sign in.");
      navigation.navigate("SignIn");
    } catch (error: any) {
      const errorMessage = error.response?.data || "Failed to create account";
      window.alert(`Registration Failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
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
                <Text style={styles.title}>Create Account</Text>
              </View>

              <View style={styles.formCard}>
                <View style={styles.rowContainer}>
                  {/* First Name Input */}
                  <View style={styles.halfInput}>
                    <Text style={styles.inputLabel}>First Name</Text>
                    <View style={[
                      styles.inputContainer,
                      focusedInput === 'firstName' && styles.inputContainerFocused
                    ]}>
                      <TextInput
                        style={styles.input}
                        placeholder="First name"
                        placeholderTextColor="#A0A0A0"
                        value={formData.firstName}
                        onChangeText={(value) => updateFormField('firstName', value)}
                        onFocus={() => setFocusedInput('firstName')}
                        onBlur={() => setFocusedInput(null)}
                        autoCapitalize="words"
                      />
                    </View>
                  </View>

                  {/* Last Name Input */}
                  <View style={styles.halfInput}>
                    <Text style={styles.inputLabel}>Last Name</Text>
                    <View style={[
                      styles.inputContainer,
                      focusedInput === 'lastName' && styles.inputContainerFocused
                    ]}>
                      <TextInput
                        style={styles.input}
                        placeholder="Last name"
                        placeholderTextColor="#A0A0A0"
                        value={formData.lastName}
                        onChangeText={(value) => updateFormField('lastName', value)}
                        onFocus={() => setFocusedInput('lastName')}
                        onBlur={() => setFocusedInput(null)}
                        autoCapitalize="words"
                      />
                    </View>
                  </View>
                </View>

                {/* Username Input */}
                <Text style={styles.inputLabel}>Username</Text>
                <View style={[
                  styles.inputContainer,
                  focusedInput === 'userName' && styles.inputContainerFocused
                ]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Choose a username"
                    placeholderTextColor="#A0A0A0"
                    value={formData.userName}
                    onChangeText={(value) => updateFormField('userName', value)}
                    onFocus={() => setFocusedInput('userName')}
                    onBlur={() => setFocusedInput(null)}
                    autoCapitalize="none"
                  />
                </View>

                {/* Email Input */}
                <Text style={styles.inputLabel}>Email</Text>
                <View style={[
                  styles.inputContainer,
                  focusedInput === 'email' && styles.inputContainerFocused
                ]}>
                  <TextInput
                    style={styles.input}
                    placeholder="your.email@example.com"
                    placeholderTextColor="#A0A0A0"
                    value={formData.email}
                    onChangeText={(value) => updateFormField('email', value)}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                {/* Password Input */}
                <Text style={styles.inputLabel}>Password (min 6 characters)</Text>
                <View style={[
                  styles.inputContainer,
                  focusedInput === 'password' && styles.inputContainerFocused
                ]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Create a password"
                    placeholderTextColor="#A0A0A0"
                    value={formData.password}
                    onChangeText={(value) => updateFormField('password', value)}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>

                {/* Sign Up Button */}
                <TouchableOpacity 
                  style={styles.signUpButton} 
                  onPress={handleSignUp}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.signUpButtonText}>CREATE ACCOUNT</Text>
                  )}
                </TouchableOpacity>

                {/* Google Sign Up */}
                <View style={styles.googleContainer}>
                  <View style={styles.divider} />
                  <TouchableOpacity style={styles.googleButton}>
                    <Image 
                      source={require("@/assets/images/google_logo.jpg")} 
                      style={styles.googleIcon} 
                    />
                  </TouchableOpacity>
                  <View style={styles.divider} />
                </View>
              </View>
              
              {/* Sign In Section */}
              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
                  <Text style={styles.signInText}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// (Your styles remain unchanged, so I skipped copying them here)


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
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: screenWidth * 0.88,
    maxWidth: 360,
    alignItems: "center",
  },
  headerContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333333",
    textAlign: "center",
  },
  formCard: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
    marginLeft: 4,
  },
  inputContainer: {
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    marginBottom: 10,
    height: 40,
  },
  inputContainerFocused: {
    borderColor: "#91337B",
    borderWidth: 1.5,
  },
  input: {
    height: 40,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#333333",
  },
  signUpButton: {
    backgroundColor: "#91337B",
    borderRadius: 8,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  googleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#EEEEEE",
  },
  googleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
  signInText: {
    color: "#91337B",
    fontSize: 16,
    fontWeight: "600",
  }
});