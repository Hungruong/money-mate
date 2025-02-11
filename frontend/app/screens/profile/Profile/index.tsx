import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, ImageBackground } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from "@expo/vector-icons";




interface ProfileScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Profile'> ;  // Change this line
  userData?: {
    avatarUrl?: string;
    name?: string;
    country?: string;
    phone?: string;
    email?: string;
  };
}


type RootStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
 };

 const ProfileScreen = ({ navigation, userData }: ProfileScreenProps) => {
  return (
  <ImageBackground 
    source={require('../../../../assets/images/image_background.png')}
    style={styles.backgroundImage}
  >
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.header}>
          <View style={styles.leftSection}>
            <Image style={styles.avatar} source={require("../../../../assets/images/profile.webp")} />
            <TouchableOpacity style={styles.uploadButton}>
              <Ionicons name="add-circle" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.name}>Name</Text>
            <Text style={styles.location}>United States</Text>
            <Text style={styles.contact}>(555) - 555 - 555</Text>
            <Text style={styles.email}>example@gmail.com</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Account Services</Text>
      
      <View style={styles.buttonGrid}>
        <TouchableOpacity style={styles.button}>
          <View style={styles.buttonContent}>
              <Image 
                  source={require("../../../../assets/images/spending.png")} // Path to your spending icon
                  style={styles.buttonIcon} 
                />
                <Text style={styles.buttonText}>Tracking Spending</Text>
                </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Group Saving</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Group Splitting</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Investment</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recentTransactions}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {/* Add your transaction list here */}
      </View>

      <View style={styles.bottomButtonsContainer}>
      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => navigation.navigate('EditProfile')}
      >
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
      </View>
    </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'space-between',
   marginBottom: 20,
 },
 leftSection: {
   position: 'relative',
   marginRight: 20,
 },
 rightSection: {
   flex: 1,
 },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
  },
  uploadButton: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  location: {
    color: '#666',
    marginBottom: 25,
  },
  contact: {
    color: '#666',
    marginBottom: 25,
  },
  email: {
    color: '#666',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    paddingLeft: 16,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  buttonContent: {
    flexDirection: 'row', // Arrange icon and text horizontally
    alignItems: 'center', // Vertically center icon and text
    flex: 1, // Take up all available space within the button
    justifyContent: 'center', // Center content horizontally
  },

  buttonIcon: {
    width: 20,  // Adjust size as needed
    height: 20, // Adjust size as needed
    marginRight: 10, // Space between icon and text
  },

  button: {
    width: '48%',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

  },
  buttonText: {
    textAlign: 'center',
  },
  bottomButtonsContainer: {  // Style for the button container
    position: 'absolute',
    bottom: 20, // Adjust as needed from the bottom
    left: 16,  // Adjust left/right as needed
    right: 16, // Adjust left/right as needed
    flexDirection: 'row',
    justifyContent: 'space-between', // Or 'space-around', 'flex-start', etc.
  },
  editButton: {
    backgroundColor: '#FFB347',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
  },
  recentTransactions: {
    marginTop: 20,
  },
 });
export default ProfileScreen;