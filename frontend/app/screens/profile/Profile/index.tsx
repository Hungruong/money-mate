import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

const { width } = Dimensions.get('window'); // Get the screen width for responsive design

const ProfileScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your Profile</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Spending')}>
          <Text style={styles.buttonText}>Track Spending</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('GroupSaving')}>
          <Text style={styles.buttonText}>Group Saving</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('GroupSplitting')}>
          <Text style={styles.buttonText}>Bill Splitting</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Investment')}>
          <Text style={styles.buttonText}>Investment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chatbot')}>
          <Text style={styles.buttonText}>Chatbot</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Homepage')}>
          <Text style={styles.buttonText}>Homepage</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity style={styles.editProfileButton} onPress={() => navigation.navigate('EditProfile')}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>


      {/* Log Out Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFC8DD',
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#a91337',
    fontFamily: 'GeneralSans-Regular',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#CDB4DB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 350,
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: width * 0.04,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'GeneralSans-Regular',
  },
  editProfileButton: {
    backgroundColor: '#CDB4DB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    position: 'absolute',
    bottom: 90, // Adjusted position to fit log out button below
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  logoutButton: {
    backgroundColor: '#FF6F61', // Different color for log out button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    position: 'absolute',
    bottom: 30, // Positioned at the bottom
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
});

export default ProfileScreen;