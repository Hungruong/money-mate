import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from "@react-navigation/native";
import React from 'react';
import { GroupSavingStackParamList } from "../../navigation/GroupSavingNavigator"; // Import GroupSavingStackParamList

// Type navigation prop
type GroupSavingScreenNavigationProp = StackNavigationProp<GroupSavingStackParamList, 'GroupSavingHome'>;

export default function GroupSavingScreen() {
  const navigation = useNavigation<GroupSavingScreenNavigationProp>(); // Correct navigation

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 50 }}>
        <Text style={styles.title}>Your Group</Text>
      </View>

      <View style={{ flex: 1 }}>
        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('GroupHome')}>
          <Text>Group 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box}>
          <Text>Group 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box}>
          <Text>Group 3</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('GroupCreate')} // ✅ Navigates to GroupCreate screen
        >
          <Text>Create new group</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text>Delete existing group</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    marginTop: 40,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  box: {
    padding: 20,
    backgroundColor: 'grey',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    padding: 15,
    marginTop: 50,
    alignItems: 'center',
    backgroundColor: 'grey',
    borderRadius: 20,
    marginLeft: 50,
    marginRight: 50,
  },
});
