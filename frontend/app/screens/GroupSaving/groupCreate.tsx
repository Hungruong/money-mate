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
  ActivityIndicator,
  Image
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from "@react-navigation/native";
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Create Saving Plan</Text>
          <Text style={styles.subHeader}>Set your financial goals and track your progress</Text>
        </View>
      </LinearGradient>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#e74c3c" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        {success && (
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={24} color="#2ecc71" />
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
              <FontAwesome5 
                name="user" 
                size={22} 
                color={planData.planType === 'Individual' ? '#ffffff' : '#4c669f'} 
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
              <FontAwesome5 
                name="users" 
                size={22} 
                color={planData.planType === 'Group' ? '#ffffff' : '#4c669f'} 
              />
              <Text style={[
                styles.typeButtonText,
                planData.planType === 'Group' && styles.typeButtonTextActive
              ]}>Group</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.sectionTitle}>
            <FontAwesome5 name="file-alt" size={18} color="#4c669f" style={styles.sectionIcon} />
            Plan Details
          </Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Plan Name</Text>
            <View style={styles.inputWrapper}>
              <FontAwesome5 name="bookmark" size={18} color="#4c669f" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g., Holiday Fund, New Car"
                placeholderTextColor="#a0a0a0"
                value={planData.name}
                onChangeText={(text) => handleInputChange('name', text)}
              />
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Target Amount ($)</Text>
            <View style={styles.inputWrapper}>
              <FontAwesome5 name="dollar-sign" size={18} color="#4c669f" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g., 5000"
                placeholderTextColor="#a0a0a0"
                keyboardType="numeric"
                value={planData.targetAmount}
                onChangeText={(text) => handleInputChange('targetAmount', text)}
              />
            </View>
          </View>
          
          <Text style={styles.sectionTitle}>
            <FontAwesome5 name="calendar-alt" size={18} color="#4c669f" style={styles.sectionIcon} />
            Timeline
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Start Date</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker('start')}
            >
              <FontAwesome5 name="calendar" size={18} color="#4c669f" style={styles.inputIcon} />
              <Text style={styles.dateText}>{formatDate(planData.startDate)}</Text>
              <FontAwesome5 name="chevron-down" size={16} color="#4c669f" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Target End Date</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker('end')}
            >
              <FontAwesome5 name="calendar-check" size={18} color="#4c669f" style={styles.inputIcon} />
              <Text style={styles.dateText}>{formatDate(planData.endDate)}</Text>
              <FontAwesome5 name="chevron-down" size={16} color="#4c669f" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.infoContainer}>
            <FontAwesome5 name="info-circle" size={16} color="#4c669f" />
            <Text style={styles.infoText}>
              Setting realistic timeframes helps you achieve your financial goals more effectively.
            </Text>
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
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.submitButton}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <>
                <FontAwesome5 name="save" size={18} color="#ffffff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Create Saving Plan</Text>
              </>
            )}
          </LinearGradient>
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
  headerGradient: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 50 : 24,
  },
  headerContainer: {
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    color: '#e0e0e0',
    textAlign: 'center',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    marginLeft: 12,
    flex: 1,
    fontWeight: '500',
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eafaf1',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2ecc71',
  },
  successText: {
    color: '#2ecc71',
    marginLeft: 12,
    fontWeight: '500',
    fontSize: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#4c669f',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  typeButtonActive: {
    backgroundColor: '#4c669f',
    borderColor: '#4c669f',
  },
  typeButtonText: {
    color: '#4c669f',
    fontWeight: '600',
    marginLeft: 10,
    fontSize: 16,
  },
  typeButtonTextActive: {
    color: '#ffffff',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    color: '#5d6d7e',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dcdfe6',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
  },
  inputIcon: {
    marginHorizontal: 12,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#2c3e50',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#dcdfe6',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#f8fafc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
    marginLeft: 6,
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f4ff',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'flex-start',
  },
  infoText: {
    color: '#4c669f',
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
  },
  submitButton: {
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
    shadowColor: '#4c669f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 17,
  },
  buttonIcon: {
    marginRight: 10,
  },
  cancelButton: {
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    backgroundColor: '#ffffff',
  },
  cancelButtonText: {
    color: '#5d6d7e',
    fontWeight: '500',
    fontSize: 16,
  },
});