import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { StackNavigationProp } from "@react-navigation/stack";

import { BillSplitStackParamList } from "../../navigation/BillSplitNavigator"; // Import BillSplitStackParamList

type BillSplitScreenNavigationProp = StackNavigationProp<
  BillSplitStackParamList,
  "BillSplitHome"
>;

export default function GroupCreate() {
  const navigation = useNavigation<BillSplitScreenNavigationProp>();

  return (
    <View>
      <Text>Group Create</Text>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({});
