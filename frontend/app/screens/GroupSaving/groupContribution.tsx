import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { GroupSavingStackParamList } from "@/app/navigation/GroupSavingNavigator";
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';


type GroupHomeScreenRouteProp = RouteProp<GroupSavingStackParamList, 'GroupHome'>;

type ContributeStackParamList = {
  GroupHome: undefined;
  Contribute: { planId: string };
  Payment: { amount: string; planId: string }; 
};

type ContributeScreenNavigationProp = StackNavigationProp<
  ContributeStackParamList,
  'Contribute'
>;

const COLORS = {
  primary: '#4f46e5',
  primaryGradient: ['#4f46e5', '#6366f1'] as [string, string],
  secondary: '#ec4899',
  secondaryGradient: ['#ec4899', '#f472b6'] as [string, string],
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#0ea5e9',
  light: '#f3f4f6',
  dark: '#111827',
  white: '#ffffff',
  background: '#f9fafb',
  cardBg: '#ffffff',
  text: {
    primary: '#111827',
    secondary: '#4b5563',
    tertiary: '#9ca3af',
    light: '#ffffff',
  },
  border: '#e5e7eb',
};

export default function Contribute() {
  const navigation = useNavigation<ContributeScreenNavigationProp>();
  const route = useRoute<GroupHomeScreenRouteProp>();
  const { planId } = route.params;
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');

  const handleAmountChange = (text: string) => {
    const cleanedText = text.replace(/[^0-9.]/g, '');
    const decimalParts = cleanedText.split('.');
    if (decimalParts.length > 2) return;
    if (decimalParts.length === 2 && decimalParts[1].length > 2) return;
    setAmount(cleanedText);
  };

  const handleConfirm = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    //const userId = '122e4567-e89b-12d3-a456-426614174000'; // Replace with actual user ID

    try {
      const response = await axios.post('http://localhost:8084/api/contributions',null, {
        params: {
          planId,
          userId:'122e4567-e89b-12d3-a456-426614174000',
          amount: parseFloat(amount),
          note,
        },
      });

      console.log('Contribution submitted, now navigate to the payment form:', response.data);
      alert(`Contribution of $${amount} submitted!`);

      
      // Reset form and navigate back
      setAmount('');
      setNote('');

      
      navigation.navigate('Payment', { amount, planId });
      
    } catch (error) {
      console.error('Error submitting contribution:', error);
      alert('Failed to submit contribution. Please try again.');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <LinearGradient
          colors={COLORS.primaryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Make a Contribution</Text>
            <Text style={styles.subtitle}>Add to your group savings</Text>
          </View>
        </LinearGradient>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.currencyInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={COLORS.text.tertiary}
                value={amount}
                onChangeText={handleAmountChange}
                keyboardType="decimal-pad"
                returnKeyType="done"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Note (Optional)</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="Add a note about this contribution..."
              placeholderTextColor={COLORS.text.tertiary}
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
          >
            <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={handleConfirm}
            disabled={!amount || parseFloat(amount) <= 0}
          >
            <LinearGradient
              colors={!amount || parseFloat(amount) <= 0 
                ? [COLORS.text.tertiary, COLORS.text.tertiary] 
                : COLORS.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Go to</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  currencyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    height: 56,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text.primary,
    height: '100%',
  },
  noteInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    backgroundColor: COLORS.white,
    fontSize: 16,
    color: COLORS.text.primary,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 30,
    marginTop: 20,
  },
  button: {
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
  },
  cancelButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 12,
  },
  confirmButton: {
    flex: 1,
    overflow: 'hidden',
  },
  gradientButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  cancelButtonText: {
    color: COLORS.text.secondary,
  },
});


