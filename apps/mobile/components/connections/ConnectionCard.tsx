import React from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { useRemoveConnection } from '../../hooks/useConnections';
import type { Connection } from '../../types';

interface ConnectionCardProps {
  connection: Connection;
  currentUserId: string;
}

export function ConnectionCard({ connection, currentUserId }: ConnectionCardProps) {
  const removeConnection = useRemoveConnection();
  const router = useRouter();
  const other =
    connection.requesterId === currentUserId ? connection.addressee : connection.requester;
  const profile = other.profile;
  const name = profile?.fullName ?? other.email;

  const handleRemove = () => {
    Alert.alert(
      'Remove Connection',
      `Are you sure you want to remove ${name} from your connections?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeConnection.mutate(connection.id),
        },
      ],
    );
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3 flex-row items-center"
      activeOpacity={0.7}
      onPress={() => router.push(`/profile/${other.id}`)}
    >
      <Avatar name={name} photoUrl={profile?.photoUrl} size="md" />
      <View className="flex-1 ml-3">
        <Text className="text-gray-900 font-semibold text-base">{name}</Text>
        {profile?.headline && (
          <Text className="text-gray-500 text-sm mt-0.5" numberOfLines={1}>
            {profile.headline}
          </Text>
        )}
      </View>
      <Button
        title="Remove"
        variant="outline"
        onPress={handleRemove}
        loading={removeConnection.isPending}
        className="ml-2 py-2 px-3"
      />
    </TouchableOpacity>
  );
}
