
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigationProp } from "../../../types/navigation";
import { Image, StyleSheet, Platform } from 'react-native';


import { TextInput } from 'react-native';

import React, {useCallback} from 'react';
import {Alert, Linking} from 'react-native';
import {ImageBackground} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

// Importing the class from the location of the file



// Creating an object of the class which is imported

import { TouchableOpacity } from 'react-native';

export default function SignInScreen({ setIsAuthenticated }: { setIsAuthenticated: (value: boolean) => void }) {
  const navigation = useNavigation<AuthNavigationProp>();

  return (

    <View style={styles.root}>
    <StatusBar backgroundColor="black" barStyle="dark-content" />

    <ImageBackground style={styles.background} source={require('@/assets/images/background5.png')}>


      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>Hi! Welcome back </Text>
    
      
      
      <Text style={styles.text1}>Email</Text>
      <TextInput style={styles.inputTextbox} placeholder='  Please enter your email'></TextInput>
      <Text style={styles.text1}>Password</Text>
      <TextInput style={styles.inputTextbox} placeholder='  Please enter your password'></TextInput>
      <Text style={styles.forgotPasswordText} onPress={() => Linking.openURL('THIS INCLUDE LINK')}> Forgot Password </Text>

      


      <View style={styles.button}>
        <TouchableOpacity 
          onPress={() => console.log("Handle Sign Up")} 
          style={styles.buttonContent}>
          <Text style={styles.buttonText}>SIGN IN</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.text}>Or sign in with</Text>
      <Image style={styles.logo}
          source={require('@/assets/images/google_logo.jpg')}/>


      <View style={styles.container2}>
        <Text style={styles.button2}>Don't have an account ?</Text>
        
        <Button title="Sign Up" onPress={() => navigation.navigate("SignUp")} color="#91337b" />
      </View>
    
    </ImageBackground>
  </View>
  );
}


const styles=StyleSheet.create({
  root: {
    flex:1, 
    fontFamily:'GeneralSans-Regular',
    alignContent:'center',
},
  container:{
    flex:2,textAlign:'center',backgroundColor: 'white',
  },
  image:{opacity:2},
  text:{
    textAlign:'center',fontSize:20
  },


  header:{
    flex:1,
    

  },
  inputTextbox:{
    height: 40,
    width:370,
    margin:10,
    borderWidth:1,
    color: 'grey',
    borderRadius:10,

  },

  button: {
    marginTop:30,
    backgroundColor: '#91337b',
    padding: 10,
    borderRadius: 10,
    width:370,
    alignSelf:'center',
    marginBottom:20,
  },
  
  buttonContent: {
    color: '#91337b',
    fontSize: 16,
    alignSelf:'center'
  },
  underlinedText:{
    textDecorationLine:'underline',
  },
  background: {
    flex:1,
    justifyContent: 'center', // Centers content vertically
    // Centers content horizontally
    width: '100%',
    height: '100%',
  },
  title:{
    textAlign:'center', 
    fontSize: 30
  },
  subtitle:{
    marginTop:10,
    textAlign:'center', 
    fontSize: 20, 
    color:'grey',
    marginBottom:30
  },
  text1:{
    marginTop:20,
    fontSize:20,
    left:10
  },
  forgotPasswordText:{
    color: '#91337b', 
    textAlign:'right',
    marginTop:10,
    right:10,
    fontSize:15,
    textDecorationLine:'underline'
  },
  buttonCover:{
    alignItems: 'center', 
    marginTop: 20,
    
  },
  signInButton:{
    backgroundColor: '#219ebc', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 25,
  },
  buttonContent1:{
    color: 'white', fontSize: 20, fontWeight: 'bold'
  },
  logo:{
    width:50,
    height:50,
    borderRadius:1000,
    alignSelf:'center',
    marginTop:15,
  },
  container2:{ flexDirection: 'row', alignItems: 'center', alignSelf:'center', marginTop: 30 },
  button2:{fontSize:20},


  buttonText:{ color: 'white', fontSize: 16, fontWeight: 'bold' },

 
})