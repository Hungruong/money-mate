// screens/MemberProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const API_BASE_URL = 'http://localhost:8084/api';
const USER_API_URL = 'http://localhost:8082/api/users';
const CONTRIBUTION_API_URL = `${API_BASE_URL}/contributions`;

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  joinDate: string;
};

interface Contribution {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  notes?: string;
  createdAt: string;
};

type RootStackParamList = {
  GroupHome: undefined;
  MemberProfile: { userId: string; planId: string };
};

type MemberProfileScreenRouteProp = RouteProp<RootStackParamList, 'MemberProfile'>;
type MemberProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MemberProfile'>;

type Props = {
  route: MemberProfileScreenRouteProp;
  navigation: MemberProfileScreenNavigationProp;
};

const MemberProfileScreen: React.FC<Props> = ({ route }) => {
  const { userId, planId } = route.params;
  const [member, setMember] = useState<Member | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch member details
        const memberResponse = await fetch(`${USER_API_URL}/${userId}`);
        if (!memberResponse.ok) {
          throw new Error('Failed to fetch member data');
        }
        
        const memberData = await memberResponse.json();
        
        // Validate member data structure
        if (!memberData.id || !memberData.firstName || !memberData.lastName || !memberData.email) {
          throw new Error('Invalid member data structure');
        }
        
        const validatedMember: Member = {
          id: memberData.id,
          firstName: memberData.firstName,
          lastName: memberData.lastName,
          email: memberData.email,
          phoneNumber: memberData.phoneNumber || undefined,
          avatarUrl: memberData.avatarUrl || undefined,
          joinDate: memberData.joinDate
        };
        
        setMember(validatedMember);

        // Fetch contributions
        const contributionsResponse = await fetch(
          `${CONTRIBUTION_API_URL}?userId=${userId}&planId=${planId}`
        );
        
        if (!contributionsResponse.ok) {
          throw new Error('Failed to fetch contributions');
        }
        
        const contributionsData = await contributionsResponse.json();
        
        // Validate contributions data structure
        if (!Array.isArray(contributionsData)) {
          throw new Error('Invalid contributions data format');
        }
        
        const validatedContributions = contributionsData.map(contribution => ({
          id: contribution.id,
          userId: contribution.userId,
          planId: contribution.planId,
          amount: Number(contribution.amount),
          notes: contribution.notes || undefined,
          createdAt: contribution.createdAt
        })).filter(contribution => 
          contribution.id && 
          contribution.userId && 
          contribution.planId && 
          !isNaN(contribution.amount) && 
          contribution.createdAt
        );
        
        setContributions(validatedContributions);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, planId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!member) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Member not found</Text>
      </View>
    );
  }

  const renderContributionItem = ({ item }: { item: Contribution }) => (
    <View style={styles.contributionItem}>
      <View style={styles.contributionHeader}>
        <Text style={styles.contributionAmount}>${item.amount.toFixed(2)}</Text>
        <Text style={styles.contributionDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      {item.notes && <Text style={styles.contributionNotes}>{item.notes}</Text>}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        {member.avatarUrl ? (
          <Image source={{ uri: member.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholderAvatar]}>
            <Text style={styles.placeholderText}>
              {member.firstName.charAt(0)}{member.lastName.charAt(0)}
            </Text>
          </View>
        )}
        <Text style={styles.name}>
          {member.firstName} {member.lastName}
        </Text>
        <Text style={styles.email}>{member.email}</Text>
        {member.phoneNumber && (
          <Text style={styles.phoneNumber}>{member.phoneNumber}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Member Since</Text>
        <Text style={styles.joinDate}>{new Date(member.joinDate).toLocaleDateString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contributions</Text>
        {contributions.length > 0 ? (
          <FlatList
            data={contributions}
            renderItem={renderContributionItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.noContributions}>No contributions yet</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
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
    color: 'red',
    fontSize: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  placeholderAvatar: {
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
    color: '#666',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  joinDate: {
    fontSize: 16,
    color: '#666',
  },
  contributionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    marginBottom: 8,
  },
  contributionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  contributionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  contributionDate: {
    fontSize: 14,
    color: '#666',
  },
  contributionNotes: {
    fontSize: 14,
    color: '#444',
    fontStyle: 'italic',
  },
  noContributions: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    padding: 16,
  },
});

export default MemberProfileScreen;