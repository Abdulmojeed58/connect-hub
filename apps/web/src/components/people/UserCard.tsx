import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSendConnectionRequest } from '@/hooks/useConnections';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Profile, User } from '@connecthub/shared-types';

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

type UserWithProfile = User & { profile: Profile | null };

export function UserCard({
  user,
  connectionStatus,
}: {
  user: UserWithProfile;
  connectionStatus: 'none' | 'pending' | 'connected';
}) {
  const navigate = useNavigate();
  const { mutate: sendRequest, isPending } = useSendConnectionRequest();
  const [localStatus, setLocalStatus] = useState(connectionStatus);

  const handleConnect = () => {
    sendRequest(user.id, {
      onSuccess: () => setLocalStatus('pending'),
      onError: (err) => {
        const msg = axios.isAxiosError(err) ? (err.response?.data as { error?: string })?.error : undefined;
        if (msg) console.error(msg);
      },
    });
  };

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex items-center gap-4 pt-5">
        <button onClick={() => navigate(`/profile/${user.id}`)}>
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.profile?.photoUrl ?? undefined} />
            <AvatarFallback>{user.profile?.fullName ? getInitials(user.profile.fullName) : '?'}</AvatarFallback>
          </Avatar>
        </button>
        <div className="min-w-0 flex-1">
          <button className="text-left" onClick={() => navigate(`/profile/${user.id}`)}>
            <p className="truncate font-medium hover:underline">{user.profile?.fullName ?? 'Unknown'}</p>
            {user.profile?.headline && <p className="truncate text-sm text-muted-foreground">{user.profile.headline}</p>}
          </button>
        </div>
        {localStatus === 'connected' ? (
          <Button variant="secondary" size="sm" disabled>Connected</Button>
        ) : localStatus === 'pending' ? (
          <Button variant="outline" size="sm" disabled>Pending</Button>
        ) : (
          <Button size="sm" onClick={handleConnect} disabled={isPending}>{isPending ? '…' : 'Connect'}</Button>
        )}
      </CardContent>
    </Card>
  );
}
