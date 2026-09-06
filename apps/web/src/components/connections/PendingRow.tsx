import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { useAcceptConnection, useDeclineConnection } from '@/hooks/useConnections';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { ConnectionWithProfiles } from '@connecthub/shared-types';

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function PendingRow({ connection }: { connection: ConnectionWithProfiles }) {
  const navigate = useNavigate();
  const { mutate: accept, isPending: accepting } = useAcceptConnection();
  const { mutate: decline, isPending: declining } = useDeclineConnection();
  const requester = connection.requester;
  const profile = requester.profile;

  return (
    <div className="flex items-center gap-4 py-3">
      <button onClick={() => navigate(`/profile/${requester.id}`)}>
        <Avatar className="h-11 w-11">
          <AvatarImage src={profile?.photoUrl ?? undefined} />
          <AvatarFallback>{profile?.fullName ? getInitials(profile.fullName) : '?'}</AvatarFallback>
        </Avatar>
      </button>
      <div className="min-w-0 flex-1">
        <button className="text-left" onClick={() => navigate(`/profile/${requester.id}`)}>
          <p className="font-medium hover:underline">{profile?.fullName ?? 'Unknown'}</p>
          {profile?.headline && <p className="truncate text-sm text-muted-foreground">{profile.headline}</p>}
        </button>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => accept(connection.id)} disabled={accepting}><Check className="mr-1 h-3.5 w-3.5" /> Accept</Button>
        <Button size="sm" variant="outline" onClick={() => decline(connection.id)} disabled={declining}><X className="mr-1 h-3.5 w-3.5" /> Decline</Button>
      </div>
    </div>
  );
}
