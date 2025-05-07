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

export default function TransactionView() {
  const navigation = useNavigation<BillSplitScreenNavigationProp>();

  return (
    <View>
      <Text>All Transactions</Text>
      <View style={styles.container}>
        <Image
          style={styles.avatar}
          source={require("../../../assets/images/icon.png")}
        />
        <Text style={styles.text}>Your name</Text>
        <Image
          style={styles.leaveAvatar}
          source={require("../../../assets/images/icon.png")}
        />
      </View>
      <View style={styles.transactionsList}>
        <View style={styles.box}>
          <Image
            style={styles.avatar}
            source={require("../../../assets/images/icon.png")}
          />
          <View style={styles.verticalContainer}>
            <View
            // style={styles.transactionContainer}
            >
              <Text>
                Member 1 added{" "}
                <Text style={styles.transactionName}>Internet Bill</Text>
              </Text>
              <Text>1 hour ago</Text>
              <View style={styles.container}>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.text}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.text}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
            // style={styles.transactionContainer}
            >
              <Text>
                Member 2 added{" "}
                <Text style={styles.transactionName}>Eating Out</Text>
              </Text>
              <Text>6 hours ago</Text>
              <View style={styles.container}>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.text}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.text}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
            // style={styles.transactionContainer}
            >
              <Text>
                Member 3 added{" "}
                <Text style={styles.transactionName}>Electricity Bill</Text>
              </Text>
              <Text>1 week ago</Text>
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
        </View>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  verticalContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  transactionName: {
    fontWeight: "bold",
  },
  avatar: {
    width: 50,
    height: 50,
  },
  text: {
    alignSelf: "center",
  },
  leaveAvatar: {
    width: 50,
    height: 50,
  },
  box: {
    width: "100%",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  transactionsList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: {
    width: 50,
    height: 50,
    borderWidth: 1,
    margin: 10,
  },
});
