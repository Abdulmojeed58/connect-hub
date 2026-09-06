import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSendConnectionRequest, useRemoveConnection } from '@/hooks/useConnections';
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
  pendingConnectionId,
}: {
  user: UserWithProfile;
  connectionStatus: 'none' | 'pending' | 'connected';
  pendingConnectionId?: string;
}) {
  const navigate = useNavigate();
  const { mutate: sendRequest, isPending: sending } = useSendConnectionRequest();
  const { mutate: withdraw, isPending: withdrawing } = useRemoveConnection();

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
        {connectionStatus === 'connected' ? (
          <Button variant="secondary" size="sm" disabled>Connected</Button>
        ) : connectionStatus === 'pending' && pendingConnectionId ? (
          <Button
            variant="outline"
            size="sm"
            disabled={withdrawing}
            onClick={() => withdraw(pendingConnectionId, {
              onSuccess: () => toast.success('Request withdrawn'),
              onError: () => toast.error('Failed to withdraw request'),
            })}
          >
            {withdrawing ? 'Withdrawing…' : 'Withdraw'}
          </Button>
        ) : (
          <Button
            size="sm"
            disabled={sending}
            onClick={() => sendRequest(user.id, {
              onSuccess: () => toast.success(`Request sent to ${user.profile?.fullName ?? 'user'}`),
              onError: () => toast.error('Failed to send request'),
            })}
          >
            {sending ? '…' : 'Connect'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
