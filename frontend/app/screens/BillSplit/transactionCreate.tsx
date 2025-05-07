import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function TransactionCreate() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Title */}
        <Text style={styles.title}>Set a New Expense</Text>

        {/* Expense Title */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Expense Title</Text>
          <TextInput
            style={styles.input}
            placeholder="E.g., Vacation, Emergency Fund"
          />
        </View>

        {/* Amount */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Amount ($)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your goal amount"
            keyboardType="numeric"
          />
        </View>

        {/* Date */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Date</Text>
          <TextInput style={styles.input} placeholder="mm/dd/yyyy" />
        </View>

        {/* Category */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Category</Text>
          <TextInput style={styles.input} placeholder="Rent" />
        </View>

        {/* Add user */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Add user</Text>
          <TouchableOpacity
            style={styles.addUserButton}
            onPress={() => console.log("Add user pressed")}
          >
            <Text style={styles.addUserText}>add user here</Text>
          </TouchableOpacity>
        </View>

        {/* Action buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.addExpenseButton}
            onPress={() => console.log("Add Expense pressed")}
          >
            <Text style={styles.buttonText}>Add Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              // For example, navigate back or do something else
              navigation.goBack();
            }}
          >
            <Text style={styles.buttonText}>Cancel and Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    alignSelf: "center",
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
  },
  addUserButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addUserText: {
    color: "#333",
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  addExpenseButton: {
    flex: 1,
    backgroundColor: "#8B008B", // Dark magenta
    borderRadius: 6,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#999",
    borderRadius: 6,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
