import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, TextInput, FlatList, ActivityIndicator } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { Modal } from "react-native";
import { GroupSavingStackParamList } from "../../navigation/GroupSavingNavigator";
import { Button } from "react-native";
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { SavingGoal } from "@/app/types/SavingGoal";

type GroupSavingScreenNavigationProp = StackNavigationProp<GroupSavingStackParamList, 'GroupSavingHome'>;
type GroupHomeScreenRouteProp = RouteProp<GroupSavingStackParamList, 'GroupHome'>;

interface Goal {
  planId: string;
  title: string;
  amount: number;
  deadline: string;
  ruleDescription: string;
  goalId: string;
}

interface Rule {
  planId: string;
  ruleId: string;
  description: string;
}

const GOAL_URL = "http://localhost:8084/api/saving-goals";
const RULE_URL = "http://localhost:8084/api/saving-rules";

export function GroupMemProfile() {
  const navigation = useNavigation<GroupSavingScreenNavigationProp>();
  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Group Member Profile</Text>
      {/* Profile content would go here */}
    </View>
  );
}

export function GroupMemberRemove() {
  const navigation = useNavigation<GroupSavingScreenNavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setModalVisible(true);
  }, []);

  const handleConfirm = () => {
    console.log("Action Confirmed");
    setModalVisible(false);
    navigation.goBack();
  };

  const handleCancel = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <View style={styles.centeredContainer}>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Remove Member</Text>
            <Text style={styles.modalText}>Are you sure you want to remove this member from the group?</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleConfirm}>
                <Text style={styles.buttonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export function SetRule() {
  const navigation = useNavigation<GroupSavingScreenNavigationProp>();
  const route = useRoute<GroupHomeScreenRouteProp>();
  const { planId } = route.params;
  const [rules, setRules] = useState<Rule[]>([]);
  const [newRule, setNewRule] = useState<Omit<Rule, 'ruleId'>>({ planId, description: '' });
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Rule[]>(RULE_URL);
      setRules(response.data);
    } catch (error) {
      console.error('Error fetching rules:', error);
      Alert.alert('Error', 'Unable to load rules. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newRule.description.trim()) {
      Alert.alert('Error', 'Please enter a rule description');
      return;
    }

    setLoading(true);
    try {
      if (editingRule) {
        await axios.put(`${RULE_URL}/${editingRule.ruleId}`, { ...newRule, ruleId: editingRule.ruleId });
        Alert.alert('Success', 'Rule updated successfully!');
      } else {
        await axios.post(RULE_URL, newRule);
        Alert.alert('Success', 'Rule created successfully!');
      }
      fetchRules();
      setNewRule({ planId, description: '' });
      setEditingRule(null);
    } catch (error) {
      console.error('Error saving rule:', error);
      Alert.alert('Error', 'Unable to save rule. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ruleId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this rule?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await axios.delete(`${RULE_URL}/${ruleId}`);
              Alert.alert('Success', 'Rule deleted successfully!');
              fetchRules();
            } catch (error) {
              console.error('Error deleting rule:', error);
              Alert.alert('Error', 'Unable to delete rule. Please try again later.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleEdit = (rule: Rule) => {
    setNewRule({ planId: rule.planId, description: rule.description });
    setEditingRule(rule);
  };

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.pageTitle}>Group Rules</Text>
      
      <View style={styles.formCard}>
        <Text style={styles.formLabel}>Rule Description</Text>
        <TextInput
          placeholder="Enter rule description"
          value={newRule.description}
          onChangeText={(text) => setNewRule({ ...newRule, description: text })}
          style={styles.textInput}
          multiline
        />
        <TouchableOpacity
          style={[styles.actionButton, editingRule ? styles.updateButton : styles.createButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {editingRule ? 'Update Rule' : 'Create Rule'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Existing Rules</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0066cc" style={styles.loader} />
      ) : (
        <FlatList
          data={rules.filter(rule => rule.planId === planId)}
          keyExtractor={(item) => item.ruleId}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>No rules added yet</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.listItemCard}>
              <Text style={styles.ruleDescription}>{item.description}</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.smallButton, styles.editButton]} 
                  onPress={() => handleEdit(item)}
                >
                  <Text style={styles.smallButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.smallButton, styles.deleteButton]} 
                  onPress={() => handleDelete(item.ruleId)}
                >
                  <Text style={styles.smallButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

export function GroupDelete() {
  const navigation = useNavigation<GroupSavingScreenNavigationProp>();
  const route = useRoute<GroupHomeScreenRouteProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const { planId } = route.params;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setModalVisible(true);
  }, []);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8084/api/saving-groups/${planId}`);
      setModalVisible(false);
      navigation.navigate("GroupSavingHome");
    } catch (error) {
      console.error("Error deleting group:", error);
      Alert.alert("Error", "Unable to delete the group. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <View style={styles.centeredContainer}>
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Delete Group</Text>
            <Text style={styles.modalText}>Are you sure you want to delete this savings group? This action cannot be undone.</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={handleCancel}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.dangerButton]} 
                onPress={handleConfirm}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.buttonText}>Delete</Text>
                )}
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
  const [newGoal, setNewGoal] = useState<Omit<Goal, 'goalId'>>({ 
    planId, 
    title: '', 
    amount: 0, 
    deadline: '', 
    ruleDescription: '' 
  });
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Goal[]>(GOAL_URL);
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
      Alert.alert('Error', 'Unable to load goals. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!newGoal.title.trim()) {
      Alert.alert('Error', 'Please enter a goal title');
      return;
    }
    if (newGoal.amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    if (!newGoal.deadline) {
      Alert.alert('Error', 'Please select a deadline');
      return;
    }

    setLoading(true);
    try {
      if (editingGoal) {
        await axios.put(`${GOAL_URL}/${editingGoal.goalId}`, { 
          ...newGoal, 
          goalId: editingGoal.goalId 
        });
        Alert.alert('Success', 'Goal updated successfully!');
      } else {
        await axios.post(GOAL_URL, newGoal);
        Alert.alert('Success', 'Goal created successfully!');
      }
      fetchGoals();
      setNewGoal({ 
        planId, 
        title: '', 
        amount: 0, 
        deadline: '', 
        ruleDescription: '' 
      });
      setEditingGoal(null);
    } catch (error) {
      console.error('Error saving goal:', error);
      Alert.alert('Error', 'Unable to save goal. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (goalId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await axios.delete(`${GOAL_URL}/${goalId}`);
              Alert.alert('Success', 'Goal deleted successfully!');
              fetchGoals();
            } catch (error) {
              console.error('Error deleting goal:', error);
              Alert.alert('Error', 'Unable to delete goal. Please try again later.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleEdit = (goal: Goal) => {
    setNewGoal({ 
      planId: goal.planId, 
      title: goal.title, 
      amount: goal.amount, 
      deadline: goal.deadline, 
      ruleDescription: goal.ruleDescription 
    });
    setEditingGoal(goal);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setNewGoal({ ...newGoal, deadline: formattedDate });
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.screenContainer}>
        <Text style={styles.pageTitle}>Savings Goal</Text>
        
        <View style={styles.formCard}>
          <Text style={styles.formLabel}>Goal Title</Text>
          <TextInput
            placeholder="What are you saving for?"
            value={newGoal.title}
            onChangeText={(text) => setNewGoal({ ...newGoal, title: text })}
            style={styles.textInput}
          />
          
          <Text style={styles.formLabel}>Target Amount</Text>
          <TextInput
            placeholder="0.00"
            value={newGoal.amount > 0 ? String(newGoal.amount) : ''}
            keyboardType="numeric"
            onChangeText={(text) => {
              const amount = text ? parseFloat(text) : 0;
              setNewGoal({ ...newGoal, amount });
            }}
            style={styles.textInput}
          />
          
          <Text style={styles.formLabel}>Deadline</Text>
          <TouchableOpacity 
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.datePickerButtonText}>
              {newGoal.deadline || 'Select a deadline'}
            </Text>
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={newGoal.deadline ? new Date(newGoal.deadline) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
          
          <Text style={styles.formLabel}>Description</Text>
          <TextInput
            placeholder="Add more details about this goal"
            value={newGoal.ruleDescription}
            onChangeText={(text) => setNewGoal({ ...newGoal, ruleDescription: text })}
            style={[styles.textInput, styles.textArea]}
            multiline
          />
          
          <TouchableOpacity
            style={[styles.actionButton, editingGoal ? styles.updateButton : styles.createButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {editingGoal ? 'Update Goal' : 'Create Goal'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Current Goals</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#0066cc" style={styles.loader} />
        ) : (
          <FlatList
            data={goals.filter(goal => goal.planId === planId)}
            keyExtractor={(item) => item.goalId}
            ListEmptyComponent={
              <Text style={styles.emptyListText}>No goals added yet</Text>
            }
            renderItem={({ item }) => (
              <View style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalTitle}>{item.title}</Text>
                  <Text style={styles.goalAmount}>{formatCurrency(item.amount)}</Text>
                </View>
                
                <View style={styles.goalDetails}>
                  <Text style={styles.goalDeadline}>Deadline: {item.deadline}</Text>
                  {item.ruleDescription ? (
                    <Text style={styles.goalDescription}>{item.ruleDescription}</Text>
                  ) : null}
                </View>
                
                <View style={styles.buttonRow}>
                  <TouchableOpacity 
                    style={[styles.smallButton, styles.editButton]} 
                    onPress={() => handleEdit(item)}
                  >
                    <Text style={styles.smallButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.smallButton, styles.deleteButton]} 
                    onPress={() => handleDelete(item.goalId)}
                  >
                    <Text style={styles.smallButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Layout containers
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  screenContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Headings
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    color: '#333',
  },
  
  // Cards
  formCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  listItemCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  goalCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Forms
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#444',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fafafa',
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  datePickerButtonText: {
    color: '#555',
    fontSize: 16,
  },
  picker: {
    height: 50,
    backgroundColor: '#fafafa',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  
  // List items
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  goalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  goalDetails: {
    marginBottom: 12,
  },
  goalDeadline: {
    color: '#555',
    marginBottom: 4,
  },
  goalDescription: {
    color: '#666',
    marginTop: 4,
  },
  ruleDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  emptyListText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 24,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  
  // Buttons
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  createButton: {
    backgroundColor: '#0066cc',
  },
  updateButton: {
    backgroundColor: '#4c9c2e',
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#0066cc',
  },
  deleteButton: {
    backgroundColor: '#cc3300',
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: 320,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 24,
    color: '#444',
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    margin: 4,
  },
  cancelButton: {
    backgroundColor: '#777',
  },
  confirmButton: {
    backgroundColor: '#4c9c2e',
  },
  dangerButton: {
    backgroundColor: '#cc3300',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  smallButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Misc
  loader: {
    marginVertical: 24,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
});