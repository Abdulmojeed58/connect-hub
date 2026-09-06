import { MapPin } from 'lucide-react';
import { toast } from 'sonner';
import {
  useSendConnectionRequest,
  useRemoveConnection,
  useAcceptConnection,
  useDeclineConnection,
} from '@/hooks/useConnections';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { EditProfileDialog } from '@/components/profile/EditProfileDialog';
import type { FullProfile } from '@connecthub/shared-types';

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function ProfileHeader({
  profile,
  userId,
  isOwnProfile,
  connectionStatus,
  pendingConnectionId,
}: {
  profile: FullProfile;
  userId: string;
  isOwnProfile: boolean;
  connectionStatus: 'none' | 'sent' | 'received' | 'connected';
  pendingConnectionId?: string;
}) {
  const { mutate: sendRequest, isPending: sending } = useSendConnectionRequest();
  const { mutate: withdraw, isPending: withdrawing } = useRemoveConnection();
  const { mutate: accept, isPending: accepting } = useAcceptConnection();
  const { mutate: decline, isPending: declining } = useDeclineConnection();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20 text-2xl">
              <AvatarImage src={profile.photoUrl ?? undefined} />
              <AvatarFallback>{getInitials(profile.fullName)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">{profile.fullName}</h1>
                {profile.isPremium && <Badge>Premium</Badge>}
              </div>
              {profile.headline && <p className="text-muted-foreground">{profile.headline}</p>}
              {profile.location && (
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {profile.location}
                </p>
              )}
            </div>
          </div>

          <div className="shrink-0">
            {isOwnProfile ? (
              <EditProfileDialog profile={profile} userId={userId} />
            ) : connectionStatus === 'connected' ? (
              <Button size="sm" variant="secondary" disabled>Connected</Button>
            ) : connectionStatus === 'sent' && pendingConnectionId ? (
              <Button
                size="sm"
                variant="outline"
                disabled={withdrawing}
                onClick={() => withdraw(pendingConnectionId, {
                  onSuccess: () => toast.success('Request withdrawn'),
                  onError: () => toast.error('Failed to withdraw request'),
                })}
              >
                {withdrawing ? 'Withdrawing…' : 'Withdraw request'}
              </Button>
            ) : connectionStatus === 'received' && pendingConnectionId ? (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  disabled={accepting || declining}
                  onClick={() => accept(pendingConnectionId, {
                    onSuccess: () => toast.success(`Connected with ${profile.fullName}`),
                    onError: () => toast.error('Failed to accept request'),
                  })}
                >
                  {accepting ? 'Accepting…' : 'Accept'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={accepting || declining}
                  onClick={() => decline(pendingConnectionId, {
                    onSuccess: () => toast.success('Request declined'),
                    onError: () => toast.error('Failed to decline request'),
                  })}
                >
                  {declining ? 'Declining…' : 'Decline'}
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                disabled={sending}
                onClick={() => sendRequest(userId, {
                  onSuccess: () => toast.success(`Request sent to ${profile.fullName}`),
                  onError: () => toast.error('Failed to send request'),
                })}
              >
                {sending ? 'Sending…' : 'Connect'}
              </Button>
            )}
          </div>
        </div>

        {profile.bio && (
          <>
            <Separator className="my-4" />
            <p className="text-sm text-muted-foreground">{profile.bio}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
