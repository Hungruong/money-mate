import React, { useEffect, useState } from 'react';
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
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { GroupSavingStackParamList } from "../../navigation/GroupSavingNavigator";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

const SAVING_API_URL = 'http://localhost:8084/api/saving-plans';
const MEMBER_API_URL = 'http://localhost:8084/api/saving-members';
const { width } = Dimensions.get('window');

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

export default function GroupHome() {
  const navigation = useNavigation<GroupSavingScreenNavigationProp>();
  const route = useRoute<GroupHomeScreenRouteProp>();
  const { planId } = route.params;
  
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInviteModalVisible, setInviteModalVisible] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberActionModalVisible, setMemberActionModalVisible] = useState(false);

  const fetchGroupData = async () => {
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
            const userResponse = await fetch(`http://localhost:8082/api/users/${member.userId}`);
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
              name: `${userData.firstName || 'Unknown'} ${userData.lastName || 'User'}`, // Concatenate first and last name
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
      
      setGroupData({
        ...groupData,
        members: membersWithDetails
      });
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      Alert.alert('Error', 'Failed to load group data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupData();
  }, [planId]);

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }
  
    setIsProcessing(true);
    try {
      // 1. Find user by email
      const userResponse = await fetch(
        `http://localhost:8082/api/users/email?email=${encodeURIComponent(newMemberEmail)}`
      );
      
      if (!userResponse.ok) throw new Error('User not found');
      const userData = await userResponse.json();
  
      // 2. Log the data before sending
      const url = new URL('http://localhost:8084/api/saving-members');
      url.searchParams.append('planId', planId);
      url.searchParams.append('userId', userData.userId);
      url.searchParams.append('role', 'Member');
      console.log("Final URL:", url.toString());
  
      // 3. Add user to saving plan
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add if your API requires auth:
          // 'Authorization': `Bearer ${token}`
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error response:", errorData); // Log full error
        throw new Error(errorData.message || 'Failed to add member');
      }
  
      // Success handling
      await fetchGroupData();
      setNewMemberEmail('');
      setInviteModalVisible(false);
      Alert.alert('Success', 'Member added successfully');
  
    } catch (error) {
      console.error("Full error details:", error); // Log complete error
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add member');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteMember = async (userId: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(
        `${MEMBER_API_URL}?planId=${planId}&userId=${userId}`,
        { method: 'DELETE' }
      );
      
      if (!response.ok) {
        throw new Error('Failed to delete member');
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

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const getProgressColor = (progress: number) => {
    if (progress < 0.3) return ['#FF416C', '#FF4B2B'];
    if (progress < 0.7) return ['#F09819', '#EDDE5D'];
    return ['#56ab2f', '#a8e063'];
  };

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
          {item.name} {item.role === 'ADMIN' && 
            <Text style={styles.adminBadge}>Admin</Text>
          }
        </Text>
        <Text style={styles.memberEmail}>{item.email}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#bbb" />
    </TouchableOpacity>
  );
  const logMemberDetails = async (member: Member) => {
    try {
      console.log('--- MEMBER DETAILS ---');
      console.log('Basic Member Info:', {
        id: member.id,
        planId: member.planId,
        role: member.role,
        //joinedAt: member.createdAt // Add if available
      });
  
      // Fetch fresh user data (in case it changed)
      const userResponse = await fetch(`http://localhost:8082/api/users/${member.userId}`);
      if (!userResponse.ok) throw new Error('Failed to fetch user details');
      
      const userData = await userResponse.json();
      console.log('User Profile Info:', {
        userId: member.userId,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        // Add any other user fields you want to log
        ...(userData.phone && { phone: userData.phone }),
        ...(userData.createdAt && { registeredAt: userData.createdAt })
      });
  
      console.log('Full Combined Data:', {
        ...member,
        userDetails: userData
      });
    } catch (error) {
      console.error('Error logging member details:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a86e8" />
        <Text style={styles.loadingText}>Loading group data...</Text>
      </View>
    );
  }

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
          onPress={() => { /* Navigate to contribution page */ }}
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
        style={[styles.deleteButton]}
        onPress={() => navigation.navigate('GroupDelete', { planId })}
        disabled={isProcessing}
      >
        <Icon name="delete" size={20} color="white" />
        <Text style={[styles.buttonText]}>Delete Group</Text>
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
                        <Text style={styles.actionOptionText}>Make Admin</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 18,
    marginVertical: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4a86e8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    padding: 24,
    paddingTop: 48,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  amountBlock: {
    flex: 1,
    alignItems: 'center',
  },
  amountDivider: {
    width: 1,
    backgroundColor: '#eee',
    marginHorizontal: 8,
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  quickActionButton: {
    alignItems: 'center',
    width: width / 3 - 20,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a86e8',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addMemberText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 12,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  adminBadge: {
    fontSize: 12,
    color: '#f39c12',
    fontWeight: 'bold',
  },
  memberEmail: {
    fontSize: 14,
    color: '#777',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  modalButton: {
    backgroundColor: '#4a86e8',
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#a0c0e8',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  actionSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 24,
  },
  actionSheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ddd',
    borderRadius: 3,
    marginVertical: 12,
    alignSelf: 'center',
  },
  selectedMemberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedMemberAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  selectedMemberName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  selectedMemberEmail: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  actionOptions: {
    paddingVertical: 12,
  },
  actionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  actionOptionText: {
    fontSize: 16,
    marginLeft: 16,
    color: '#333',
  },
  closeActionSheet: {
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 8,
  },
  closeActionSheetText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
});