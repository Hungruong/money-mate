import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Types
import { GroupSavingStackParamList } from '../../navigation/GroupSavingNavigator';

type GroupSavingScreenNavigationProp = StackNavigationProp<
  GroupSavingStackParamList, 
  'GroupSavingHome' | 'PlanDetails' | 'GroupHome' 
>;

export interface SavingPlan {
  planId: string;
  planType: string; // 'Individual' or 'Group'
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  createdAt: string; // ISO date string
}

// Constants
const API_URL = 'http://localhost:8084/api/saving-plans';
const HORIZONTAL_PADDING = 16;
const ITEM_MARGIN = 8;
const CARD_HEIGHT = 200; // Fixed card height as per original design

// Color Palette
const COLORS = {
  primary: '#4f46e5', // Deep indigo
  primaryGradient: ['#4f46e5', '#6366f1'],
  secondary: '#ec4899', // Pink
  secondaryGradient: ['#ec4899', '#f472b6'],
  success: '#10b981', // Emerald green
  danger: '#ef4444', // Red
  warning: '#f59e0b', // Amber
  info: '#0ea5e9', // Sky blue
  light: '#f3f4f6', // Light gray
  dark: '#111827', // Almost black
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
}

export default function GroupSavingScreen() {
  // Window dimensions
  const { width } = useWindowDimensions();
  
  // Responsive column calculation
  const getColumnCount = (screenWidth) => {
    if (screenWidth >= 768) return 3; // Tablet or larger devices
    if (screenWidth >= 480) return 2; // Larger phones
    return 1; // Smaller phones
  };
  
  const COLUMN_NUM = getColumnCount(width);
  const CONTAINER_PADDING = HORIZONTAL_PADDING * 2;
  const TOTAL_MARGIN = ITEM_MARGIN * (COLUMN_NUM - 1);
  const ITEM_WIDTH = (width - CONTAINER_PADDING - TOTAL_MARGIN) / COLUMN_NUM;

  // Navigation
  const navigation = useNavigation<GroupSavingScreenNavigationProp>();

  // State
  const [plans, setPlans] = useState<SavingPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<SavingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlanType, setSelectedPlanType] = useState<'All' | 'Individual' | 'Group'>('All');

  // Data fetching
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error('Failed to fetch saving plans');
      }
      
      const data = await response.json();
      setPlans(data);
      filterPlans(data, selectedPlanType);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Plan filtering
  const filterPlans = (plansToFilter: SavingPlan[], type: 'All' | 'Individual' | 'Group') => {
    setFilteredPlans(
      type === 'All' 
        ? plansToFilter 
        : plansToFilter.filter(plan => plan.planType === type)
    );
  };

  const handlePlanTypeChange = (type: 'All' | 'Individual' | 'Group') => {
    setSelectedPlanType(type);
    filterPlans(plans, type);
  };

  // Event handlers
  const handlePlanPress = (planId: string) => {
    navigation.navigate('GroupHome', { planId });
  };

  // Helpers
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getProgressPercentage = (plan: SavingPlan) => {
    return (plan.currentAmount / plan.targetAmount) * 100;
  };

  const getPlanTypeStyles = (planType: string) => {
    switch (planType) {
      case 'Individual':
        return {
          bgColor: '#ede9fe', // Light purple
          textColor: '#7c3aed', // Purple
          icon: 'person'
        };
      case 'Group':
        return {
          bgColor: '#dcfce7', // Light green
          textColor: '#16a34a', // Green
          icon: 'people'
        };
      default:
        return {
          bgColor: '#e0f2fe', // Light blue
          textColor: '#0284c7', // Blue
          icon: 'cash'
        };
    }
  };

  // Component rendering
  const renderPlanItem = ({ item, index }: { item: SavingPlan; index: number }) => {
    const progressPercentage = getProgressPercentage(item);
    const isPlanCompleted = progressPercentage >= 100;
    const planTypeStyle = getPlanTypeStyles(item.planType);
    
    // Calculate due days
    const dueDate = new Date(item.endDate);
    const today = new Date();
    const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysRemaining < 0;
    
    // Calculate margin based on column position
    const marginRight = (index % COLUMN_NUM) !== (COLUMN_NUM - 1) ? ITEM_MARGIN : 0;
    
    return (
      <TouchableOpacity 
        style={[
          styles.planCard, 
          { 
            width: ITEM_WIDTH,
            height: CARD_HEIGHT, // Use fixed height
            marginRight: marginRight,
          }
        ]}
        onPress={() => handlePlanPress(item.planId)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.9)']}
          style={styles.cardGradient}
        >
          <View style={styles.planCardContent}>
            <View style={[styles.planBadge, { backgroundColor: planTypeStyle.bgColor }]}>
              <Ionicons name={planTypeStyle.icon} size={12} color={planTypeStyle.textColor} style={styles.badgeIcon} />
              <Text style={[styles.planBadgeText, { color: planTypeStyle.textColor }]}>
                {item.planType}
              </Text>
            </View>
            
            <Text style={styles.planName} numberOfLines={1}>
              {item.name}
            </Text>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBarContainer}>
                <LinearGradient
                  colors={isPlanCompleted ? ['#10b981', '#34d399'] : ['#4f46e5', '#6366f1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.progressBar,
                    { width: `${Math.min(progressPercentage, 100)}%` },
                  ]}
                />
              </View>
              <View style={styles.progressTextContainer}>
                <Text style={[
                  styles.progressPercentage,
                  { color: isPlanCompleted ? COLORS.success : COLORS.primary }
                ]}>
                  {progressPercentage.toFixed(0)}%
                </Text>
                <Text style={styles.progressAmount}>
                  ${item.currentAmount.toLocaleString()} / ${item.targetAmount.toLocaleString()}
                </Text>
              </View>
            </View>
            
            <View style={styles.dateInfo}>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={14} color={COLORS.text.secondary} />
                <Text style={styles.dateLabel}>Due date</Text>
              </View>
              <View style={styles.dateValueContainer}>
                <Text style={[
                  styles.dateValue,
                  isOverdue && styles.overdueText
                ]}>
                  {formatDate(item.endDate)}
                </Text>
                {isOverdue ? (
                  <Text style={styles.daysOverdue}>
                    {Math.abs(daysRemaining)} days overdue
                  </Text>
                ) : (
                  <Text style={styles.daysRemaining}>
                    {daysRemaining} days left
                  </Text>
                )}
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  // Filter toggle buttons instead of dropdown
  const renderFilterButtons = () => {
    const filters = [
      { label: 'All Plans', value: 'All' },
      { label: 'Individual', value: 'Individual' },
      { label: 'Group', value: 'Group' },
    ];

    return (
      <View style={styles.filterButtonsContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            style={[
              styles.filterButton,
              selectedPlanType === filter.value && styles.filterButtonActive,
            ]}
            onPress={() => handlePlanTypeChange(filter.value as 'All' | 'Individual' | 'Group')}
          >
            <Text 
              style={[
                styles.filterButtonText,
                selectedPlanType === filter.value && styles.filterButtonTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Effects
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchPlans);
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.container}>
        {/* Header with Statistics */}
        <LinearGradient
          colors={COLORS.primaryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.welcomeText}>Hello, Saver!</Text>
                <Text style={styles.title}>Saving Plans</Text>
              </View>
              <TouchableOpacity 
                style={styles.profileButton}
                onPress={() => navigation.navigate("Profile")}
              >
                <Ionicons name="person-circle" size={40} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>${plans.reduce((sum, plan) => sum + plan.currentAmount, 0).toLocaleString()}</Text>
                <Text style={styles.statLabel}>Total Saved</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{plans.length}</Text>
                <Text style={styles.statLabel}>Active Plans</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Filter Section */}
        <View style={styles.filtersSection}>
          <Text style={styles.sectionTitle}>Browse Plans</Text>
          {renderFilterButtons()}
        </View>

        {/* Content Section */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading your saving plans...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="cloud-offline" size={60} color={COLORS.danger} style={styles.errorIcon} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={fetchPlans}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredPlans}
            keyExtractor={(item) => item.planId}
            renderItem={renderPlanItem}
            numColumns={COLUMN_NUM}
            key={`column-${COLUMN_NUM}`} // Force re-render when column count changes
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="wallet-outline" size={60} color={COLORS.text.tertiary} style={styles.emptyIcon} />
                <Text style={styles.emptyText}>No saving plans found</Text>
                <Text style={styles.emptySubtext}>
                  Create your first saving plan to get started
                </Text>
              </View>
            }
          />
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('GroupCreate')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={COLORS.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Ionicons name="add-circle-outline" size={20} color={COLORS.white} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Create New Plan</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  // Layout
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  
  // Header
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  profileButton: {
    borderRadius: 20,
    padding: 2,
  },
  
  // Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  
  // Filters Section
  filtersSection: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 8,
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
  filterButtonTextActive: {
    color: COLORS.white,
  },
  
  // List
  listContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBottom: 100,
  },
  
  // Plan Card
  planCard: {
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 20,
  },
  planCardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 10,
  },
  badgeIcon: {
    marginRight: 4,
  },
  planBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  planName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  
  // Progress
  progressContainer: {
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.light,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 10,
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressAmount: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  
  // Dates
  dateInfo: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginLeft: 4,
  },
  dateValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  overdueText: {
    color: COLORS.danger,
  },
  daysRemaining: {
    fontSize: 11,
    color: COLORS.info,
    fontWeight: '500',
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#e0f2fe',
    borderRadius: 10,
  },
  daysOverdue: {
    fontSize: 11,
    color: COLORS.danger,
    fontWeight: '500',
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#fee2e2',
    borderRadius: 10,
  },
  
  // Actions
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  createButton: {
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientButton: {
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  buttonIcon: {
    marginRight: 8,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  
  // Error
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  errorIcon: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.danger,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Empty
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.text.tertiary,
    textAlign: 'center',
  },
});