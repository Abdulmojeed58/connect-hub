import { useState } from 'react';
import { useCurrentUser } from '@/hooks/useAuth';
import { useUsers } from '@/hooks/useUsers';
import { useConnections, useSentRequests } from '@/hooks/useConnections';
import { Button } from '@/components/ui/button';
import { UserCard } from '@/components/people/UserCard';

export function PeopleGrid() {
  const [page, setPage] = useState(1);
  const { data: me } = useCurrentUser();
  const { data, isLoading } = useUsers(page);
  const { data: connectionsData } = useConnections();
  const { data: sentData } = useSentRequests();

  const connectedIds = new Set(
    (connectionsData?.connections ?? []).flatMap((c) =>
      [c.requesterId, c.addresseeId],
    ),
  );

  // Map of addresseeId → connectionId for pending-sent requests
  const sentMap = new Map(
    (sentData?.requests ?? []).map((c) => [c.addresseeId, c.id]),
  );

  const getStatus = (userId: string): 'none' | 'pending' | 'connected' => {
    if (connectedIds.has(userId)) return 'connected';
    if (sentMap.has(userId)) return 'pending';
    return 'none';
  };

  const others = (data?.users ?? []).filter((u) => u.id !== me?.user.id);
  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">People</h1>
        {data && <p className="text-sm text-muted-foreground">{data.total} members</p>}
      </div>
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : others.length === 0 ? (
        <p className="text-center text-muted-foreground">No other members yet.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {others.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              connectionStatus={getStatus(user.id)}
              pendingConnectionId={sentMap.get(user.id)}
            />
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
