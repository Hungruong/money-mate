import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

const API_URL = "http://localhost:8082/api/users"; // Backend API URL to update password

const ChangePassword: React.FC = () => {
 const [currentPassword, setCurrentPassword] = useState<string>("");
 const [newPassword, setNewPassword] = useState<string>("");
 const userID = "ef3f965a-edb6-49ae-8247-b8aaf1b1d434"; // this is for testing

 const handleSubmit = async () => {
   // Log the current state of passwords before submitting
   console.log("Submitting change with:", { currentPassword, newPassword });

   if (!currentPassword || !newPassword) {
     Alert.alert("Error", "Please fill in all fields.");
     return;
   }
   try {
     // Log the request payload
     console.log("Sending request with body:", {
       currentPassword,
       newPassword,
     });

     const response = await fetch(API_URL, {
       method: "POST", // POST request to update password
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         currentPassword,
         newPassword,
       }),
     });

     // Log the response from the server
     const data = await response.json();
     console.log("API Response:", data);

     if (response.ok) {
       Alert.alert("Success", "Password updated successfully!");
     } else {
       // Log backend errors if any
       Alert.alert("Error", data.message || "Failed to update password.");
     }
   } catch (error) {
     console.error("Error updating password:", error);
     Alert.alert("Error", "Something went wrong. Please try again later.");
   }
 };

 return (
   <View style={styles.container}>
     <Text style={styles.title}>Change Password</Text>

     <View style={styles.formContainer}>
       <Text style={styles.label}>Current Password</Text>
       <TextInput
         style={styles.input}
         placeholder="Enter current password"
         value={currentPassword}
         onChangeText={(text) => {
           console.log("Current Password input:", text);  // Log input change
           setCurrentPassword(text);
         }}
         secureTextEntry
       />

       <Text style={styles.label}>New Password</Text>
       <TextInput
         style={styles.input}
         placeholder="Enter new password"
         value={newPassword}
         onChangeText={(text) => {
           console.log("New Password input:", text);  // Log input change
           setNewPassword(text);
         }}
         secureTextEntry
       />

       <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
         <Text style={styles.buttonText}>Update Password</Text>
       </TouchableOpacity>
     </View>
   </View>
 );
};

const styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: "center",
   alignItems: "center",
   padding: 20,
   backgroundColor: "#f7f7f7",
 },
 title: {
   fontSize: 24,
   fontWeight: "bold",
   marginBottom: 20,
 },
 formContainer: {
   width: "100%",
   padding: 15,
   backgroundColor: "white",
   borderRadius: 8,
   shadowColor: "#000",
   shadowOpacity: 0.2,
   shadowRadius: 5,
   elevation: 5,
 },
 label: {
   fontSize: 16,
   fontWeight: "bold",
   marginBottom: 5,
 },
 input: {
   width: "100%",
   padding: 10,
   marginBottom: 15,
   borderRadius: 8,
   backgroundColor: "white",
   borderWidth: 1,
   borderColor: "#ccc",
   fontSize: 16,
 },
 submitButton: {
   backgroundColor: "#FFB347",
   paddingVertical: 12,
   borderRadius: 8,
   alignItems: "center",
 },
 buttonText: {
   color: "white",
   fontSize: 16,
   fontWeight: "bold",
 },
});

export default ChangePassword;
