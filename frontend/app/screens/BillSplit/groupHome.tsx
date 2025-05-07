import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { StackNavigationProp } from "@react-navigation/stack";
import { BillSplitStackParamList } from "../../navigation/BillSplitNavigator"; // Import BillSplitStackParamList

type BillSplitScreenNavigationProp = StackNavigationProp<
  BillSplitStackParamList,
  "BillSplitHome"
>;

export function GroupHome() {
  const navigation = useNavigation<BillSplitScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>BBQ Chicken</Text>
        <TouchableOpacity style={styles.profileIcon}>
          <View style={styles.profileCircle} />
        </TouchableOpacity>
      </View>

      {/* Amount owed/owed to you */}
      <View style={styles.owedContainer}>
        <Text style={styles.owedLabel}>you are owed</Text>
        <Text style={styles.owedAmount}>$350</Text>
      </View>

      {/* Who owes whom */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Who owes whom?</Text>
        <Text style={styles.itemText}>John owes you $100</Text>
        <Text style={styles.itemText}>Evelyn owes you $150</Text>
        <Text style={styles.itemText}>Jack97 owes you $100</Text>
      </View>

      {/* Paid section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paid</Text>
        <Text style={styles.itemText}>Emily sent you $100</Text>
      </View>

      {/* Bottom menu buttons */}
      <View style={styles.bottomMenu}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate("AddTransaction")}
        >
          <Text style={styles.menuButtonText}>Add expense</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate("ReceiptScan")}
        >
          <Text style={styles.menuButtonText}>Scan receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate("InviteMember")}
        >
          <Text style={styles.menuButtonText}>Invite member</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export function InviteMember() {
  const navigation = useNavigation<BillSplitScreenNavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    setModalVisible(true); // Show modal immediately when the component mounts
  }, []);
  const handleConfirm = () => {
    console.log("Action Confirmed");
    setModalVisible(false);
    navigation.navigate("BillSplitHome"); // Navigate back to the previous screen
  };

  const handleCancel = () => {
    setModalVisible(false);
    navigation.goBack(); // Navigate back on cancel as well
  };
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={handleCancel} // Close modal when user presses device back button
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.headerTitle}>Invite a Friend</Text>
            <Text style={styles.modalText}>
              Share MoneyMate with your friends and help them take control of
              the group&apos;s finances
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your friend's username"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={() => console.log("Username submitted")}
            />

            {/* Action buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text style={styles.buttonText}>Send Invite</Text>
              </TouchableOpacity>

              {/* Keep or remove Cancel button as desired */}
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backButton: {
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 18,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "500",
  },
  profileIcon: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  profileCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#999",
  },
  owedContainer: {
    margin: 16,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#000",
    alignItems: "center",
  },
  owedLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  owedAmount: {
    fontSize: 22,
    fontWeight: "700",
  },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  itemText: {
    fontSize: 14,
    marginBottom: 4,
  },
  bottomMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 32,
    paddingBottom: 16,
  },
  menuButton: {
    width: 70,
    height: 70,
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  menuButtonText: {
    fontSize: 12,
    textAlign: "center",
  },

  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: { fontSize: 14, marginBottom: 10, textAlign: "center" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: { backgroundColor: "gray" },
  confirmButton: { backgroundColor: "#8B008B" },
  buttonText: { color: "white", fontSize: 16 },
});
