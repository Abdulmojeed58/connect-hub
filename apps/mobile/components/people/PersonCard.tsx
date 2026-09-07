import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { connectionApi } from '../../api/connection.api';
import type { Connection, PublicUser } from '../../types';

interface PersonCardProps {
  user: PublicUser;
  currentUserId: string;
  connectionStatus?: 'pending' | 'accepted' | 'incoming';
  pendingConnectionId?: string;
}

export function PersonCard({ user, currentUserId, connectionStatus, pendingConnectionId }: PersonCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const profile = user.profile;
  const name = profile?.fullName ?? user.email;
  const isOwnProfile = user.id === currentUserId;

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const newConnection = await connectionApi.sendRequest(user.id);
      // Update cache immediately so the button changes without waiting for refetch
      queryClient.setQueryData<{ requests: Connection[] }>(['connections-sent'], (old: { requests: Connection[] } | undefined) =>
        old ? { requests: [...old.requests, newConnection] } : { requests: [newConnection] },
      );
      toast.success(`Request sent to ${profile?.fullName ?? 'user'}`);
    } catch {
      toast.error('Failed to send connection request.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!pendingConnectionId) return;
    setIsLoading(true);
    try {
      await connectionApi.remove(pendingConnectionId);
      // Remove from cache immediately
      queryClient.setQueryData<{ requests: Connection[] }>(['connections-sent'], (old: { requests: Connection[] } | undefined) =>
        old ? { requests: old.requests.filter((c: Connection) => c.id !== pendingConnectionId) } : old,
      );
      toast.success('Request withdrawn.');
    } catch {
      toast.error('Failed to withdraw request.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderButton = () => {
    if (isOwnProfile) return null;

    if (connectionStatus === 'accepted') {
      return (
        <Button title="Connected" variant="secondary" disabled className="ml-2 py-2 px-3" />
      );
    }

    if (connectionStatus === 'pending') {
      return (
        <Button
          title={isLoading ? 'Withdrawing…' : 'Withdraw'}
          variant="outline"
          onPress={handleWithdraw}
          loading={isLoading}
          className="ml-2 py-2 px-3"
        />
      );
    }

    if (connectionStatus === 'incoming') {
      return (
        <Button title="Respond" variant="secondary" disabled className="ml-2 py-2 px-3" />
      );
    }

    return (
      <Button
        title="Connect"
        variant="primary"
        onPress={handleConnect}
        loading={isLoading}
        className="ml-2 py-2 px-3"
      />
    );
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3 flex-row items-center"
      activeOpacity={0.7}
      onPress={() => router.push(`/profile/${user.id}`)}
    >
      <Avatar name={name} photoUrl={profile?.photoUrl} size="md" />
      <View className="flex-1 ml-3">
        <Text className="text-gray-900 font-semibold text-base">{name}</Text>
        {profile?.headline && (
          <Text className="text-gray-500 text-sm mt-0.5" numberOfLines={1}>
            {profile.headline}
          </Text>
        )}
        {profile?.location && (
          <Text className="text-gray-400 text-xs mt-0.5">{profile.location}</Text>
        )}
      </View>
      {renderButton()}
    </TouchableOpacity>
  );
}
