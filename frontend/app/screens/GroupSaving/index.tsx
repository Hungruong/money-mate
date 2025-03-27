import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from 'react';
import { GroupSavingStackParamList } from "../../navigation/GroupSavingNavigator";

type GroupSavingScreenNavigationProp = StackNavigationProp<GroupSavingStackParamList, 'GroupSavingHome' | 'PlanDetails'| 'GroupHome'>;

export interface SavingPlan {
  planId: string;
  planType: string; // Individual or Group
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  createdAt: string; // ISO date string
}
const API_URL = 'http://localhost:8084/api/saving-plans';
export default function GroupSavingScreen() {
  const navigation = useNavigation<GroupSavingScreenNavigationProp>();
  const [plans, setPlans] = useState<SavingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch saving plans from backend
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch saving plans');
      const data = await response.json();
      setPlans(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Load plans when screen focuses
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchPlans);
    return unsubscribe;
  }, [navigation]);

  // Handle plan press
  const handlePlanPress = (planId: string) => {
    navigation.navigate('GroupHome', { planId });
    //navigation.navigate('GroupHome');
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate progress percentage
  const getProgressPercentage = (plan: SavingPlan) => {
    return (plan.currentAmount / plan.targetAmount) * 100;
  };

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 50 }}>
        <Text style={styles.title}>Your Saving Plans</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={plans}
          keyExtractor={(item) => item.planId}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.planItem}
              onPress={() => handlePlanPress(item.planId)}
            >
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{item.name}</Text>
                <Text style={styles.planType}>{item.planType}</Text>
              </View>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${Math.min(getProgressPercentage(item), 100)}%` }
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  ${item.currentAmount.toFixed(2)} of ${item.targetAmount.toFixed(2)}
                </Text>
              </View>

              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>Start: {formatDate(item.startDate)}</Text>
                <Text style={styles.dateText}>End: {formatDate(item.endDate)}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No saving plans found. Create your first plan!</Text>
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('GroupCreate')}
        >
          <Text style={styles.buttonText}>Create new saving plan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContent: {
    flexGrow: 1,
  },
  planItem: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  planType: {
    fontSize: 14,
    color: '#6c757d',
    textTransform: 'capitalize',
  },
  progressContainer: {
    marginVertical: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e9ecef',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'right',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  dateText: {
    fontSize: 12,
    color: '#6c757d',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 50,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#6c757d',
  },
});