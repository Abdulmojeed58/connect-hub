import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';
import { useAuthStore } from '../../store/auth.store';
import { useProfile } from '../../hooks/useProfile';
import { useConnections, useSentConnections, usePendingConnections } from '../../hooks/useConnections';
import { connectionApi } from '../../api/connection.api';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { ExperienceCard } from './ExperienceCard';
import { EducationCard } from './EducationCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { Connection } from '../../types';

interface UserProfileViewProps {
  userId: string;
}

export function UserProfileView({ userId }: UserProfileViewProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((s) => s.userId) ?? '';

  const { data: profile, isLoading, isRefetching, refetch } = useProfile(userId);
  const { data: connectionsData } = useConnections();
  const { data: sentData } = useSentConnections();
  const { data: pendingData } = usePendingConnections();

  const isOwnProfile = userId === currentUserId;

  const sentRequest = (sentData?.requests ?? []).find((c) => c.addresseeId === userId);
  const receivedRequest = (pendingData?.requests ?? []).find((c) => c.requesterId === userId);
  const isConnected = (connectionsData?.connections ?? []).some(
    (c) => c.requesterId === userId || c.addresseeId === userId,
  );
  const connection = isConnected
    ? (connectionsData?.connections ?? []).find(
        (c) => c.requesterId === userId || c.addresseeId === userId,
      )
    : undefined;

  const connectionStatus = isConnected
    ? ('connected' as const)
    : sentRequest
    ? ('sent' as const)
    : receivedRequest
    ? ('received' as const)
    : ('none' as const);

  const [actionLoading, setActionLoading] = React.useState(false);

  const handleConnect = async () => {
    setActionLoading(true);
    try {
      const newConnection = await connectionApi.sendRequest(userId);
      queryClient.setQueryData<{ requests: Connection[] }>(['connections-sent'], (old: { requests: Connection[] } | undefined) =>
        old ? { requests: [...old.requests, newConnection] } : { requests: [newConnection] },
      );
      toast.success('Connection request sent');
    } catch {
      toast.error('Failed to send request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!sentRequest) return;
    setActionLoading(true);
    try {
      await connectionApi.remove(sentRequest.id);
      queryClient.setQueryData<{ requests: Connection[] }>(['connections-sent'], (old: { requests: Connection[] } | undefined) =>
        old ? { requests: old.requests.filter((c: Connection) => c.id !== sentRequest.id) } : old,
      );
      toast.success('Request withdrawn');
    } catch {
      toast.error('Failed to withdraw request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!receivedRequest) return;
    setActionLoading(true);
    try {
      await connectionApi.accept(receivedRequest.id);
      queryClient.invalidateQueries({ queryKey: ['connections-pending'] });
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      toast.success(`Connected with ${profile?.fullName ?? 'user'}`);
    } catch {
      toast.error('Failed to accept request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!receivedRequest) return;
    setActionLoading(true);
    try {
      await connectionApi.decline(receivedRequest.id);
      queryClient.invalidateQueries({ queryKey: ['connections-pending'] });
      toast.success('Request declined');
    } catch {
      toast.error('Failed to decline request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemove = () => {
    if (!connection) return;
    Alert.alert(
      'Remove Connection',
      `Are you sure you want to remove ${profile?.fullName ?? 'this user'} from your connections?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setActionLoading(true);
            try {
              await connectionApi.remove(connection.id);
              queryClient.invalidateQueries({ queryKey: ['connections'] });
              toast.success('Connection removed');
            } catch {
              toast.error('Failed to remove connection');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ],
    );
  };

  if (isLoading) return <LoadingSpinner />;
  if (!profile) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-500">Profile not found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header bar */}
      <View
        className="bg-white flex-row items-center px-4 pt-14 pb-4"
        style={{ borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}
      >
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text className="text-gray-900 text-lg font-bold flex-1" numberOfLines={1}>
          {profile.fullName}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#0D51B2" />}
      >
        {/* Profile header card */}
        <View className="bg-white px-6 pt-6 pb-5 border-b border-gray-100">
          <View className="items-center mb-4">
            <Avatar name={profile.fullName} photoUrl={profile.photoUrl} size="xl" />
            <Text className="text-gray-900 text-xl font-bold mt-3">{profile.fullName}</Text>
            {profile.headline && (
              <Text className="text-gray-500 text-base mt-1 text-center">{profile.headline}</Text>
            )}
            {profile.location && (
              <Text className="text-gray-400 text-sm mt-1">{profile.location}</Text>
            )}
            {profile.bio && (
              <Text className="text-gray-600 text-sm mt-3 text-center leading-5">{profile.bio}</Text>
            )}
          </View>

          {!isOwnProfile && (
            <>
              {connectionStatus === 'connected' ? (
                <View style={{ gap: 8 }}>
                  <Button title="Connected" variant="secondary" disabled />
                  <Button title="Remove Connection" variant="outline" onPress={handleRemove} loading={actionLoading} />
                </View>
              ) : connectionStatus === 'sent' ? (
                <Button title="Withdraw Request" variant="outline" onPress={handleWithdraw} loading={actionLoading} />
              ) : connectionStatus === 'received' ? (
                <View className="flex-row" style={{ gap: 8 }}>
                  <Button title="Accept" variant="primary" onPress={handleAccept} loading={actionLoading} className="flex-1" />
                  <Button title="Decline" variant="outline" onPress={handleDecline} loading={actionLoading} className="flex-1" />
                </View>
              ) : (
                <Button title="Connect" onPress={handleConnect} loading={actionLoading} />
              )}
            </>
          )}
        </View>

        {/* Experience */}
        <View className="px-4 pt-6">
          <Text className="text-gray-900 text-lg font-bold mb-3">Experience</Text>
          {profile.experiences.length === 0 ? (
            <Text className="text-gray-400 text-sm mb-4">No experience added yet.</Text>
          ) : (
            profile.experiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} isOwnProfile={false} />
            ))
          )}
        </View>

        {/* Education */}
        <View className="px-4 pt-4 pb-10">
          <Text className="text-gray-900 text-lg font-bold mb-3">Education</Text>
          {profile.educations.length === 0 ? (
            <Text className="text-gray-400 text-sm mb-4">No education added yet.</Text>
          ) : (
            profile.educations.map((edu) => (
              <EducationCard key={edu.id} education={edu} isOwnProfile={false} />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
