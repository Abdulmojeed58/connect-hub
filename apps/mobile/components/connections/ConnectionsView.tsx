import React, { useState } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  useConnections,
  usePendingConnections,
  useSentConnections,
} from '../../hooks/useConnections';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuthStore } from '../../store/auth.store';
import { ConnectionCard } from './ConnectionCard';
import { PendingCard } from './PendingCard';
import { SearchBar } from '../people/SearchBar';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';
import { Avatar } from '../ui/Avatar';
import type { Connection } from '../../types';

type Tab = 'connections' | 'pending' | 'sent';

export function ConnectionsView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('connections');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const userId = useAuthStore((s) => s.userId) ?? '';

  const connectionsQuery = useConnections(
    activeTab === 'connections' ? debouncedSearch : undefined,
  );
  const pendingQuery = usePendingConnections(
    activeTab === 'pending' ? debouncedSearch : undefined,
  );
  const sentQuery = useSentConnections();

  const pendingCount = pendingQuery.data?.requests.length ?? 0;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'connections', label: 'Connected' },
    { key: 'pending', label: 'Pending' },
    { key: 'sent', label: 'Sent' },
  ];

  const renderConnectionItem = ({ item }: { item: Connection }) => (
    <ConnectionCard connection={item} currentUserId={userId} />
  );

  const renderPendingItem = ({ item }: { item: Connection }) => (
    <PendingCard connection={item} />
  );

  const renderSentItem = ({ item }: { item: Connection }) => {
    const addressee = item.addressee;
    const profile = addressee.profile;
    const name = profile?.fullName ?? addressee.email;
    return (
      <TouchableOpacity
        className="bg-white rounded-2xl p-4 mb-3 flex-row items-center"
        style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
        activeOpacity={0.7}
        onPress={() => router.push(`/profile/${addressee.id}`)}
      >
        <Avatar name={name} photoUrl={profile?.photoUrl} size="md" />
        <View className="flex-1 ml-3">
          <Text className="text-gray-900 font-semibold text-base">{name}</Text>
          {profile?.headline && (
            <Text className="text-gray-500 text-sm mt-0.5" numberOfLines={1}>{profile.headline}</Text>
          )}
        </View>
        <View className="bg-amber-50 rounded-full px-3 py-1.5" style={{ borderWidth: 1, borderColor: '#FCD34D' }}>
          <Text className="text-amber-600 text-xs font-semibold">Pending</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const showSearch = activeTab !== 'sent';
  const isLoading =
    activeTab === 'connections'
      ? connectionsQuery.isLoading
      : activeTab === 'pending'
      ? pendingQuery.isLoading
      : sentQuery.isLoading;

  const refetch =
    activeTab === 'connections'
      ? connectionsQuery.refetch
      : activeTab === 'pending'
      ? pendingQuery.refetch
      : sentQuery.refetch;

  const isRefetching =
    activeTab === 'connections'
      ? connectionsQuery.isRefetching
      : activeTab === 'pending'
      ? pendingQuery.isRefetching
      : sentQuery.isRefetching;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Tab Bar */}
      <View className="flex-row bg-white" style={{ borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => { setActiveTab(tab.key); setSearch(''); }}
            className="flex-1 py-3.5 items-center"
            style={{ borderBottomWidth: 2, borderBottomColor: activeTab === tab.key ? '#0D51B2' : 'transparent' }}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center" style={{ gap: 6 }}>
              <Text
                className="font-semibold text-sm"
                style={{ color: activeTab === tab.key ? '#0D51B2' : '#9CA3AF' }}
              >
                {tab.label}
              </Text>
              {tab.key === 'pending' && pendingCount > 0 && (
                <View className="bg-primary rounded-full w-4 h-4 items-center justify-center">
                  <Text className="text-white text-xs font-bold" style={{ fontSize: 9 }}>
                    {pendingCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View className="flex-1 px-4 pt-4">
        {showSearch && (
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder={`Search ${activeTab}...`}
          />
        )}

        {isLoading ? (
          <LoadingSpinner />
        ) : activeTab === 'connections' ? (
          <FlatList
            data={connectionsQuery.data?.connections ?? []}
            keyExtractor={(item) => item.id}
            renderItem={renderConnectionItem}
            ListEmptyComponent={
              <EmptyState icon="people-outline" message="No connections yet" subMessage="Start connecting with professionals" />
            }
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#0D51B2" />
            }
          />
        ) : activeTab === 'pending' ? (
          <FlatList
            data={pendingQuery.data?.requests ?? []}
            keyExtractor={(item) => item.id}
            renderItem={renderPendingItem}
            ListEmptyComponent={
              <EmptyState icon="time-outline" message="No pending requests" />
            }
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#0D51B2" />
            }
          />
        ) : (
          <FlatList
            data={sentQuery.data?.requests ?? []}
            keyExtractor={(item) => item.id}
            renderItem={renderSentItem}
            ListEmptyComponent={
              <EmptyState icon="send-outline" message="No sent requests" />
            }
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#0D51B2" />
            }
          />
        )}
      </View>
    </View>
  );
}
