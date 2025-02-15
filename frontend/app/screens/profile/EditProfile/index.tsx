import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
  Alert,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const API_URL = "http://localhost:8082/api/users"; // Updated API URL

const EditProfileScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [originalData, setOriginalData] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    console.log("Fetching user data...");
    const fetchUserData = async () => {
      try {
        const userId = "ef3f965a-edb6-49ae-8247-b8aaf1b1d434"; // This is mock userId
        console.log("Using userId:", userId); 
        const response = await fetch(API_URL + "/" + userId);
        if (!response.ok) throw new Error("Failed to fetch user data");
        const fetchedData = await response.json();
        console.log("Fetched user data:", fetchedData); 

        setUserId(userId);
        setOriginalData(fetchedData);

        setUserName(fetchedData.userName || "");
        setFirstName(fetchedData.firstName || "");
        setLastName(fetchedData.lastName || "");
        setPhoneNumber(fetchedData.phoneNumber || "");
        setEmail(fetchedData.email || "");
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to load profile data. Please try again.");
      }
    };
    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    console.log("Handle Save Changes triggered");
    console.log("Current form data:", {
      userName,
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
    }); 
    const updatedData: any = {
      userName,
      firstName,
      lastName,
      phoneNumber,
      email,
    };

    // Only include password if the user has entered a new one
    if (password.trim() !== "") {
      updatedData.password = password;
      console.log("Including new password:", password); 
    }

    // Detect changes
    const changes = Object.fromEntries(
      Object.entries(updatedData).filter(
        ([key, value]) => value !== originalData[key]
      )
    );

    console.log("Detected changes:", changes); 

    if (Object.keys(changes).length === 0) {
      console.log("No changes detected, alerting user.");
      Alert.alert("Notice", "No changes detected.");
      return;
    }

    try {
      console.log("Sending update request with changes:", changes); 
      const userId = "ef3f965a-edb6-49ae-8247-b8aaf1b1d434";
      const response = await fetch(`${API_URL}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });

      if (response.ok) {
        console.log("Profile update success");
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        const errorText = await response.text();
        console.error("Update failed:", errorText);
        Alert.alert("Error", "Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "An error occurred while updating the profile.");
    }
  };

  return (
    <ImageBackground
      source={require("../../../../assets/images/image_background.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit Profile</Text>
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={require("../../../../assets/images/profile.webp")}
            />
            <TouchableOpacity style={styles.uploadButton}>
              <Ionicons name="add-circle" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={(text) => {
              console.log("UserName changed to:", text); 
              setUserName(text);
            }}
          />

          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={(text) => {
              console.log("FirstName changed to:", text); 
              setFirstName(text);
            }}
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={(text) => {
              console.log("LastName changed to:", text); 
              setLastName(text);
            }}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => {
              console.log("Email changed to:", text); 
              setEmail(text);
            }}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password (Leave blank if unchanged)</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={(text) => {
              console.log("Password changed to:", text); 
              setPassword(text);
            }}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  avatarContainer: {
    position: "relative",
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  uploadButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 2,
    elevation: 2,
  },
  formContainer: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: width * 0.04,
    borderWidth: 1,
    borderColor: "#CDB4DB",
  },
  saveButton: {
    backgroundColor: "#FFB347",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
    justifyContent: "center",
    width: "80%",
    marginTop: 20,
  },
  buttonText: {
    fontSize: width * 0.04,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default EditProfileScreen;