import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserX } from 'lucide-react';
import { toast } from 'sonner';
import { useRemoveConnection } from '@/hooks/useConnections';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
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
  const [showDialog, setShowDialog] = useState(false);

  const other = connection.requesterId === currentUserId ? connection.addressee : connection.requester;
  const profile = other.profile;

  return (
    <>
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
        <Button variant="outline" size="sm" onClick={() => setShowDialog(true)} disabled={isPending}>
          <UserX className="mr-1.5 h-3.5 w-3.5" /> Remove
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove connection</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{' '}
              <span className="font-medium text-foreground">{profile?.fullName ?? 'this person'}</span>{' '}
              from your connections?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => remove(connection.id, {
                onSuccess: () => {
                  setShowDialog(false);
                  toast.success(`Removed ${profile?.fullName ?? 'connection'}`);
                },
                onError: () => toast.error('Failed to remove connection'),
              })}
            >
              {isPending ? 'Removing…' : 'Remove'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
