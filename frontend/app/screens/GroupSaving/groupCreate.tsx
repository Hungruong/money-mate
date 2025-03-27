import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  FlatList,
  Modal,
  Alert,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from "@react-navigation/native";

interface SavingPlan {
  planId: string;
  planType: 'Individual' | 'Group';
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

interface SavingPlanFormData {
  planType: 'Individual' | 'Group';
  userId: string;
  name: string;
  targetAmount: string;
  startDate: Date;
  endDate: Date;
}

const API_URL = 'http://localhost:8084/api/saving-plans';

export default function SavingPlanCreate() {
  const navigation = useNavigation();
  const [plans, setPlans] = useState<SavingPlan[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [planData, setPlanData] = useState<SavingPlanFormData>({
    planType: 'Individual',
    userId: "122e4567-e89b-12d3-a456-426614174000", // You'll need to get this from your auth system
    name: '',
    targetAmount: '',
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)) // Default 1 month from now
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<'start' | 'end' | null>(null);

  // Handle input changes with type safety
  const handleInputChange = (name: keyof SavingPlanFormData, value: string | 'Individual' | 'Group' | Date) => {
    console.log(`Updating ${name} with value:`, value);
    setPlanData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate plan data
  const validatePlanData = (data: SavingPlanFormData) => {
    const errors: string[] = [];

    if (!['Individual', 'Group'].includes(data.planType)) {
      errors.push('Plan type must be either Individual or Group');
    }
  
    if (typeof data.name !== 'string' || data.name.trim() === '') {
      errors.push('Plan name is required');
    }

    const amount = parseFloat(data.targetAmount);
    if (isNaN(amount) || amount <= 0) {
      errors.push('Target amount must be a positive number');
    }

    if (!(data.startDate instanceof Date) || isNaN(data.startDate.getTime())) {
      errors.push('Invalid start date');
    }

    if (!(data.endDate instanceof Date) || isNaN(data.endDate.getTime())) {
      errors.push('Invalid end date');
    }

    if (data.endDate <= data.startDate) {
      errors.push('End date must be after start date');
    }

    if (errors.length > 0) {
      console.log("Validation Errors:", errors);
      return errors;
    }

    console.log("All plan data is valid:", data);
    return null;
  };

  // Fetch saving plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setPlans(data.map((plan: any) => ({
          ...plan,
          startDate: new Date(plan.startDate),
          endDate: new Date(plan.endDate),
          createdAt: new Date(plan.createdAt)
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load saving plans');
      }
    };

    fetchPlans();
  }, []);

  // Handle plan creation
  const handleSubmit = async () => {
    const validationErrors = validatePlanData(planData);
    if (validationErrors) {
      setError(validationErrors.join(', '));
      return;
    }

    console.log("Submitting Plan Data:", planData);
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...planData,
        targetAmount: parseFloat(planData.targetAmount),
        currentAmount: 0 // Default to 0 for new plans
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      setPlans([...plans, {
        ...result,
        startDate: new Date(result.startDate),
        endDate: new Date(result.endDate),
        createdAt: new Date(result.createdAt)
      }]);
      setIsModalVisible(false);
      setPlanData({
        planType: 'Individual',
        userId: 'user-id-here',
        name: '',
        targetAmount: '',
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create saving plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle date changes
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(null);
    if (selectedDate && showDatePicker) {
      handleInputChange(showDatePicker === 'start' ? 'startDate' : 'endDate', selectedDate);
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Saving Plans</Text>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => setIsModalVisible(true)}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? 'Processing...' : 'Create New Saving Plan'}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={plans}
        keyExtractor={(item) => item.planId}
        renderItem={({ item }) => (
          <View style={styles.planCard}>
            <Text style={styles.planName}>{item.name} ({item.planType})</Text>
            <Text style={styles.planAmount}>Target: ${item.targetAmount.toFixed(2)}</Text>
            <Text style={styles.planAmount}>Saved: ${item.currentAmount.toFixed(2)}</Text>
            <Text style={styles.planDate}>Dates: {formatDate(item.startDate)} to {formatDate(item.endDate)}</Text>
            <Text style={styles.planDate}>Created: {formatDate(item.createdAt)}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No saving plans available. Create your first plan!</Text>
        }
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Saving Plan</Text>
            
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  planData.planType === 'Individual' && styles.typeButtonActive
                ]}
                onPress={() => handleInputChange('planType', 'Individual')}
              >
                <Text style={styles.typeButtonText}>Individual</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  planData.planType === 'Group' && styles.typeButtonActive
                ]}
                onPress={() => handleInputChange('planType', 'Group')}
              >
                <Text style={styles.typeButtonText}>Group</Text>
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Plan Name"
              value={planData.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Target Amount"
              keyboardType="numeric"
              value={planData.targetAmount}
              onChangeText={(text) => handleInputChange('targetAmount', text)}
            />
            
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker('start')}
            >
              <Text>Start Date: {formatDate(planData.startDate)}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker('end')}
            >
              <Text>End Date: {formatDate(planData.endDate)}</Text>
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={showDatePicker === 'start' ? planData.startDate : planData.endDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                minimumDate={showDatePicker === 'end' ? planData.startDate : undefined}
              />
            )}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsModalVisible(false)}
                disabled={isSubmitting}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                <Text style={styles.buttonText}>
                  {isSubmitting ? 'Creating...' : 'Create Plan'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  errorText: {
    color: '#e74c3c',
    marginBottom: 10,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  planCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: '#2c3e50',
  },
  planAmount: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  planDate: {
    fontSize: 12,
    color: '#95a5a6',
    marginBottom: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#95a5a6',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  typeButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  typeButtonText: {
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    padding: 12,
    borderRadius: 6,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  submitButton: {
    backgroundColor: '#2ecc71',
  },
});