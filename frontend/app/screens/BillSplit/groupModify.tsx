import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect,useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { Modal } from "react-native";
import { BillSplitStackParamList } from "../../navigation/BillSplitNavigator"; // Import BillSplitStackParamList
import { Button } from "react-native";
type BillSplitScreenNavigationProp = StackNavigationProp<BillSplitStackParamList, 'BillSplitHome'>;


export  function GroupMemProfile() {
    const navigation = useNavigation<BillSplitScreenNavigationProp>();
    return(
        <Text>Group member profile</Text>
    );
}
export function GroupMemberRemove() {
    const navigation = useNavigation<BillSplitScreenNavigationProp>();
    const [modalVisible, setModalVisible] = useState(false);
    useEffect(() => {
        setModalVisible(true); // Show modal immediately when the component mounts
      }, []);
    const handleConfirm = () => {
        console.log("Action Confirmed");
        setModalVisible(false);
        navigation.goBack(); // Navigate back to the previous screen
      };
    
    const handleCancel = () => {
        setModalVisible(false);
        navigation.goBack(); // Navigate back on cancel as well
      };
    return(
        <View style={styles.container}>
            <Modal
            animationType="slide"
            transparent
            visible={modalVisible}
            onRequestClose={handleCancel} // Close modal when user presses back button
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>Are you sure you want to delete?</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                        <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
                        <Text style={styles.buttonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export function GroupDelete() {
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
    return(
        <View style={styles.container}>
            <Modal
            animationType="slide"
            transparent
            visible={modalVisible}
            onRequestClose={handleCancel} // Close modal when user presses back button
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>Are you sure you want to delete?</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                        <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
                        <Text style={styles.buttonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContainer: { width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' },
    modalText: { fontSize: 18, marginBottom: 20, textAlign: 'center' },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    button: { flex: 1, padding: 10, marginHorizontal: 5, borderRadius: 5, alignItems: 'center' },
    cancelButton: { backgroundColor: 'gray' },
    confirmButton: { backgroundColor: 'green' },
    buttonText: { color: 'white', fontSize: 16 },
  });