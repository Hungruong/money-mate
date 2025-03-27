import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Button, 
  Image, 
  TouchableOpacity, 
  StyleSheet,
  Modal,
  TextInput,
  FlatList
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { GroupSavingStackParamList } from "../../navigation/GroupSavingNavigator";
import Icon from 'react-native-vector-icons/MaterialIcons';

type GroupSavingScreenNavigationProp = StackNavigationProp<GroupSavingStackParamList, 'GroupSavingHome'>;

interface Friend {
  id: string;
  name: string;
  avatar: any; // Would be URI in a real app
}

export default function GroupHome() {
  const navigation = useNavigation<GroupSavingScreenNavigationProp>();
  const [isInviteModalVisible, setInviteModalVisible] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');
  const [friends, setFriends] = useState<Friend[]>([
    { id: '1', name: 'Alex Johnson', avatar: require("../../../assets/images/icon.png") },
    { id: '2', name: 'Sam Wilson', avatar: require("../../../assets/images/icon.png") },
    { id: '3', name: 'Taylor Smith', avatar: require("../../../assets/images/icon.png") },
  ]);

  const handleAddFriend = () => {
    if (newFriendName.trim()) {
      const newFriend: Friend = {
        id: Date.now().toString(),
        name: newFriendName,
        avatar: require("../../../assets/images/icon.png")
      };
      setFriends([...friends, newFriend]);
      setNewFriendName('');
      setInviteModalVisible(false);
    }
  };

  const renderFriendItem = ({ item }: { item: Friend }) => (
    <View style={styles.friendCard}>
      <Image style={styles.avatar} source={item.avatar} />
      <Text style={styles.friendName}>{item.name}</Text>
      <View style={styles.friendActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('GroupMemProfile')}
        >
          <Icon name="visibility" size={20} color="#4a86e8" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('GroupMemberRemove')}
        >
          <Icon name="edit" size={20} color="#4a86e8" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Savings Group</Text>
        <Text style={styles.groupName}>Vacation Fund 2023</Text>
      </View>

      {/* Group Admin Section */}
      <View style={styles.adminSection}>
        <View style={styles.adminInfo}>
          <Image style={styles.adminAvatar} source={require("../../../assets/images/icon.png")} />
          <Text style={styles.adminName}>You (Admin)</Text>
        </View>
        <Icon name="info-outline" size={24} color="#666" />
      </View>

      {/* Members List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Group Members ({friends.length})</Text>
        <FlatList
          data={friends}
          renderItem={renderFriendItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        <TouchableOpacity 
          style={[styles.actionButtonLarge, styles.inviteButton]}
          onPress={() => setInviteModalVisible(true)}
        >
          <Icon name="person-add" size={24} color="white" />
          <Text style={styles.actionButtonText}>Invite Friend</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButtonLarge}
          onPress={() => navigation.navigate('SetRule')}
        >
          <Icon name="rule" size={24} color="#4a86e8" />
          <Text style={[styles.actionButtonText, {color: '#4a86e8'}]}>View/Edit Rules</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButtonLarge}
          onPress={() => navigation.navigate('SetGoal')}
        >
          <Icon name="flag" size={24} color="#4a86e8" />
          <Text style={[styles.actionButtonText, {color: '#4a86e8'}]}>Set Goal</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButtonLarge, styles.deleteButton]}
          onPress={() => navigation.navigate('GroupDelete')}
        >
          <Icon name="delete" size={24} color="white" />
          <Text style={[styles.actionButtonText, {color: 'white'}]}>Delete Group</Text>
        </TouchableOpacity>
      </View>

      {/* Invite Friend Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isInviteModalVisible}
        onRequestClose={() => setInviteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Invite New Friend</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter friend's email"
              value={newFriendName}
              onChangeText={setNewFriendName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setInviteModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddFriend}
              >
                <Text style={styles.modalButtonText}>Add Friend</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
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
  },
  adminSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  adminInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  adminName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  friendName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  friendActions: {
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
  inviteButton: {
    backgroundColor: '#4a86e8',
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