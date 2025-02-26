
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import navigation, { AuthNavigationProp } from "../../../types/navigation";
import { Image, StyleSheet, Platform } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TextInput } from 'react-native';
import React, {useCallback} from 'react';
import {Alert, Linking} from 'react-native';
import {ImageBackground} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
// Importing the class from the location of the file
import { NavigationAction } from "@react-navigation/native";
import AuthNavigator from "@/app/navigation/AuthNavigator";

// Creating an object of the class which is imported

import { TouchableOpacity } from 'react-native';


export default function SignInScreen() {
  return (
    <View style={styles.container}>
      <View style={{marginTop:50}}>
        <Text style={styles.title}> Your Group</Text>
      </View>
      <View style={{flex:1}}>
        <TouchableOpacity style={styles.box}>
          <Text>Group 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box}>
          <Text>Group 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box}>
          <Text>Group 3</Text>
        </TouchableOpacity>
      </View>

      <View style={{flex:1}} >
        <TouchableOpacity 
          style={styles.button}
          onPress={()=>console.log()}>
          <Text>Create new group</Text>
        </TouchableOpacity>
     
        <TouchableOpacity style={styles.button}>
          <Text>Delete existing group</Text>
        </TouchableOpacity>
      </View>


    </View>
    
   
  );
}


const styles=StyleSheet.create({
  title:{
  
  fontSize:20,
  marginTop:40,
  
  },
  container:{
    flex:1,
    padding:20,

  },
  box: {
    //width: "50%",
    //height: 50,
    padding:20,
    backgroundColor:'grey',
    alignItems:'center',
    marginTop:10,

  },
  button:{
    padding:15,
    marginTop:50,
    alignItems:'center',
    backgroundColor:'grey',
    borderRadius:20,
    marginLeft:50,
    marginRight:50,
    //width:"50%",
  }
})