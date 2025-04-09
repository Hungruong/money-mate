import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  StyleSheet,
  Modal,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GroupSavingStackParamList } from '../../navigation/GroupSavingNavigator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

// Constants
const API_BASE_URL = 'http://localhost:8084/api';
const USER_API_URL = 'http://localhost:8082/api/users';
const SAVING_API_URL = `${API_BASE_URL}/saving-plans`;
const MEMBER_API_URL = `${API_BASE_URL}/saving-members`;
const CONTRIBUTION_API_URL = `${API_BASE_URL}/contributions`;
const { width } = Dimensions.get('window');

// Types
type GroupHomeScreenRouteProp = RouteProp<GroupSavingStackParamList, 'GroupHome'>;
type GroupSavingScreenNavigationProp = StackNavigationProp<GroupSavingStackParamList, 'GroupSavingHome'>;

interface Member {
  id: string;
  planId: string;
  userId: string;
  role: string;
  name: string;
  email: string;
  avatar?: string;
}

interface GroupData {
  planId: string;
  name: string;
  members: Member[];
  rules?: string;
  currentAmount: number;
  targetAmount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

interface ProgressBarProps {
  progress: number;
}
interface Contribution {
  contributionId: string;
  planId: string;
  userId: string;
  amount: string;
  note?: string;
  user?:{
    firstName:string;
    lastName:string;
    avatar?:string;
  }
}


/**
 * GroupHome component - Displays detailed information about a group saving plan
 */
export default function GroupHome() {
  const navigation = useNavigation<GroupSavingScreenNavigationProp>();
  const route = useRoute<GroupHomeScreenRouteProp>();
  const { planId } = route.params;
  
  // State management
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInviteModalVisible, setInviteModalVisible] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberActionModalVisible, setMemberActionModalVisible] = useState(false);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  /**
   * Fetches group data and member information
   */
  const fetchGroupData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch group details
      const groupResponse = await fetch(`${SAVING_API_URL}/${planId}`);
      if (!groupResponse.ok) throw new Error('Failed to fetch group data');
      const groupData = await groupResponse.json();
          
      // Fetch group members
      const membersResponse = await fetch(`${MEMBER_API_URL}?planId=${planId}`);
      if (!membersResponse.ok) throw new Error('Failed to fetch group members');
      const membersData = await membersResponse.json();
      
      // Fetch user details for each member
      const membersWithDetails = await Promise.all(
        membersData.map(async (member: any) => {
          try {
            const userResponse = await fetch(`${USER_API_URL}/${member.userId}`);
            if (!userResponse.ok) {
              return {
                ...member,
                name: 'Unknown User',
                email: 'unknown@email.com'
              };
            }
            const userData = await userResponse.json();
            return {
              ...member,
              name: `${userData.firstName || 'Unknown'} ${userData.lastName || 'User'}`,
              email: userData.email || 'unknown@email.com',
              avatar: userData.avatar
            };
          } catch (error) {
            return {
              ...member,
              name: 'Unknown User',
              email: 'unknown@email.com'
            };
          }
        })
      );
      
      //Fetch plan's all contributions
      const contributionsResponse = await fetch(`${CONTRIBUTION_API_URL}/plan/${planId}`);
      if (!contributionsResponse.ok) throw new Error('Failed to fetch contributions');
      //const contributionsData = await contributionsResponse.json();
      let contributionsData = await contributionsResponse.json();
      contributionsData = await Promise.all(
        contributionsData.map(async (contribution: any) => {
          try {
            const userResponse = await fetch(`${USER_API_URL}/${contribution.userId}`);
            if (!userResponse.ok) {
              return contribution;
            }
            const userData = await userResponse.json();
            return {
              ...contribution,
              user: {
                firstName: userData.firstName,
                lastName: userData.lastName,
                avatar: userData.avatar
              }
            };
          } catch (error) {
            return contribution;
          }
        })
      );

      setGroupData({
        ...groupData,
        members: membersWithDetails
      });
      setContributions(contributionsData);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      Alert.alert('Error', 'Failed to load group data');
    } finally {
      setLoading(false);
    }
  }, [planId]);

  useEffect(() => {
    fetchGroupData();
  }, [fetchGroupData]);

  /**
   * Handles adding a new member to the group
   */
  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }
  
    setIsProcessing(true);
    try {
      // Find user by email
      const userResponse = await fetch(
        `${USER_API_URL}/email?email=${encodeURIComponent(newMemberEmail)}`
      );
      
      if (!userResponse.ok) throw new Error('User not found');
      const userData = await userResponse.json();
  
      // Prepare request URL with parameters
      const url = new URL(`${MEMBER_API_URL}`);
      url.searchParams.append('planId', planId);
      url.searchParams.append('userId', userData.userId);
      url.searchParams.append('role', 'Member');
  
      // Add user to saving plan
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add member');
      }
  
      // Success handling
      await fetchGroupData();
      setNewMemberEmail('');
      setInviteModalVisible(false);
      Alert.alert('Success', 'Member added successfully');
  
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add member');
    } finally {
      setIsProcessing(false);
    }
  };



  /**
   * Handles removing a member from the group
   */
  const handleDeleteMember = async (userId: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(
        `${MEMBER_API_URL}?planId=${planId}&userId=${userId}`,
        { method: 'DELETE' }
      );
      
      if (!response.ok) {
        throw new Error('Failed to remove member');
      }
      
      await fetchGroupData();
      Alert.alert('Success', 'Member removed successfully');
      setMemberActionModalVisible(false);
      
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to remove member');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Handles changing a member's role
   */
  const handleChangeRole = async (userId: string, newRole: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${MEMBER_API_URL}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          userId,
          role: newRole
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to change role');
      }
      
      await fetchGroupData();
      Alert.alert('Success', `Role changed to ${newRole}`);
      setMemberActionModalVisible(false);
      
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to change role');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMemberOptions = (member: Member) => {
    setSelectedMember(member);
    setMemberActionModalVisible(true);
  };

  /**
   * Formats a number as currency
   */
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };


  /**
   * Returns gradient colors based on progress value
   */
  const getProgressColor = (progress: number) => {
    if (progress < 0.3) return ['#FF416C', '#FF4B2B']; // Red
    if (progress < 0.7) return ['#F09819', '#EDDE5D']; // Yellow/Orange
    return ['#56ab2f', '#a8e063']; // Green
  };

  /**
   * Renders a single member item in the list
   */
  const renderMemberItem = ({ item }: { item: Member }) => (
    <TouchableOpacity 
      style={styles.memberCard}
      onPress={() => handleMemberOptions(item)}
      disabled={isProcessing}
    >
      <Image 
        style={styles.avatar} 
        source={item.avatar ? { uri: item.avatar } : require("../../../assets/images/icon.png")} 
      />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>
          {item.name} 
          {item.role === 'ADMIN' && <Text style={styles.adminBadge}> Admin</Text>}
        </Text>
        <Text style={styles.memberEmail}>{item.email}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#bbb" />
    </TouchableOpacity>
  );

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a86e8" />
        <Text style={styles.loadingText}>Loading group data...</Text>
      </View>
    );
  }

  // Error state
  if (error || !groupData) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={60} color="#e74c3c" />
        <Text style={styles.errorText}>Failed to load group data</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchGroupData}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Calculate progress and days left
  const progressPercentage = (groupData.currentAmount / groupData.targetAmount) * 100;
  const progressColors = getProgressColor(progressPercentage / 100);
  const timeLeft = new Date(groupData.endDate).getTime() - new Date().getTime();
  const daysLeft = Math.max(0, Math.ceil(timeLeft / (1000 * 60 * 60 * 24)));
  
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <LinearGradient
        colors={['#4a86e8', '#2a56b8']}
        style={styles.header}
      >
        <Text style={styles.title}>{groupData.name}</Text>
        
        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.amountRow}>
            <View style={styles.amountBlock}>
              <Text style={styles.amountLabel}>Current</Text>
              <Text style={styles.amountValue}>{formatCurrency(groupData.currentAmount)}</Text>
            </View>
            <View style={styles.amountDivider} />
            <View style={styles.amountBlock}>
              <Text style={styles.amountLabel}>Target</Text>
              <Text style={styles.amountValue}>{formatCurrency(groupData.targetAmount)}</Text>
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <LinearGradient
              colors={progressColors}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={[styles.progressFill, {
                width: `${Math.min(100, progressPercentage)}%`
              }]}
            />
          </View>
          
          <View style={styles.progressDetails}>
            <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}% Complete</Text>
            <Text style={styles.daysLeft}>{daysLeft} days left</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Contributions List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>List of Contributions</Text>
        {contributions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="attach-money" size={40} color="#ccc" />
            <Text style={styles.emptyText}>No contributions yet</Text>
          </View>
        ) : (
        <FlatList
          data={contributions}
          keyExtractor={(item) => item.contributionId}
          renderItem={({ item }) => (
            <View style={styles.contributionCard}>
              <View style={styles.contributionHeader}>
                <Image 
                  style={styles.contributionAvatar} 
                  source={item.user?.avatar ? { uri: item.user.avatar } : require("../../../assets/images/icon.png")} 
                />
                <Text style={styles.contributionUser}>
                  {item.user ? `${item.user.firstName} ${item.user.lastName}` : 'Unknown User'}
                </Text>
              </View>
              <View style={styles.contributionDetails}>
                <Text style={styles.contributionAmount}>Amount: ${item.amount}</Text>
                {item.note && (
                  <Text style={styles.contributionNote}>Note: {item.note}</Text>
                )}
              </View>
            </View>
          )}
        />
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('SetGoal', { planId })}
        >
          <View style={[styles.actionIcon, {backgroundColor: '#4a86e8'}]}>
            <Icon name="flag" size={20} color="white" />
          </View>
          <Text style={styles.quickActionText}>Update Goal</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('SetRule', { planId })}
        >
          <View style={[styles.actionIcon, {backgroundColor: '#f39c12'}]}>
            <Icon name="rule" size={20} color="white" />
          </View>
          <Text style={styles.quickActionText}>Group Rules</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('Contribute', { planId })}
      
        >
          <View style={[styles.actionIcon, {backgroundColor: '#2ecc71'}]}>
            <Icon name="attach-money" size={20} color="white" />
          </View>
          <Text style={styles.quickActionText}>Contribute</Text>
        </TouchableOpacity>
      </View>

      {/* Members List */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Group Members ({groupData.members.length})
          </Text>
          <TouchableOpacity 
            style={styles.addMemberButton}
            onPress={() => setInviteModalVisible(true)}
            disabled={isProcessing}
          >
            <Icon name="person-add" size={16} color="white" />
            <Text style={styles.addMemberText}>Add Member</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={groupData.members}
          renderItem={renderMemberItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="group" size={40} color="#ccc" />
              <Text style={styles.emptyText}>No members yet. Invite some friends!</Text>
            </View>
          }
        />
      </View>

      {/* Action Button */}
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => navigation.navigate('GroupDelete', { planId })}
        disabled={isProcessing}
      >
        <Icon name="delete" size={20} color="white" />
        <Text style={styles.buttonText}>Delete Group</Text>
      </TouchableOpacity>

      {/* Invite Member Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isInviteModalVisible}
        onRequestClose={() => !isProcessing && setInviteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Invite New Member</Text>
              <TouchableOpacity 
                onPress={() => !isProcessing && setInviteModalVisible(false)}
                disabled={isProcessing}
              >
                <Icon name="close" size={24} color="#999" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter member's email"
                value={newMemberEmail}
                onChangeText={setNewMemberEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isProcessing}
              />
            </View>
            
            <TouchableOpacity 
              style={[styles.modalButton, isProcessing && styles.disabledButton]}
              onPress={handleAddMember}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.modalButtonText}>Send Invitation</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Member Actions Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={memberActionModalVisible}
        onRequestClose={() => !isProcessing && setMemberActionModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => !isProcessing && setMemberActionModalVisible(false)}
        >
          <View 
            style={styles.actionSheet}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <View style={styles.actionSheetHandle} />
            
            {selectedMember && (
              <>
                <View style={styles.selectedMemberHeader}>
                  <Image 
                    style={styles.selectedMemberAvatar} 
                    source={selectedMember.avatar ? { uri: selectedMember.avatar } : require("../../../assets/images/icon.png")} 
                  />
                  <View>
                    <Text style={styles.selectedMemberName}>{selectedMember.name}</Text>
                    <Text style={styles.selectedMemberEmail}>{selectedMember.email}</Text>
                  </View>
                </View>

                <View style={styles.actionOptions}>
                  {selectedMember.role === 'ADMIN' ? (
                    <TouchableOpacity 
                      style={styles.actionOption}
                      onPress={() => handleChangeRole(selectedMember.userId, 'MEMBER')}
                      disabled={isProcessing}
                    >
                      <Icon name="star-half" size={24} color="#f39c12" />
                      <Text style={styles.actionOptionText}>Change to Member</Text>
                    </TouchableOpacity>
                  ) : (
                    <>
                      <TouchableOpacity 
                        style={styles.actionOption}
                        onPress={() => handleChangeRole(selectedMember.userId, 'ADMIN')}
                        disabled={isProcessing}
                      >
                        <Icon name="star" size={24} color="#f39c12" />
                        <Text style={styles.actionOptionText}>View Profile</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.actionOption}
                        onPress={() => handleDeleteMember(selectedMember.userId)}
                        disabled={isProcessing}
                      >
                        <Icon name="delete" size={24} color="#e74c3c" />
                        <Text style={[styles.actionOptionText, {color: '#e74c3c'}]}>Remove from Group</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </>
            )}
            
            <TouchableOpacity 
              style={styles.closeActionSheet}
              onPress={() => !isProcessing && setMemberActionModalVisible(false)}
              disabled={isProcessing}
            >
              <Text style={styles.closeActionSheetText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountBlock: {
    flex: 1,
    alignItems: 'center',
  },
  amountDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
  },
  amountLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginVertical: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  daysLeft: {
    fontSize: 14,
    color: '#666',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: -16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  addMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a86e8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addMemberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  memberEmail: {
    fontSize: 14,
    color: '#666',
  },
  adminBadge: {
    color: '#f39c12',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    marginTop: 8,
    color: '#999',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginVertical: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: width * 0.85,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  modalBody: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: '#4a86e8',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  actionSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    paddingBottom: 32,
  },
  actionSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  selectedMemberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedMemberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  selectedMemberName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  selectedMemberEmail: {
    fontSize: 14,
    color: '#666',
  },
  actionOptions: {
    marginTop: 16,
  },
  actionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionOptionText: {
    fontSize: 16,
    marginLeft: 16,
    color: '#333',
  },
  closeActionSheet: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  closeActionSheetText: {
    fontSize: 16,
    color: '#4a86e8',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    marginVertical: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4a86e8',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  listItemCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contributionText: {
    fontSize: 14,
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contributionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  contributionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contributionAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  contributionUser: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  contributionDetails: {
    marginLeft: 40, // To align with avatar
  },
  contributionAmount: {
    fontSize: 14,
    color: '#333',
  },
  contributionNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },

  
});