import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  Modal,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<'start' | 'end' | null>(null);
  const [planData, setPlanData] = useState<SavingPlanFormData>({
    planType: 'Individual',
    userId: "122e4567-e89b-12d3-a456-426614174000", // You'll need to get this from your auth system
    name: '',
    targetAmount: '',
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)) // Default 1 month from now
  });
  const [success, setSuccess] = useState(false);

  // Handle input changes with type safety
  const handleInputChange = (name: keyof SavingPlanFormData, value: string | 'Individual' | 'Group' | Date) => {
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
      return errors;
    }

    return null;
  };

  // Handle plan creation
  const handleSubmit = async () => {
    const validationErrors = validatePlanData(planData);
    if (validationErrors) {
      setError(validationErrors.join(', '));
      return;
    }

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

      // Show success message
      setSuccess(true);
      
      // Reset form after short delay
      setTimeout(() => {
        setPlanData({
          planType: 'Individual',
          userId: "122e4567-e89b-12d3-a456-426614174000",
          name: '',
          targetAmount: '',
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
        });
        setSuccess(false);
      }, 2000);
      
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
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Create Saving Plan</Text>
          <Text style={styles.subHeader}>Set your financial goals and track your progress</Text>
        </View>
        
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#e74c3c" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        {success && (
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={20} color="#2ecc71" />
            <Text style={styles.successText}>Saving plan created successfully!</Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Plan Type</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                planData.planType === 'Individual' && styles.typeButtonActive
              ]}
              onPress={() => handleInputChange('planType', 'Individual')}
            >
              <Ionicons 
                name="person" 
                size={24} 
                color={planData.planType === 'Individual' ? '#ffffff' : '#3498db'} 
              />
              <Text style={[
                styles.typeButtonText,
                planData.planType === 'Individual' && styles.typeButtonTextActive
              ]}>Individual</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                planData.planType === 'Group' && styles.typeButtonActive
              ]}
              onPress={() => handleInputChange('planType', 'Group')}
            >
              <Ionicons 
                name="people" 
                size={24} 
                color={planData.planType === 'Group' ? '#ffffff' : '#3498db'} 
              />
              <Text style={[
                styles.typeButtonText,
                planData.planType === 'Group' && styles.typeButtonTextActive
              ]}>Group</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.sectionTitle}>Plan Details</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Plan Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Holiday Fund, New Car"
              value={planData.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Target Amount ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 5000"
              keyboardType="numeric"
              value={planData.targetAmount}
              onChangeText={(text) => handleInputChange('targetAmount', text)}
            />
          </View>
          
          <Text style={styles.sectionTitle}>Timeline</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Start Date</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker('start')}
            >
              <Text style={styles.dateText}>{formatDate(planData.startDate)}</Text>
              <Ionicons name="calendar" size={20} color="#3498db" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Target End Date</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker('end')}
            >
              <Text style={styles.dateText}>{formatDate(planData.endDate)}</Text>
              <Ionicons name="calendar" size={20} color="#3498db" />
            </TouchableOpacity>
          </View>
        </View>
        
        {showDatePicker && (
          <DateTimePicker
            value={showDatePicker === 'start' ? planData.startDate : planData.endDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={showDatePicker === 'end' ? planData.startDate : undefined}
          />
        )}
        
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="#ffffff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Create Saving Plan</Text>
            </>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={isSubmitting}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
    marginTop: 10,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#e74c3c',
    marginLeft: 8,
    flex: 1,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eafaf1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  successText: {
    color: '#2ecc71',
    marginLeft: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    marginHorizontal: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  typeButtonActive: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  typeButtonText: {
    color: '#3498db',
    fontWeight: '500',
    marginLeft: 8,
  },
  typeButtonTextActive: {
    color: '#ffffff',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dcdfe6',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#dcdfe6',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#f8f9fa',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  submitButton: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  cancelButton: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontWeight: '500',
    fontSize: 16,
  },
});