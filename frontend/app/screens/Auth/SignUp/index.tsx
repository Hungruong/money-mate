import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import {View} from "react-native";
import { TextInput } from 'react-native';
import { Button } from 'react-native';
import React, {useCallback} from 'react';
import {Alert, Linking} from 'react-native';
import {ImageBackground, Text} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
// Importing the class from the location of the file

import { useNavigation } from "@react-navigation/native";
import { AuthNavigationProp } from "../../../types/navigation";

// Creating an object of the class which is imported

import { TouchableOpacity } from 'react-native';
        
export default function SignUpScreen() {
  const navigation = useNavigation<AuthNavigationProp>();
  return (
    
      <View style={styles.root}>
        <StatusBar backgroundColor="black" barStyle="dark-content" />

        <ImageBackground style={styles.background} source={require('@/assets/images/background5.png')}>

  
          <Text style={{marginTop:10,textAlign:'center', fontSize: 30}}>Sign Up</Text>
          <Text style={{marginTop:10,textAlign:'center', fontSize: 20, color:'grey'}}>Let's create your own account</Text>
        
          
          
          <Text style={{marginTop:10,fontSize:20,left:10}}>First name</Text>
          <TextInput style={styles.inputTextbox} placeholder=' Alice'></TextInput>
          <Text style={{marginTop:5,fontSize:20,left:10}}>Last name</Text>
          <TextInput style={styles.inputTextbox} placeholder=' Dang'></TextInput>
          <Text style={{marginTop:5,fontSize:20,left:10}}>Email</Text>
          <TextInput style={styles.inputTextbox} placeholder='  moneymate@gmail.com'></TextInput>
          <Text style={{marginTop:5,fontSize:20,left:10}}>Password</Text>
          <TextInput style={styles.inputTextbox} placeholder='  ***********'></TextInput>

        
          
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <TouchableOpacity 
              onPress={() => console.log("Handle Sign Up")} 
              style={{ 
                backgroundColor: '#219ebc', 
                paddingVertical: 10, 
                paddingHorizontal: 20, 
                borderRadius: 25, // Makes it rounded
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>SIGN UP</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.text}>Or sign up with</Text>
          <Image style={{ marginTop:5,width:50,height:50,borderRadius:100,alignSelf:'center'}}
              source={require('@/assets/images/google_logo.jpg')}
          />

    
          
          <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf:'center', marginTop: 30 }}>
            <Text style={{fontSize:20, marginTop:0}}>Already had an account ?</Text>
            
            <Button title="Sign In" onPress={() => navigation.navigate("SignIn")} color="#219ebc"  />
          </View>
        
        </ImageBackground>
      </View>


);

}

const styles=StyleSheet.create({
  root: {flex:1, fontFamily:'GeneralSans-Regular'},
  container:{
    flex:2,textAlign:'center',backgroundColor: 'white',
  },
  image:{opacity:2},
  text:{
    textAlign:'center',fontSize:20, marginTop:10
  },
  lefttext:{
    textAlign:'left',fontSize:20,
  },
  content: {
    flex: 1,
    paddingTop: StatusBar.currentHeight, // Ensures content does not overlap with status bar
  },


  header:{
    flex:1,
    

  },
  inputTextbox:{
    height: 40,
    width:370,
    bottom: 0,
    left:0,
    margin:10,
    borderWidth:1,
    color: 'grey',
    borderRadius:10,

  },
  marginAlgin:{
    marginTop:10,
  },
  button: {
    marginTop:20,
    backgroundColor: '#91337b',
    padding: 10,
    borderRadius: 5,
    width:100,
    alignSelf:'center',
    
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    alignSelf:'center',
    marginTop:5,
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
 
})