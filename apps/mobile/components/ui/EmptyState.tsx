import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  message: string;
  subMessage?: string;
}

export function EmptyState({
  icon = 'mail-outline',
  message,
  subMessage,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-16 px-6">
      <Ionicons name={icon} size={48} color="#9CA3AF" />
      <Text className="text-gray-500 text-lg font-medium mt-4 text-center">{message}</Text>
      {subMessage && (
        <Text className="text-gray-400 text-sm mt-2 text-center">{subMessage}</Text>
      )}
    </View>
  );
}
