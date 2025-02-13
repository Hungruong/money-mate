import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { Image } from 'react-native';
const { width } = Dimensions.get('window');
import { ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const EditProfileScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password,setPassword]=useState('');

  return (
    <ImageBackground 
    source={require('../../../../assets/images/image_background.png')}
    style={styles.backgroundImage}>
 
      <View style={styles.container}>
        <View style={styles.titlebox}>
          <Text style={styles.title}>Edit Profile</Text>  
          <Image style={styles.avatar} source={require("../../../../assets/images/profile.webp")}/>
          <TouchableOpacity style={styles.uploadButton}>
              <Ionicons name="add-circle" size={24} color="#666" />
          </TouchableOpacity>
      </View>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          keyboardType="email-address"
          value={password}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={styles.saveButton} onPress={() => alert('Profile Updated!')}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
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
    //justifyContent: 'center',
    //alignItems: 'center',
    paddingHorizontal: 20,
    //backgroundColor: '#cdb4db',
    
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
  
    //textAlign: 'center',
    color: 'white',
    //justifyContent: 'flex-start',
    //alignItems: 'flex-start',
    alignSelf:'center',
    
    marginTop:20,
  },
  titlebox:{
    flexDirection:'column',
   
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: width * 0.04,
    borderWidth: 1,
    borderColor: '#CDB4DB',
  },
  uploadButton: {
    position: 'absolute',
    right: 255,
    bottom: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButton: {
    backgroundColor: '#FFB347',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    justifyContent: 'center',
    width: '80%',
    marginTop: 20,
  },
  buttonText: {
    fontSize: width * 0.04,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    alignSelf:'flex-start',
    marginBottom:20,
    marginTop:10,
    
  
  },
});

export default EditProfileScreen;   


