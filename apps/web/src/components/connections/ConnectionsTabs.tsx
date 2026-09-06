import { useState } from 'react';
import { Search } from 'lucide-react';
import { useConnections, usePendingRequests } from '@/hooks/useConnections';
import { useCurrentUser } from '@/hooks/useAuth';
import { useDebounce } from '@/hooks/useDebounce';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConnectionRow } from '@/components/connections/ConnectionRow';
import { PendingRow } from '@/components/connections/PendingRow';

export function ConnectionsTabs() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const { data: me } = useCurrentUser();
  const { data: connectionsData, isLoading: loadingConnections } = useConnections(debouncedSearch || undefined);
  const { data: pendingData, isLoading: loadingPending } = usePendingRequests(debouncedSearch || undefined);
  const connections = connectionsData?.connections ?? [];
  const pending = pendingData?.requests ?? [];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Connections</h1>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <Tabs defaultValue="connections">
        <TabsList>
          <TabsTrigger value="connections">My Connections {connections.length > 0 && `(${connections.length})`}</TabsTrigger>
          <TabsTrigger value="pending">Pending {pending.length > 0 && `(${pending.length})`}</TabsTrigger>
        </TabsList>
        <TabsContent value="connections">
          <Card>
            <CardContent className="pt-2">
              {loadingConnections ? (
                <div className="flex h-32 items-center justify-center"><div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
              ) : connections.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">No connections yet. Browse people to connect.</p>
              ) : (
                <div className="divide-y">{connections.map((c) => <ConnectionRow key={c.id} connection={c} currentUserId={me?.user.id ?? ''} />)}</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending">
          <Card>
            <CardContent className="pt-2">
              {loadingPending ? (
                <div className="flex h-32 items-center justify-center"><div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
              ) : pending.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">No pending requests.</p>
              ) : (
                <div className="divide-y">{pending.map((c) => <PendingRow key={c.id} connection={c} />)}</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
