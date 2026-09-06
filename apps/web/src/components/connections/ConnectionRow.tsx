import { useNavigate } from 'react-router-dom';
import { UserX } from 'lucide-react';
import { useRemoveConnection } from '@/hooks/useConnections';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { ConnectionWithProfiles } from '@connecthub/shared-types';

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function ConnectionRow({
  connection,
  currentUserId,
}: {
  connection: ConnectionWithProfiles;
  currentUserId: string;
}) {
  const navigate = useNavigate();
  const { mutate: remove, isPending } = useRemoveConnection();
  const other = connection.requesterId === currentUserId ? connection.addressee : connection.requester;
  const profile = other.profile;

  return (
    <div className="flex items-center gap-4 py-3">
      <button onClick={() => navigate(`/profile/${other.id}`)}>
        <Avatar className="h-11 w-11">
          <AvatarImage src={profile?.photoUrl ?? undefined} />
          <AvatarFallback>{profile?.fullName ? getInitials(profile.fullName) : '?'}</AvatarFallback>
        </Avatar>
      </button>
      <div className="min-w-0 flex-1">
        <button className="text-left" onClick={() => navigate(`/profile/${other.id}`)}>
          <p className="font-medium hover:underline">{profile?.fullName ?? 'Unknown'}</p>
          {profile?.headline && <p className="truncate text-sm text-muted-foreground">{profile.headline}</p>}
        </button>
      </div>
      <Button variant="outline" size="sm" onClick={() => remove(connection.id)} disabled={isPending}>
        <UserX className="mr-1.5 h-3.5 w-3.5" /> Remove
      </Button>
    </div>
  );
}
