import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { BillSplitStackParamList } from "../../navigation/BillSplitNavigator";

// Type navigation prop
type BillSplitScreenNavigationProp = StackNavigationProp<
  BillSplitStackParamList,
  "BillSplitHome"
>;

// Example transaction interface from your code (unchanged)
export interface SplitTransaction {
  transactionId: string;
  groupId: string;
  amount: number;
  name: string;
  payerId: string;
  users: string[]; // Array of user IDs responsible for split
  createdAt: string;
}

export default function BillSplitScreen() {
  const navigation = useNavigation<BillSplitScreenNavigationProp>();

  // Example data that matches the screenshot
  const groups = [
    {
      id: 1,
      name: "BBQ Chicken",
      total: 450,
      statusLabel: "you are owed",
      statusAmount: 350,
      statusColor: "#4CAF50", // green
    },
    {
      id: 2,
      name: "House Maintenance",
      total: 1250,
      statusLabel: "you owe",
      statusAmount: 230,
      statusColor: "#F44336", // red
    },
    {
      id: 3,
      name: "Shopping",
      total: 1230,
      statusLabel: "Settled up",
      statusAmount: null,
      statusColor: "#2196F3", // blue
    },
  ];

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
        <Text style={styles.headerTitle}>Groups</Text>
        <TouchableOpacity style={styles.profileIcon}>
          <View style={styles.profileCircle} />
        </TouchableOpacity>
      </View>

      {/* Subheader */}
      <Text style={styles.subheaderText}>
        You are in {groups.length} groups
      </Text>

      {/* Group list */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {groups.map((group) => (
          <View key={group.id} style={styles.groupItem}>
            {/* Top row: name and total */}
            <View style={styles.groupRow}>
              <TouchableOpacity
                onPress={() => navigation.navigate("GroupHome")}
              >
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupAmount}>${group.total}</Text>
              </TouchableOpacity>
            </View>

            {/* Status bar */}
            {group.statusLabel === "Settled up" ? (
              <View
                style={[
                  styles.settledContainer,
                  { borderColor: group.statusColor },
                ]}
              >
                <Text
                  style={[styles.settledText, { color: group.statusColor }]}
                >
                  Settled up
                </Text>
              </View>
            ) : (
              <View style={styles.statusContainer}>
                <View
                  style={[
                    styles.statusLabelBox,
                    { backgroundColor: group.statusColor },
                  ]}
                >
                  <Text style={styles.statusLabel}>{group.statusLabel}</Text>
                </View>
                <Text style={styles.statusAmount}>${group.statusAmount}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Bottom buttons (kept from original code) */}
      <View style={styles.bottomMenu}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate("GroupCreate")}
        >
          <Text style={styles.menuButtonText}>Create Group</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate("GroupDelete")}
        >
          <Text style={styles.menuButtonText}>Delete Group</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF",
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
    alignItems: "center",
    justifyContent: "center",
  },
  profileCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#999",
  },
  subheaderText: {
    marginLeft: 16,
    marginBottom: 10,
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  groupItem: {
    backgroundColor: "#F9F9F9",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  groupRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "500",
  },
  groupAmount: {
    fontSize: 16,
    fontWeight: "500",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusLabelBox: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 10,
  },
  statusLabel: {
    color: "#FFF",
    fontSize: 14,
  },
  statusAmount: {
    fontSize: 14,
    fontWeight: "500",
  },
  settledContainer: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  settledText: {
    fontSize: 14,
    fontWeight: "500",
  },
  bottomButtonsContainer: {
    marginTop: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    marginTop: 10,
    alignItems: "center",
    backgroundColor: "grey",
    borderRadius: 20,
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
});

// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { StackNavigationProp } from "@react-navigation/stack";
// import { useNavigation } from "@react-navigation/native";
// import React from "react";
// import { BillSplitStackParamList } from "../../navigation/BillSplitNavigator"; // Import BillSplitStackParamList

// // Type navigation prop
// type BillSplitScreenNavigationProp = StackNavigationProp<
//   BillSplitStackParamList,
//   "BillSplitHome"
// >;

// export interface SplitTransaction {
//   transactionId: string;
//   groupId: string;
//   amount: number;
//   name: string;
//   payerId: string;
//   users: string[]; // Array of user IDs responsible for split
//   createdAt: string;
// }

// export default function BillSplitScreen() {
//   const navigation = useNavigation<BillSplitScreenNavigationProp>(); // Correct navigation

//   return (
//     <View style={styles.container}>
//       <View style={{ marginTop: 50 }}>
//         <Text style={styles.title}>Your Group</Text>
//       </View>

//       <View style={{ flex: 1 }}>
//         <TouchableOpacity
//           style={styles.box}
//           onPress={() => navigation.navigate("GroupHome")}
//         >
//           <Text>Group 1</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.box}>
//           <Text>Group 2</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.box}>
//           <Text>Group 3</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={{ flex: 1 }}>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => navigation.navigate("GroupCreate")} // ✅ Navigates to GroupCreate screen
//         >
//           <Text>Create new group</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => navigation.navigate("BillSplitHome")}
//         >
//           <Text>Delete existing group</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   title: {
//     fontSize: 20,
//     marginTop: 40,
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   box: {
//     padding: 20,
//     backgroundColor: "grey",
//     alignItems: "center",
//     marginTop: 10,
//   },
//   button: {
//     padding: 15,
//     marginTop: 50,
//     alignItems: "center",
//     backgroundColor: "grey",
//     borderRadius: 20,
//     marginLeft: 50,
//     marginRight: 50,
//   },
// });
