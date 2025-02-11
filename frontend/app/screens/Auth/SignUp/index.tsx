import React, { useCallback } from 'react';
import { Image, StyleSheet, View, TextInput, Button, ImageBackground, Text, StatusBar, TouchableOpacity} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { AuthNavigationProp } from "../../../types/navigation";

        
export default function SignUpScreen() {
  const navigation = useNavigation<AuthNavigationProp>();
  return (
      <View style={styles.root}>
        <StatusBar backgroundColor="black" barStyle="dark-content" />
        <ImageBackground style={styles.background} source={require('@/assets/images/background5.png')}>

          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subText}>Let's create your own account</Text>
        
          <Text style={styles.text1}>First name</Text>
          <TextInput style={styles.inputTextbox} placeholder=' Please enter your first name'></TextInput>
          <Text style={styles.text1}>Last name</Text>
          <TextInput style={styles.inputTextbox} placeholder=' Please enter your last name'></TextInput>
          <Text style={styles.text1}>Email</Text>
          <TextInput style={styles.inputTextbox} placeholder='  Please enter your email'></TextInput>
          <Text style={styles.text1}>Password</Text>
          <TextInput style={styles.inputTextbox} placeholder='  Please enter your password'></TextInput>

          <View style={styles.button}>
            <TouchableOpacity 
              onPress={() => console.log("Handle Sign Up")} 
              style={styles.buttonContent}>
              <Text style={styles.buttonText}>SIGN UP</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.text}>Or sign up with</Text>
          <Image style={styles.button1Text2}
              source={require('@/assets/images/google_logo.jpg')}/>
   
          <View style={styles.signInNavigateBox}>
            <Text style={styles.navigationBoxText}>Already had an account ?</Text>
            <Button title="Sign In" onPress={() => navigation.navigate("SignIn")} color="#91337b"  />
          </View>
        
        </ImageBackground>
      </View>


);

}

const styles=StyleSheet.create({
  root: {
    flex:1, 
    fontFamily:'GeneralSans-Regular'
  },

  text:{
    textAlign:'center',
    fontSize:20, 
    marginTop:10
  },

  header:{
    flex:1,

  },
  
  buttonText:{ 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold' },

  buttonContent: {
    color: '#91337b',
    fontSize: 16,
    alignSelf:'center'
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
    marginTop:30,
    backgroundColor: '#91337b',
    padding: 10,
    borderRadius: 10,
    width:370,
    alignSelf:'center',
    marginBottom:20,
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
    marginTop:10,
    textAlign:'center', 
    fontSize: 30
  },

  subText:{
    marginTop:10,
    textAlign:'center', 
    fontSize: 20, 
    color:'grey',
    marginBottom:30,
  },

  text1:{
    marginTop:10,
    fontSize:20,
    left:10
  },

  button1:{
    alignItems: 'center', 
    marginTop: 20
  },

  button1Text:{ 
    backgroundColor: '#219ebc', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 25, // Makes it rounded
  },

  button1Text2:{ 
    marginTop:5,
    width:50,
    height:50,
    borderRadius:100,
    alignSelf:'center'
  },

  signInNavigateBox:{ 
    flexDirection: 'row', 
    alignItems: 'center',
    alignSelf:'center', 
    marginTop: 30 
  },

  navigationBoxText:{
    fontSize:20, 
    marginTop:0
  }
 
})