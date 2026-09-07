import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Notification, NotificationType } from '../../types';

interface NotificationItemProps {
  notification: Notification;
}

const iconMap: Record<NotificationType, { name: keyof typeof Ionicons.glyphMap; color: string }> = {
  CONNECTION_REQUEST: { name: 'person-add-outline', color: '#0D51B2' },
  CONNECTION_ACCEPTED: { name: 'checkmark-circle-outline', color: '#16A34A' },
  CONNECTION_DECLINED: { name: 'close-circle-outline', color: '#DC2626' },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'Just now';
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const iconConfig = iconMap[notification.type];

  return (
    <View
      className={`flex-row items-start p-4 border-b border-gray-100 ${
        notification.isRead ? 'bg-white' : 'bg-blue-50'
      }`}
    >
      <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3 mt-0.5">
        <Ionicons name={iconConfig.name} size={20} color={iconConfig.color} />
      </View>
      <View className="flex-1">
        <Text className="text-gray-800 text-sm leading-5">{notification.message}</Text>
        <Text className="text-gray-400 text-xs mt-1">{timeAgo(notification.createdAt)}</Text>
      </View>
      {!notification.isRead && (
        <View className="w-2 h-2 rounded-full bg-primary mt-2 ml-2" />
      )}
    </View>
  );
}
