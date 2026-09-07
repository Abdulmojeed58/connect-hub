import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { useAcceptConnection, useDeclineConnection } from '../../hooks/useConnections';
import type { Connection } from '../../types';

interface PendingCardProps {
  connection: Connection;
}

export function PendingCard({ connection }: PendingCardProps) {
  const accept = useAcceptConnection();
  const decline = useDeclineConnection();
  const router = useRouter();
  const requester = connection.requester;
  const profile = requester.profile;
  const name = profile?.fullName ?? requester.email;

  return (
    <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3">
      <TouchableOpacity
        className="flex-row items-center mb-3"
        activeOpacity={0.7}
        onPress={() => router.push(`/profile/${requester.id}`)}
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
      </TouchableOpacity>
      <View className="flex-row gap-2">
        <Button
          title="Accept"
          variant="primary"
          onPress={() => accept.mutate(connection.id)}
          loading={accept.isPending}
          className="flex-1"
        />
        <Button
          title="Decline"
          variant="outline"
          onPress={() => decline.mutate(connection.id)}
          loading={decline.isPending}
          className="flex-1"
        />
      </View>
    </View>
  );
}
