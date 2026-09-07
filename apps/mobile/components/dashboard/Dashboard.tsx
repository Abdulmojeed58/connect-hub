import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/auth.store';
import { useProfile } from '../../hooks/useProfile';
import { useConnections, usePendingConnections } from '../../hooks/useConnections';
import { useNotifications } from '../../hooks/useNotifications';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface StatCardProps {
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  children: React.ReactNode;
}

function StatCard({ title, iconName, onPress, children }: StatCardProps) {
  return (
    <TouchableOpacity
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-3"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm font-medium text-gray-500">{title}</Text>
        <Ionicons name={iconName} size={18} color="#6B7280" />
      </View>
      {children}
    </TouchableOpacity>
  );
}

export function Dashboard() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.userId) ?? '';

  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useProfile(userId);
  const { data: connectionsData, refetch: refetchConnections } = useConnections();
  const { data: pendingData, refetch: refetchPending } = usePendingConnections();
  const { data: notificationsData, refetch: refetchNotifications } = useNotifications();

  const connectionCount = connectionsData?.connections.length ?? 0;
  const pendingCount = pendingData?.requests.length ?? 0;
  const unreadCount = notificationsData?.notifications.filter((n) => !n.isRead).length ?? 0;

  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchProfile(), refetchConnections(), refetchPending(), refetchNotifications()]);
    setIsRefreshing(false);
  };

  if (profileLoading) return <LoadingSpinner />;

  const name = profile?.fullName ?? '—';

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#0D51B2" />
      }
    >
      {/* Profile Summary Card */}
      <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5">
        <View className="flex-row items-start gap-3">
          <Avatar name={name} photoUrl={profile?.photoUrl} size="lg" />
          <View className="flex-1 ml-3">
            <View className="flex-row items-center flex-wrap gap-2">
              <Text className="text-lg font-semibold text-gray-900">{name}</Text>
              {profile?.isPremium && (
                <View className="bg-primary rounded px-2 py-0.5">
                  <Text className="text-white text-xs font-semibold">Premium</Text>
                </View>
              )}
            </View>
            <Text className="text-sm text-gray-500 mt-0.5">
              {profile?.headline ?? 'Add a headline to your profile'}
            </Text>
          </View>
        </View>

        <View className="border-t border-gray-100 mt-4 pt-4">
          <Button
            title="View Profile"
            variant="outline"
            onPress={() => router.push('/(tabs)/profile')}
            className="self-start py-2 px-4"
          />
        </View>
      </View>

      {/* Stats Cards */}
      <StatCard
        title="Connections"
        iconName="link-outline"
        onPress={() => router.push('/(tabs)/connections')}
      >
        <Text className="text-3xl font-bold text-gray-900">{connectionCount}</Text>
        {pendingCount > 0 && (
          <Text className="mt-1 text-xs text-primary font-medium">
            {pendingCount} pending request{pendingCount > 1 ? 's' : ''}
          </Text>
        )}
      </StatCard>

      <StatCard
        title="Browse People"
        iconName="people-outline"
        onPress={() => router.push('/(tabs)/people')}
      >
        <Text className="text-sm text-gray-500">Discover and connect with professionals</Text>
      </StatCard>

      <StatCard
        title="Notifications"
        iconName="notifications-outline"
        onPress={() => router.push('/(tabs)/notifications')}
      >
        {unreadCount > 0 ? (
          <Text className="text-sm text-primary font-medium">{unreadCount} unread</Text>
        ) : (
          <Text className="text-sm text-gray-500">All caught up</Text>
        )}
      </StatCard>
    </ScrollView>
  );
}
