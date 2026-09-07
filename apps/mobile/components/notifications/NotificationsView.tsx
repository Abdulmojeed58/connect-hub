import React from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';
import type { Notification } from '../../types';

export function NotificationsView() {
  const { data, isLoading, isRefetching, refetch } = useNotifications();
  const notifications = data?.notifications ?? [];

  if (isLoading) return <LoadingSpinner />;

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: Notification }) => (
          <NotificationItem notification={item} />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="notifications-outline"
            message="No notifications"
            subMessage="You'll see activity here"
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#0D51B2"
          />
        }
      />
    </View>
  );
}
