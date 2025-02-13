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
  Trading: undefined;
  Billsplit: undefined;
  GroupSaving: undefined;
  HomeScreen: undefined;
  
 };

 const ProfileScreen = ({ navigation, userData }: ProfileScreenProps) => {
  const accountServices = [
    { 
      title: 'Tracking Expense',
      icon: require('../../../../assets/images/spending.png'),
      onPress: () => navigation.navigate('HomeScreen')
    },
    { 
      title: 'Group Saving',
      icon: require('../../../../assets/images/saving.png'),
      onPress: () => navigation.navigate('GroupSaving')
    },
    { 
      title: 'Group Splitting',
      icon: require('../../../../assets/images/splitting.png'),
      onPress: () => navigation.navigate('Billsplit')
    },
    { 
      title: 'Investment',
      icon: require('../../../../assets/images/investment.png'),
      onPress: () => navigation.navigate('Trading')
    }
  ];
  
  return (
  <ImageBackground 
    source={require('../../../../assets/images/image_background.png')}
    style={styles.backgroundImage}
  >
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.header}>
          <View style={styles.leftSection}>
            <Image style={styles.avatar} source={require("../../../../assets/images/profile.png")} />
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
      <View style={styles.editButtonContainer}>
      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => navigation.navigate('EditProfile')}
      >
       <Text style={{ color: 'black', fontWeight: '500' }}>Edit Profile</Text> 
      </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Account Services</Text>
      
      <View style={styles.buttonGrid}>
          {accountServices.map((service, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.button}
            onPress={service.onPress}
          >
            <View style={styles.buttonContent}>
                <Image source={service.icon} style={styles.buttonIcon} />
                <Text style={styles.buttonText}>{service.title}</Text>
            </View>
          </TouchableOpacity>
  ))}
</View>

      <View style={styles.recentTransactions}>
        <Text style={styles.sectionTitle}>Account Summary</Text>
        <View style={styles.summaryBoxesContainer}> {/* New container */}
        <View style={styles.summaryBox}>
          <Text style={{ color: 'black', fontWeight: '700' }}>Total Income:</Text>
          <Text>10000$</Text> {/* Replace with your content */}
        </View>
        <View style={styles.summaryBox}>
          <Text style={{ color: 'black', fontWeight: '700' }}>Total Expense:</Text> {/* Replace with your content */}
          <Text>8000$</Text>
        </View>
      </View>
      </View>

      <View style={styles.bottomButtonsContainer}>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => navigation.navigate('EditProfile')}
      >
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.logoutButton}
       >
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
  },
  buttonContent: {
    flexDirection: 'row', // Arrange icon and text horizontally
    alignItems: 'center', // Vertically center icon and text
     // Take up all available space within the button
    justifyContent: 'center',
    flex: 1, // Center content horizontally
    flexWrap: 'wrap',
  },

  buttonIcon: {
    width: 30,  // Adjust size as needed
    height: 30, // Adjust size as needed
    position: 'absolute',
    left: -30, // Space between icon and text
  },

  button: {
    height: '40%',
    width: '48%',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingLeft: 40,

  },
  buttonText: {
    textAlign: 'center',
  },
  summaryBoxesContainer: {
    flexDirection: 'row', // Arrange boxes horizontally
    justifyContent: 'space-between', // Distribute space evenly
    paddingHorizontal: 10, // Add padding to the container
    marginTop: 10, // Add some top margin
  },

  summaryBox: {
    width: '40%', // Same width as your buttons
    backgroundColor: '#FFB6C1', // Or any other color
    marginHorizontal: 10, 
    borderRadius: 10,
    padding: 15, // Add padding to the boxes
    alignItems: 'center', // Center content vertically
    justifyContent: 'center',
    flex: 1, // Center content horizontally
     // Same height as your buttons
  },
  editButtonContainer: {
    marginTop: -10, // Adjust spacing below profile card
    alignItems: 'flex-end', // Align to the right
    marginRight: 16, // Add some right margin
  },
  editButton: {
    backgroundColor: 'transparent',
    padding: 0,
    borderRadius: 10,
    color:'blue',
  },
  bottomButtonsContainer: {  // Style for the button container
    position: 'absolute',
    bottom: 20, // Adjust as needed from the bottom
    left: 16,  // Adjust left/right as needed
    right: 16, // Adjust left/right as needed
    flexDirection: 'row',
    justifyContent: 'space-between', // Or 'space-around', 'flex-start', etc.
    zIndex: 1,
  },
  
  deleteButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: '#3498db',
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