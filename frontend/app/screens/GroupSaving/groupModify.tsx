import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect,useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { Modal } from "react-native";
import { GroupSavingStackParamList } from "../../navigation/GroupSavingNavigator"; // Import GroupSavingStackParamList
import { Button } from "react-native";
//import { navigate } from "expo-router/build/global-state/routing";
type GroupSavingScreenNavigationProp = StackNavigationProp<GroupSavingStackParamList, 'GroupSavingHome'>;
//const navigate = useNavigation();
interface RuleData {
  planId:string,
  title: string;
  amount: number;
  deadline: string;
  ruleDescription: string;
}
const GOAL_URL="http://localhost:8084/api/saving-goals";
export  function GroupMemProfile() {
    const navigation = useNavigation<GroupSavingScreenNavigationProp>();
    return(
        <Text>Group member profile</Text>
    );
}
export function GroupMemberRemove() {
    const navigation = useNavigation<GroupSavingScreenNavigationProp>();
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
export function SetRuleOld() {
    const navigation = useNavigation<GroupSavingScreenNavigationProp>();
    return(
        <Text>Set Rule</Text>
    );
}
export function SetRule() {
  const navigation = useNavigation<GroupSavingScreenNavigationProp>();
  const [RuleData, setRuleData] = useState<RuleData>({
    planId: "123e4567-e89b-12d3-a456-426614174000",
    ruleDescription: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (name: keyof RuleData, value: string | number) => {
    console.log(`Updating ${name} with value:`, value); // Debugging input changes
  
    setRuleData(prev => ({
      ...prev,
      [name]: name === 'amount' 
        ? parseFloat(value.toString()) || 0  // Ensure it's converted properly
        : value
    }));
  };
  const validateRuleData = (data: RuleData) => {
    const errors: string[] = [];
  
    if (typeof data.planId !== 'string') {
      errors.push(`Invalid type for planId: expected string, got ${typeof data.planId}`);
    }
    if (typeof data.ruleDescription !== 'string') {
      errors.push(`Invalid type for ruleDescription: expected string, got ${typeof data.ruleDescription}`);
    }
  
    if (errors.length > 0) {
      console.log("Validation Errors:", errors);
    } else {
      console.log("All types are correct:", data);
    }
  };
  
  
  

  const handleSubmit = async () => {
    //e.preventDefault();
    validateRuleData(RuleData);
    console.log("Submitting Goal Data:", RuleData); 
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Pass")
      const response = await fetch(`${GOAL_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(RuleData),
        credentials: 'include'
        
      });
      

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      console.log("Pass")

      const result = await response.json();
      //navigate('/goals');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create goal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalText}>Create New Rules</Text>
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        <ScrollView style={styles.formContainer}>
        

          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={RuleData.ruleDescription}
              onChangeText={(text) => handleInputChange('ruleDescription', text)}
              placeholder="Enter description"
              multiline
              numberOfLines={4}
            />
          </View>
          
         
          
        </ScrollView>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            
            style={[styles.button, styles.confirmButton]}
            
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Creating...' : 'Create Rule'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
export function GroupDelete() {
    const navigation = useNavigation<GroupSavingScreenNavigationProp>();
    const [modalVisible, setModalVisible] = useState(false);
    useEffect(() => {
        setModalVisible(true); // Show modal immediately when the component mounts
      }, []);
    const handleConfirm = () => {
        console.log("Action Confirmed");
        setModalVisible(false);
        navigation.navigate("GroupSavingHome"); // Navigate back to the previous screen
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

export function SetGoalOld() {
    const navigation = useNavigation<GroupSavingScreenNavigationProp>();
    return(
        <Text>Set Goal</Text>

    );
}


export function SetGoal() {
  const navigation = useNavigation<GroupSavingScreenNavigationProp>();
  const [RuleData, setRuleData] = useState<RuleData>({
    planId: "123e4567-e89b-12d3-a456-426614174000",
    title: '',
    amount: 0,
    deadline: '',
    ruleDescription: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (name: keyof RuleData, value: string | number) => {
    console.log(`Updating ${name} with value:`, value); // Debugging input changes
  
    setRuleData(prev => ({
      ...prev,
      [name]: name === 'amount' 
        ? parseFloat(value.toString()) || 0  // Ensure it's converted properly
        : value
    }));
  };
  const validateRuleData = (data: RuleData) => {
    const errors: string[] = [];
  
    if (typeof data.planId !== 'string') {
      errors.push(`Invalid type for planId: expected string, got ${typeof data.planId}`);
    }
    if (typeof data.title !== 'string') {
      errors.push(`Invalid type for title: expected string, got ${typeof data.title}`);
    }
    if (typeof data.amount !== 'number' || isNaN(data.amount)) {
      errors.push(`Invalid type for targetAmount: expected number, got ${typeof data.amount}`);
    }
    if (typeof data.deadline !== 'string') {
      errors.push(`Invalid type for deadline: expected string, got ${typeof data.deadline}`);
    }
    if (typeof data.ruleDescription !== 'string') {
      errors.push(`Invalid type for ruleDescription: expected string, got ${typeof data.ruleDescription}`);
    }
  
    if (errors.length > 0) {
      console.log("Validation Errors:", errors);
    } else {
      console.log("All types are correct:", data);
    }
  };
  
  
  

  const handleSubmit = async () => {
    //e.preventDefault();
    validateRuleData(RuleData);
    console.log("Submitting Goal Data:", RuleData); 
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Pass")
      const response = await fetch(`${GOAL_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(RuleData),
        credentials: 'include'
        
      });
      

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      console.log("Pass")

      const result = await response.json();
      //navigate('/goals');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create goal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalText}>Create New Goal</Text>
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        <ScrollView style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Goal Title</Text>
            <TextInput
              style={styles.input}
              value={RuleData.title}
              onChangeText={(text) => handleInputChange('title', text)}
              placeholder="Enter goal title"
           
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={RuleData.ruleDescription}
              onChangeText={(text) => handleInputChange('ruleDescription', text)}
              placeholder="Enter description"
              multiline
              numberOfLines={4}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Target Date</Text>
            <TextInput
              style={styles.input}
              value={RuleData.deadline}
              onChangeText={(text) => handleInputChange('deadline', text)}
              placeholder="YYYY-MM-DD"
             
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Target Amount (optional)</Text>
            <TextInput
              style={styles.input}
              value={RuleData.amount.toString()}
              onChangeText={(text) => handleInputChange('amount', text)}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
          </View>
          
          
        </ScrollView>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            
            style={[styles.button, styles.confirmButton]}
            
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Creating...' : 'Create Goal'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
    //container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    //modalContainer: { width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' },
    //modalText: { fontSize: 18, marginBottom: 20, textAlign: 'center' },
    //buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    //button: { flex: 1, padding: 10, marginHorizontal: 5, borderRadius: 5, alignItems: 'center' },
    //cancelButton: { backgroundColor: 'gray' },
    //confirmButton: { backgroundColor: 'green' },
    //buttonText: { color: 'white', fontSize: 16 },
    container: { 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContainer: { 
      width: 300, 
      padding: 20, 
      backgroundColor: 'white', 
      borderRadius: 10, 
      maxHeight: '80%'
    },
    modalText: { 
      fontSize: 18, 
      marginBottom: 20, 
      textAlign: 'center',
      fontWeight: 'bold'
    },
    formContainer: {
      width: '100%',
      marginBottom: 20
    },
    inputGroup: {
      marginBottom: 15
    },
    label: {
      marginBottom: 5,
      fontWeight: '600'
    },
    input: {
      width: '100%',
      padding: 10,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top'
    },
    selectContainer: {
      width: '100%'
    },
    buttonContainer: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      width: '100%' 
    },
    button: { 
      flex: 1, 
      padding: 10, 
      marginHorizontal: 5, 
      borderRadius: 5, 
      alignItems: 'center' 
    },
    cancelButton: { 
      backgroundColor: 'gray' 
    },
    confirmButton: { 
      backgroundColor: 'green' 
    },
    buttonText: { 
      color: 'white', 
      fontSize: 16 
    },
    errorText: {
      color: 'red',
      marginBottom: 15,
      textAlign: 'center'
    }
  });