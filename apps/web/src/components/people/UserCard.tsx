import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSendConnectionRequest, useRemoveConnection, useAcceptConnection, useDeclineConnection } from '@/hooks/useConnections';
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
  incomingConnectionId,
}: {
  user: UserWithProfile;
  connectionStatus: 'none' | 'pending' | 'connected' | 'incoming';
  pendingConnectionId?: string;
  incomingConnectionId?: string;
}) {
  const navigate = useNavigate();
  const { mutate: sendRequest, isPending: sending } = useSendConnectionRequest();
  const { mutate: withdraw, isPending: withdrawing } = useRemoveConnection();
  const { mutate: accept, isPending: accepting } = useAcceptConnection();
  const { mutate: decline, isPending: declining } = useDeclineConnection();

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex flex-col gap-3 pt-5">
        {/* Avatar + info row */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/profile/${user.id}`)}>
            <Avatar className="h-11 w-11 shrink-0">
              <AvatarImage src={user.profile?.photoUrl ?? undefined} />
              <AvatarFallback>{user.profile?.fullName ? getInitials(user.profile.fullName) : '?'}</AvatarFallback>
            </Avatar>
          </button>
          <div className="min-w-0 flex-1">
            <button className="w-full text-left" onClick={() => navigate(`/profile/${user.id}`)}>
              <p className="truncate font-semibold hover:underline">{user.profile?.fullName ?? 'Unknown'}</p>
              {user.profile?.headline && (
                <p className="truncate text-sm text-muted-foreground">{user.profile.headline}</p>
              )}
            </button>
          </div>
        </div>

        {/* Action area */}
        {connectionStatus === 'incoming' && incomingConnectionId ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1"
              disabled={accepting}
              onClick={() => accept(incomingConnectionId, {
                onSuccess: () => toast.success(`Connected with ${user.profile?.fullName ?? 'user'}`),
                onError: () => toast.error('Failed to accept request'),
              })}
            >
              {accepting ? 'Accepting…' : 'Accept'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              disabled={declining}
              onClick={() => decline(incomingConnectionId, {
                onSuccess: () => toast.success('Request declined'),
                onError: () => toast.error('Failed to decline request'),
              })}
            >
              {declining ? 'Declining…' : 'Decline'}
            </Button>
          </div>
        ) : connectionStatus === 'connected' ? (
          <Button variant="secondary" size="sm" className="w-full" disabled>Connected</Button>
        ) : connectionStatus === 'pending' && pendingConnectionId ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
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
            className="w-full"
            disabled={sending}
            onClick={() => sendRequest(user.id, {
              onSuccess: () => toast.success(`Request sent to ${user.profile?.fullName ?? 'user'}`),
              onError: () => toast.error('Failed to send request'),
            })}
          >
            {sending ? 'Sending…' : 'Connect'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
