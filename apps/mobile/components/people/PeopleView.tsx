import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useUsers } from '../../hooks/useUsers';
import { useConnections, useSentConnections, usePendingConnections } from '../../hooks/useConnections';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuthStore } from '../../store/auth.store';
import { PersonCard } from './PersonCard';
import { SearchBar } from './SearchBar';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';
import type { PublicUser } from '../../types';

export function PeopleView() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const userId = useAuthStore((s) => s.userId) ?? '';

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = useUsers(debouncedSearch);

  const { data: sentData } = useSentConnections();
  const { data: connectionsData } = useConnections();
  const { data: pendingData } = usePendingConnections();

  const connectionMap = useMemo(() => {
    const map = new Map<string, { status: 'pending' | 'accepted' | 'incoming'; connectionId: string }>();
    sentData?.requests.forEach((c) => map.set(c.addresseeId, { status: 'pending', connectionId: c.id }));
    connectionsData?.connections.forEach((c) => {
      const otherId = c.requesterId === userId ? c.addresseeId : c.requesterId;
      map.set(otherId, { status: 'accepted', connectionId: c.id });
    });
    pendingData?.requests.forEach((c) => map.set(c.requesterId, { status: 'incoming', connectionId: c.id }));
    return map;
  }, [sentData, connectionsData, pendingData, userId]);

  const users = (data?.pages.flatMap((p) => p.users) ?? []).filter((u) => u.id !== userId);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = ({ item }: { item: PublicUser }) => {
    const conn = connectionMap.get(item.id);
    return (
      <PersonCard
        user={item}
        currentUserId={userId}
        connectionStatus={conn?.status}
        pendingConnectionId={conn?.status === 'pending' ? conn.connectionId : undefined}
      />
    );
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return <ActivityIndicator color="#0D51B2" style={{ paddingVertical: 16 }} />;
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 pt-4">
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search people..."
        />
      </View>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          extraData={connectionMap}
          contentContainerStyle={{ padding: 16, paddingTop: 0 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <EmptyState
              icon="people-outline"
              message="No people found"
              subMessage={search ? 'Try a different search term' : 'No members yet'}
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
      )}
    </View>
  );
}
