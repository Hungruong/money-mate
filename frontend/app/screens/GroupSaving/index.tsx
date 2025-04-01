import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Dimensions, SafeAreaView, StatusBar } from "react-native";
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from 'react';
import { GroupSavingStackParamList } from "../../navigation/GroupSavingNavigator";
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';

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
const { width } = Dimensions.get('window');
const COLUMN_NUM = 2;
const ITEM_WIDTH = (width - 48) / COLUMN_NUM; // 48 = padding on both sides + gap between items

export default function GroupSavingScreen() {
  const navigation = useNavigation<GroupSavingScreenNavigationProp>();
  const [plans, setPlans] = useState<SavingPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<SavingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlanType, setSelectedPlanType] = useState<'All' | 'Individual' | 'Group'>('All');

  // Fetch saving plans from backend
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch saving plans');
      const data = await response.json();
      setPlans(data);
      filterPlans(data, selectedPlanType);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Filter plans based on selected type
  const filterPlans = (plansToFilter: SavingPlan[], type: 'All' | 'Individual' | 'Group') => {
    if (type === 'All') {
      setFilteredPlans(plansToFilter);
    } else {
      setFilteredPlans(plansToFilter.filter(plan => plan.planType === type));
    }
  };

  // Handle plan type change
  const handlePlanTypeChange = (type: 'All' | 'Individual' | 'Group') => {
    setSelectedPlanType(type);
    filterPlans(plans, type);
  };

  // Load plans when screen focuses
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchPlans);
    return unsubscribe;
  }, [navigation]);

  // Handle plan press
  const handlePlanPress = (planId: string) => {
    navigation.navigate('GroupHome', { planId });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate progress percentage
  const getProgressPercentage = (plan: SavingPlan) => {
    return (plan.currentAmount / plan.targetAmount) * 100;
  };

  // Render plan item 
  const renderPlanItem = ({ item }: { item: SavingPlan }) => {
    const progressPercentage = getProgressPercentage(item);
    const isPlanCompleted = progressPercentage >= 100;
    
    return (
      <TouchableOpacity 
        style={[styles.planCard, { width: ITEM_WIDTH }]}
        onPress={() => handlePlanPress(item.planId)}
        activeOpacity={0.7}
      >
        <View style={styles.planCardContent}>
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>{item.planType}</Text>
          </View>
          
          <Text style={styles.planName} numberOfLines={1}>{item.name}</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar,
                  { width: `${Math.min(progressPercentage, 100)}%` },
                  isPlanCompleted && styles.completedProgressBar
                ]}
              />
            </View>
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressPercentage}>
                {progressPercentage.toFixed(0)}%
              </Text>
              <Text style={styles.progressAmount}>
                ${item.currentAmount.toFixed(0)} / ${item.targetAmount.toFixed(0)}
              </Text>
            </View>
          </View>
          
          <View style={styles.dateInfo}>
            <Text style={styles.dateLabel}>Due date</Text>
            <Text style={styles.dateValue}>{formatDate(item.endDate)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f9fc" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Saving Plans</Text>
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Filter:</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedPlanType}
                onValueChange={(itemValue) => handlePlanTypeChange(itemValue)}
                style={styles.picker}
                dropdownIconColor="#5e72e4"
              >
                <Picker.Item label="All Plans" value="All" />
                <Picker.Item label="Individual" value="Individual" />
                <Picker.Item label="Group" value="Group" />
              </Picker>
            </View>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#5e72e4" style={styles.loader} />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchPlans}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredPlans}
            keyExtractor={(item) => item.planId}
            renderItem={renderPlanItem}
            numColumns={COLUMN_NUM}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No saving plans found</Text>
                <Text style={styles.emptySubtext}>Create your first saving plan to get started</Text>
              </View>
            }
          />
        )}

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('GroupCreate')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#5e72e4', '#825ee4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Create New Plan</Text>
            </LinearGradient>
          </TouchableOpacity>
          

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginTop: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1f36',
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#525f7f',
    marginRight: 10,
  },
  pickerWrapper: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 44,
  },
  listContent: {
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  planCard: {
    height: 180,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  planCardContent: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  planBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#ebf4ff',
    marginBottom: 8,
  },
  planBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4c6ef5',
  },
  planName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1f36',
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#ebecf0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#5e72e4',
    borderRadius: 4,
  },
  completedProgressBar: {
    backgroundColor: '#2dce89',
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5e72e4',
  },
  progressAmount: {
    fontSize: 12,
    color: '#8898aa',
    fontWeight: '500',
  },
  dateInfo: {
    borderTopWidth: 1,
    borderTopColor: '#f6f9fc',
    paddingTop: 10,
  },
  dateLabel: {
    fontSize: 12,
    color: '#8898aa',
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#525f7f',
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
  createButton: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#5e72e4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  deleteButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  deleteButtonText: {
    color: '#f5365c',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#f5365c',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#5e72e4',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#525f7f',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8898aa',
    textAlign: 'center',
  },
});