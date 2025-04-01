import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, TextInput, FlatList, ActivityIndicator } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect,useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { Modal } from "react-native";
import { GroupSavingStackParamList } from "../../navigation/GroupSavingNavigator"; // Import GroupSavingStackParamList
import { Button } from "react-native";
import axios from 'axios';
//import { GroupSavingScreenNavigationProp } from '../types/navigationTypes';
import DateTimePicker from '@react-native-community/datetimepicker';
//import { Picker } from '@react-native-picker/picker';
import { Picker } from '@react-native-picker/picker';
import { SavingGoal } from "@/app/types/SavingGoal";

//import { DatePickerOptions } from "@react-native-community/datetimepicker";
//import { navigate } from "expo-router/build/global-state/routing";
type GroupSavingScreenNavigationProp = StackNavigationProp<GroupSavingStackParamList, 'GroupSavingHome'>;
type GroupHomeScreenRouteProp = RouteProp<GroupSavingStackParamList, 'GroupHome'>;
//type GroupSavingScreenNavigationProp = StackNavigationProp<GroupSavingStackParamList, 'GroupSavingHome'>;

//const navigate = useNavigation();
interface Goal {
  planId:string,
  title: string;
  amount: number;
  deadline: string;
  ruleDescription: string;
  goalId:string
}
interface Rule {
  planId: string;
  ruleId:string
  //name: string;
  description: string;
}

const GOAL_URL="http://localhost:8084/api/saving-goals";
const RULE_URL="http://localhost:8084/api/saving-rules"
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

//<SetRule planId="550d8581-a5b1-4021-b90d-52a350470d7f" />
export function SetRule() {
  const navigation = useNavigation<GroupSavingScreenNavigationProp>();
  const route = useRoute<GroupHomeScreenRouteProp>();
  const { planId } = route.params;
  const [rules, setRules] = useState<Rule[]>([]);
  const [newRule, setNewRule] = useState<Omit<Rule, 'ruleId'>>({ planId, description: '' });
  const [editingRule, setEditingRule] = useState<Rule | null>(null);

  useEffect(() => {
      fetchRules();
  }, []);

  const fetchRules = async () => {
      try {
          const response = await axios.get<Rule[]>(RULE_URL);
          setRules(response.data);
      } catch (error) {
          console.error('Error fetching rules:', error);
          Alert.alert('Error fetching rules');
      }
  };

  const handleSubmit = async () => {
    try {
        if (editingRule) {
            await axios.put(`${RULE_URL}/${editingRule.ruleId}`, { ...newRule, ruleId: editingRule.ruleId });
            Alert.alert('Rule updated successfully!');
        } else {
            await axios.post(RULE_URL, newRule);
            Alert.alert('Rule created successfully!');
        }
        fetchRules();
        setNewRule({ planId, description: '' }); // Reset form
        setEditingRule(null); // Clear editing state
    } catch (error) {
        console.error('Error saving rule:', error);
        Alert.alert('Error saving rule');
    }
  };
   

  const handleDelete = async (ruleId: string) => {
      try {
          await axios.delete(`${RULE_URL}/${ruleId}`);
          Alert.alert('Rule deleted successfully!');
          fetchRules();
      } catch (error) {
          console.error('Error deleting rule:', error);
          Alert.alert('Error deleting rule');
      }
  };
  const handleEdit = (rule: Rule) => {
    setNewRule({ planId: rule.planId, description: rule.description });
    setEditingRule(rule);
};

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Set Rule</Text>
        <TextInput
            placeholder="Rule Description"
            value={newRule.description}
            onChangeText={(text) => setNewRule({ ...newRule, description: text })}
            style={styles.input}
        />
        <Button title={editingRule ? 'Update Rule' : 'Create Rule'} onPress={handleSubmit} />

        <FlatList
            data={rules.filter(rule => rule.planId === planId)} // Filter by planId
            keyExtractor={(item) => item.ruleId}
            renderItem={({ item }) => (
                <View style={styles.ruleItem}>
                    <Text style={styles.ruleDescription}>{item.description}</Text>
                    <View style={styles.buttonContainer}>
                        <Button title="Edit" onPress={() => handleEdit(item)} />
                        <Button title="Delete" onPress={() => handleDelete(item.ruleId)} />
                    </View>
                </View>
            )}
        />
    </View>
  );
}

export function GroupDelete() {
    const navigation = useNavigation<GroupSavingScreenNavigationProp>();
    const route = useRoute<GroupHomeScreenRouteProp>();
    const [modalVisible, setModalVisible] = useState(false);
    const { planId } = route.params;
    useEffect(() => {
        setModalVisible(true); // Show modal immediately when the component mounts
      }, []);
      const handleConfirm = async () => {
        try {
            await axios.delete(`http://localhost:8084/api/saving-groups/${planId}`);
            console.log("Group deleted successfully");
            setModalVisible(false);
            navigation.navigate("GroupSavingHome");
        } catch (error) {
            console.error("Error deleting group:", error);
            // You might want to show an error message to the user
        }
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

export function SetGoal() {
  const navigation = useNavigation<GroupSavingScreenNavigationProp>();
  const route = useRoute<GroupHomeScreenRouteProp>();
  const { planId } = route.params;
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState<Omit<Goal, 'goalId'>>({ planId, title: '', amount: 0, deadline: '', ruleDescription: '' });
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  useEffect(() => {
      fetchGoals();
  }, []);

  const fetchGoals = async () => {
      try {
          const response = await axios.get<Goal[]>(GOAL_URL);
          setGoals(response.data);
      } catch (error) {
          console.error('Error fetching goals:', error);
          Alert.alert('Error fetching goals');
      }
  };
  const handleSubmit = async () => {
    try {
        if (editingGoal) {
            await axios.put(`${GOAL_URL}/${editingGoal.goalId}`, { ...newGoal, goalId: editingGoal.goalId });
            Alert.alert('Goal updated successfully!');
        } else {
            await axios.post(GOAL_URL, newGoal);
            Alert.alert('Goal created successfully!');
        }
        fetchGoals();
        setNewGoal({ planId, title: '', amount: 0, deadline: '', ruleDescription: '' }); // Reset form
        setEditingGoal(null); // Clear editing state
    } catch (error) {
        console.error('Error saving goal:', error);
        Alert.alert('Error saving goal');
    }
  };


  const handleDelete = async (goalId:string) => {
      try {
          await axios.delete(`${GOAL_URL}/${goalId}`);
          Alert.alert('Goal deleted successfully!');
          fetchGoals();
      } catch (error) {
          console.error('Error deleting goal:', error);
          Alert.alert('Error deleting goal');
      }
  };

  const handleEdit = (goal:Goal) => {
      setNewGoal({ planId: goal.planId, title: goal.title, amount: goal.amount, deadline: goal.deadline, ruleDescription: goal.ruleDescription });
      setEditingGoal(goal);
  };

  return (
      <View style={styles.container}>
          <Text style={styles.title}>Set Goal</Text>
          <TextInput
              placeholder="Goal Title"
              value={newGoal.title}
              onChangeText={(text) => setNewGoal({ ...newGoal, title: text })}
              style={styles.input}
          />
          <TextInput
              placeholder="Amount"
              value={String(newGoal.amount)}
              keyboardType="numeric"
              onChangeText={(text) => setNewGoal({ ...newGoal, amount: parseFloat(text) })}
              style={styles.input}
          />
          <TextInput
              placeholder="Deadline (YYYY-MM-DD)"
              value={newGoal.deadline}
              onChangeText={(text) => setNewGoal({ ...newGoal, deadline: text })}
              style={styles.input}
          />
          <TextInput
              placeholder="Rule Description"
              value={newGoal.ruleDescription}
              onChangeText={(text) => setNewGoal({ ...newGoal, ruleDescription: text })}
              style={styles.input}
          />
          <Button title={editingGoal ? 'Update Goal' : 'Create Goal'} onPress={handleSubmit} />

          <FlatList
              data={goals.filter(goal => goal.planId === planId)} // Filter by planId
              keyExtractor={(item) => item.goalId}
              renderItem={({ item }) => (
                  <View style={styles.ruleItem}>
                      <Text style={styles.ruleDescription}>{item.title}</Text>
                      <Text>{`Amount: ${item.amount}`}</Text>
                      <Text>{`Deadline: ${item.deadline}`}</Text>
                      <Text>{`Description: ${item.ruleDescription}`}</Text>
                      <View style={styles.buttonContainer}>
                          <Button title="Edit" onPress={() => handleEdit(item)} />
                          <Button title="Delete" onPress={() => handleDelete(item.goalId)} />
                      </View>
                  </View>
              )}
          />
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
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
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
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
},
  textArea: {
    height: 80,
    textAlignVertical: 'top'
  },
  ruleDescription: {
    flex: 1,
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
  },
    //container: {
      //padding: 20,
  //},
  title: {
      fontSize: 24,
      marginBottom: 20,
  },
  //input: {
      //borderWidth: 1,
      //borderColor: '#ccc',
      //borderRadius: 5,
      //padding: 10,
      //marginBottom: 10,
  //},
  ruleItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
  },
  ruleName: {
      fontWeight: 'bold',
  },
  currentGoalContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20
  },
  currentGoalTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16
  },
  currentGoalText: {
    marginBottom: 3
  }
  //buttonContainer: {
      //flexDirection: 'row',
      //gap: 10,
  //},
  });