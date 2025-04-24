import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, ImageBackground, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from "@expo/vector-icons";

import { useUser } from '../../Auth/UserContext';
interface ProfileScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Profile'>;
  userData?: {
    avatarUrl?: string;
    userName?: string;
    phoneNumber?: string;
    email?: string;
    income?: number;
    manualTradingBalance?: number;
  };
}

type RootStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Trading: undefined;
  Billsplit: undefined;
  GroupSaving: undefined;
  HomeScreen: undefined;
  ChangePassword: undefined;
};

const API_URL = "http://localhost:8082/api/users"; // Updated API URL

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const { userId } = useUser(); // Access userId from UserContext
  const [userData, setUserData] = useState<{
    avatarUrl: string;
    userName: string;
    phoneNumber: string;
    email: string;
    income: number; 
    manualTradingBalance: number;
  }>({
    avatarUrl: '',
    userName: '',
    phoneNumber: '',
    email: '',
    income: 0,
    manualTradingBalance: 0,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {

        //const userId = 'ef3f965a-edb6-49ae-8247-b8aaf1b1d434';
        
        //console.log("@Profile User ID:", userId); // Log the userId to the console
        //const userId = "ef3f965a-edb6-49ae-8247-b8aaf1b1d434"; // mock userID to render profile
        const response = await fetch(API_URL + "/" + userId);
        const data = await response.json();
        setUserData({
          userName: data.userName || '',
          phoneNumber: data.phoneNumber || '',
          email: data.email || '',
          avatarUrl: data.avatarUrl || '',
          income: typeof data.income === 'number' ? data.income : 0, 
          manualTradingBalance: typeof data.manualTradingBalance === 'number' ? data.manualTradingBalance : 0,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleDeleteAccount = async () => {
    try {
      //const userID = 'ef3f965a-edb6-49ae-8247-b8aaf1b1d434'; // mock userID to delete
      const response = await fetch(`${API_URL}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        Alert.alert("Account deleted successfully!", "", [
          { text: "OK", onPress: () => navigation.navigate('HomeScreen') }
        ]);
      } else {
        const errorData = await response.json();
        alert("Failed to delete account: " + errorData.message);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  }

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
      source={require('../../../../assets/images/background5.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.profileCard}>
          <View style={styles.header}>
            <View style={styles.leftSection}>
              <Image style={styles.avatar} source={require("../../../../assets/images/background5.png")} />
              <TouchableOpacity style={styles.uploadButton}>
                <Ionicons name="add-circle" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.rightSection}>
              <Text style={styles.name}>{userData.userName || 'Name'}</Text>
              <Text style={styles.contact}>{userData.phoneNumber || '(555) - 555 - 555'}</Text>
              <Text style={styles.email}>{userData.email || 'example@gmail.com'}</Text>
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
        <View style={styles.editButtonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('ChangePassword')}
          >
            <Text style={{ color: 'black', fontWeight: '500', marginTop: 10 }}>Change Password</Text>
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
          <View style={styles.summaryBoxesContainer}>
            <View style={styles.summaryBox}>
              <Text style={{ color: 'black', fontWeight: '700' }}>Total Income:</Text>
              <Text style={styles.income}>{userData.income ? `$${userData.income}` : '$0.00'}</Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={{ color: 'black', fontWeight: '700' }}>Manual Trading Balance:</Text>
              <Text style={styles.income}>{userData.manualTradingBalance ? `$${userData.manualTradingBalance}` : '$0.00'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount} 
          >
            <Text style={styles.buttonText}>Delete Account</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={() => navigation.navigate('HomeScreen')}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexWrap: 'wrap',
  },
  buttonIcon: {
    width: 30,
    height: 30,
    position: 'absolute',
    left: -30,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  summaryBox: {
    width: '40%',
    backgroundColor: '#FFB6C1',
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  editButtonContainer: {
    marginTop: -10,
    alignItems: 'flex-end',
    marginRight: 16,
  },
  editButton: {
    backgroundColor: 'transparent',
    padding: 0,
    borderRadius: 10,
    color: 'blue',
  },
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: '#ff0000',
    borderWidth: 1,
  },
  logoutButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: '#ff0000',
    borderWidth: 1,
  },
  income: {
    fontSize: 18,  
    fontWeight: '600',  
    color: 'black',
  },
  recentTransactions: {
    marginVertical: 30,
  },
});

export default ProfileScreen;
