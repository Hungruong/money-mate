import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  Image, 
  ImageBackground, 
  StatusBar, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { useNavigation } from "@react-navigation/native";

import { StackNavigationProp } from '@react-navigation/stack';

import { GroupSavingStackParamList } from "../../navigation/GroupSavingNavigator"; // Import GroupSavingStackParamList

type GroupSavingScreenNavigationProp = StackNavigationProp<GroupSavingStackParamList, 'GroupSavingHome'>;


export default function GroupHome() {
    const navigation = useNavigation<GroupSavingScreenNavigationProp>();

  return (
    <View>
      <Text>Group Home</Text>
        <View style={styles.container}>
            <Image style={styles.avatar} source={require("../../../assets/images/icon.png") } />
            <Text style={styles.text}>Your name</Text>
            <Image style={styles.leaveAvatar} source={require("../../../assets/images/icon.png") } />
        </View>   

       <View>
            <Text style={styles.text}>GroupName</Text>
       </View>
    //List of Member 
       <View style={styles.userList}>
            <View style={styles.box}>
                <Image style={styles.avatar} source={require("../../../assets/images/icon.png") } />
                <Text style={styles.text}>Name</Text>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.button}
                    onPress={() => navigation.navigate('GroupMemProfile')} 
                    >
                        <Text style={styles.text}>View</Text>
                        
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.button}
                    onPress={() => navigation.navigate('GroupMemberRemove')} >
                        <Text style={styles.text}>Edit</Text>

                    </TouchableOpacity>
            </View>
            
            
        </View>
        <View style={styles.box}>
            <Image style={styles.avatar} source={require("../../../assets/images/icon.png") } />
            <Text style={styles.text}>Name</Text>
            <View style={styles.container}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.text}>View</Text>

                </TouchableOpacity>
                
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.text}>Edit</Text>

                </TouchableOpacity>
            </View>
            
            
        </View>
        <View style={styles.box}>
            <Image style={styles.avatar} source={require("../../../assets/images/icon.png") } />
            <Text style={styles.text}>Name</Text>
            <View style={styles.container}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.text}>View</Text>

                </TouchableOpacity>
                
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.text}>Edit</Text>

                </TouchableOpacity>
            </View>
            
            
        </View>
        <View style={styles.box}>
            <Image style={styles.avatar} source={require("../../../assets/images/icon.png") } />
            <Text style={styles.text}>Name</Text>
            <View style={styles.container}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.text}>View</Text>

                </TouchableOpacity>
                
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.text}>Edit</Text>

                </TouchableOpacity>
            </View>
            
        </View>
        

       </View>

      <View>
      <TouchableOpacity style={[styles.button,{alignSelf:"center"}]}>
            <Text style={styles.text}>
                Invite friend
            </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button,{alignSelf:"center"}]} onPress={() => navigation.navigate('SetRule')} >
            <Text style={styles.text}>
                View/Edit Rules
            </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button,{alignSelf:"center"}]}onPress={() => navigation.navigate('GroupDelete')} >
            <Text style={styles.text}>
                Delete Group
            </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button,{alignSelf:"center"}]}onPress={() => navigation.navigate('SetGoal')} >
            <Text style={styles.text}>
                Set Goal
            </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container:{
    flexDirection:'row',
    justifyContent: "space-between",
    
    },
  avatar:{
    width: 50,
    height: 50,

  },
  text:{
    alignSelf:'center',
  },
  leaveAvatar:{
    width: 50,
    height: 50,
  },
  box: {
    width:"50%",
  
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 10,
    
  },
  userList:{
    flexDirection:'row',
    flexWrap:'wrap',

  },
  button:{
    width: 50,
    height: 50,
    borderWidth: 1,
    margin:10,
    
  }

});