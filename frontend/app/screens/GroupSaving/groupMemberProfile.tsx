import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

// Types
type RootStackParamList = {
  MemberProfile: { userId: string; planId: string };
};

interface Contribution {
  contributionId: string;
  planId: string;
  userId: string;
  amount: number;
  note?: string;
  contributionDate: string;
}

type MemberProfileScreenRouteProp = RouteProp<RootStackParamList, 'MemberProfile'>;
type MemberProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MemberProfile'>;

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  joinDate: string;
}

const API_BASE_URL = 'http://localhost:8084/api';
const USER_API_URL = 'http://localhost:8082/api/users';

// Theme colors
const COLORS = {
  primary: '#4A6FFF',
  primaryDark: '#3652CC',
  primaryLight: '#EAF0FF',
  secondary: '#FF6B6B',
  accent: '#5FDCAB',
  accentDark: '#38B986',
  background: '#F8FAFF',
  card: '#FFFFFF',
  text: '#2D3748',
  textSecondary: '#6B7280',
  textLight: '#94A3B8',
  border: '#E2E8F0',
  error: '#F56565',
};

const MemberProfileScreen = () => {
  const route = useRoute<MemberProfileScreenRouteProp>();
  const navigation = useNavigation<MemberProfileScreenNavigationProp>();
  const { userId, planId } = route.params;

  const [member, setMember] = useState<Member | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalContributed, setTotalContributed] = useState<number>(0);

  useEffect(() => {
    const fetchMemberData = async () => {
      setLoading(true);
      try {
        const memberRes = await fetch(`${USER_API_URL}/${userId}`);
        if (!memberRes.ok) throw new Error('Failed to fetch member data');

        const memberData = await memberRes.json();
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    const fetchContributions = async () => {
      try {
        const contributionsRes = await fetch(`${API_BASE_URL}/contributions/plan/${planId}/user/${userId}`);
        if (!contributionsRes.ok) throw new Error('Failed to fetch contributions');

        const contributionsData = await contributionsRes.json();
        setContributions(contributionsData);
        
        // Calculate total contributions
        const total = contributionsData.reduce((sum: number, contribution: Contribution) => 
          sum + contribution.amount, 0);
        setTotalContributed(total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred while fetching contributions');
      }
    };

    fetchMemberData();
    fetchContributions();
  }, [userId, planId]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading member profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={60} color={COLORS.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={handleBackPress} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!member) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="person-off" size={60} color={COLORS.error} />
        <Text style={styles.errorText}>Member not found</Text>
        <TouchableOpacity onPress={handleBackPress} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.card} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Member Profile</Text>
        <View style={styles.headerRightPlaceholder} />
      </LinearGradient>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCardContainer}>
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              {member.avatarUrl ? (
                <Image source={{ uri: member.avatarUrl }} style={styles.avatar} />
              ) : (
                <LinearGradient
                  colors={[COLORS.secondary, COLORS.primaryDark]}
                  style={[styles.avatar, styles.placeholderAvatar]}
                >
                  <Text style={styles.placeholderText}>
                    {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                  </Text>
                </LinearGradient>
              )}
              <View style={styles.profileInfo}>
                <Text style={styles.name}>
                  {member.firstName} {member.lastName}
                </Text>
                <View style={styles.badgeContainer}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Active Member</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatCurrency(totalContributed)}</Text>
                <Text style={styles.statLabel}>Total Contributed</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{contributions.length}</Text>
                <Text style={styles.statLabel}>Contributions</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailItem}>
              <View style={styles.iconContainer}>
                <Icon name="email" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Email Address</Text>
                <Text style={styles.detailValue}>{member.email}</Text>
              </View>
            </View>

            {member.phoneNumber && (
              <View style={styles.detailItem}>
                <View style={styles.iconContainer}>
                  <Icon name="phone" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Phone Number</Text>
                  <Text style={styles.detailValue}>{member.phoneNumber}</Text>
                </View>
              </View>
            )}

            <View style={styles.detailItem}>
              <View style={styles.iconContainer}>
                <Icon name="event" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Member Since</Text>
                <Text style={styles.detailValue}>
                  {new Date(member.joinDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Contribution History</Text>
            <TouchableOpacity style={styles.sectionAction}>
              <Text style={styles.sectionActionText}>View All</Text>
              <Icon name="chevron-right" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.contributionsCard}>
            {contributions.length > 0 ? (
              contributions.map((contribution, index) => (
                <View 
                  key={contribution.contributionId} 
                  style={[
                    styles.contributionItem,
                    index === contributions.length - 1 && styles.lastContributionItem
                  ]}
                >
                  <View style={styles.contributionHeader}>
                    <View style={styles.contributionDate}>
                      <Icon name="calendar-today" size={14} color={COLORS.textSecondary} style={styles.miniIcon} />
                      <Text style={styles.contributionDateText}>
                        {new Date(contribution.contributionDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Text>
                    </View>
                    <Text style={styles.contributionAmount}>
                      {formatCurrency(contribution.amount)}
                    </Text>
                  </View>
                  
                  {contribution.note && (
                    <View style={styles.contributionNote}>
                      <Icon name="comment" size={14} color={COLORS.textSecondary} style={styles.miniIcon} />
                      <Text style={styles.contributionNoteText}>{contribution.note}</Text>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <View style={styles.emptyStateContainer}>
                <Icon name="hourglass-empty" size={40} color={COLORS.textLight} />
                <Text style={styles.emptyStateText}>No contributions yet</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.primaryButton}>
            <Icon name="message" size={18} color={COLORS.card} style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Message</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton}>
            <Icon name="edit" size={18} color={COLORS.primary} style={styles.buttonIcon} />
            <Text style={styles.secondaryButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.card,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerRightPlaceholder: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
    marginVertical: 16,
    textAlign: 'center',
  },
  profileCardContainer: {
    marginTop: -20,
    paddingHorizontal: 16,
  },
  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginRight: 16,
    borderWidth: 3,
    borderColor: COLORS.card,
  },
  placeholderAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
    color: COLORS.card,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  badge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 10,
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  sectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionActionText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginRight: 4,
  },
  detailsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 4,
    elevation: 2,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: COLORS.text,
  },
  contributionsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contributionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  lastContributionItem: {
    borderBottomWidth: 0,
  },
  contributionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  contributionDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contributionDateText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  contributionAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  contributionNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  contributionNoteText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  miniIcon: {
    marginRight: 6,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    marginTop: 12,
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingHorizontal: 16,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginRight: 8,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  primaryButtonText: {
    color: COLORS.card,
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default MemberProfileScreen;