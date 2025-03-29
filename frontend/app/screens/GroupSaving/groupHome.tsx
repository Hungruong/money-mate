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
  ActivityIndicator
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { GroupSavingStackParamList } from "../../navigation/GroupSavingNavigator";
import Icon from 'react-native-vector-icons/MaterialIcons';
const SAVING_API_URL = 'http://localhost:8084/api/saving-plans';
const MEMBER_API_URL = 'http://localhost:8084/api/saving-members';
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
      
      // Fetch user details for each member (assuming you have a separate user service)
      const membersWithDetails = await Promise.all(
        membersData.map(async (member: any) => {
          try {
            const userResponse = await fetch(`http://localhost:8084/api/users/${member.userId}`);
            if (!userResponse.ok) return {
              ...member,
              name: 'Unknown User',
              email: 'unknown@email.com'
            };
            const userData = await userResponse.json();
            return {
              ...member,
              name: userData.name || 'Unknown User',
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
      // First find the user by email
      const userResponse = await fetch(
        `http://localhost:8084/api/users?email=${encodeURIComponent(newMemberEmail)}`
      );
      if (!userResponse.ok) throw new Error('User not found');
      const userData = await userResponse.json();
      
      // Then add them to the saving plan
      const response = await fetch(MEMBER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          userId: userData.id,
          role: 'MEMBER'
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add member');
      }
      
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
      
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to change role');
    } finally {
      setIsProcessing(false);
    }
  };
  const renderMemberItem = ({ item }: { item: Member }) => (
    <View style={styles.memberCard}>
      <Image 
        style={styles.avatar} 
        source={item.avatar ? { uri: item.avatar } : require("../../../assets/images/icon.png")} 
      />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>
          {item.name} {item.role === 'ADMIN' && '(Admin)'}
        </Text>
        <Text style={styles.memberEmail}>{item.email}</Text>
      </View>
      <View style={styles.memberActions}>
        {item.role === 'ADMIN' ? (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleChangeRole(item.userId, 'MEMBER')}
            disabled={isProcessing}
          >
            <Icon name="star-half" size={20} color="#f39c12" />
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleChangeRole(item.userId, 'ADMIN')}
              disabled={isProcessing}
            >
              <Icon name="star" size={20} color="#f39c12" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleDeleteMember(item.userId)}
              disabled={isProcessing}
            >
              <Icon name="delete" size={20} color="#e74c3c" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a86e8" />
        <Text>Loading group data...</Text>
      </View>
    );
  }

  if (error || !groupData) {
    return (
      <View style={styles.errorContainer}>
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

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Savings Group</Text>
        <Text style={styles.groupName}>{groupData.name}</Text>
        
        {/* Progress Section */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            ${groupData.currentAmount} of ${groupData.targetAmount} saved
            ({Math.round((groupData.currentAmount / groupData.targetAmount) * 100)}%)
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, {
              width: `${Math.min(100, (groupData.currentAmount / groupData.targetAmount) * 100)}%`
            }]} />
          </View>
        </View>
      </View>

      {/* Members List */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Group Members ({groupData.members.length})
          </Text>
          <TouchableOpacity 
            onPress={() => setInviteModalVisible(true)}
            disabled={isProcessing}
          >
            <Icon name="person-add" size={24} color="#4a86e8" />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={groupData.members}
          renderItem={renderMemberItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No members yet. Invite some friends!</Text>
          }
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        <TouchableOpacity 
          style={[styles.actionButtonLarge]}
          onPress={() => navigation.navigate('SetRule', { planId })}
          disabled={isProcessing}
        >
          <Icon name="rule" size={24} color="#4a86e8" />
          <Text style={[styles.actionButtonText, {color: '#4a86e8'}]}>View/Edit Rules</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButtonLarge}
          onPress={() => navigation.navigate('SetGoal', { planId })}
          disabled={isProcessing}
        >
          <Icon name="flag" size={24} color="#4a86e8" />
          <Text style={[styles.actionButtonText, {color: '#4a86e8'}]}>Set Goal</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButtonLarge, styles.deleteButton]}
          onPress={() => navigation.navigate('GroupDelete', { planId })}
          disabled={isProcessing}
        >
          <Icon name="delete" size={24} color="white" />
          <Text style={[styles.actionButtonText, {color: 'white'}]}>Delete Group</Text>
        </TouchableOpacity>
      </View>

      {/* Invite Member Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isInviteModalVisible}
        onRequestClose={() => !isProcessing && setInviteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Invite New Member</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter member's email"
              value={newMemberEmail}
              onChangeText={setNewMemberEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isProcessing}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => !isProcessing && setInviteModalVisible(false)}
                disabled={isProcessing}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddMember}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.modalButtonText}>Invite</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4a86e8',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  groupName: {
    fontSize: 18,
    color: '#4a86e8',
    marginTop: 8,
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: 16,
    width: '100%',
  },
  progressText: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#666',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4a86e8',
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 12,
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
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 16,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    color: '#333',
    fontWeight: '500',
  },
  memberEmail: {
    fontSize: 14,
    color: '#666',
  },
  memberActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#ddd',
  },
  confirmButton: {
    backgroundColor: '#4a86e8',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});