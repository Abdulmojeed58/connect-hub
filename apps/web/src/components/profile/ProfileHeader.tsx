import { MapPin } from 'lucide-react';
import { useSendConnectionRequest } from '@/hooks/useConnections';
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
}: {
  profile: FullProfile;
  userId: string;
  isOwnProfile: boolean;
}) {
  const { mutate: sendRequest, isPending: sending } = useSendConnectionRequest();

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
            ) : (
              <Button size="sm" onClick={() => sendRequest(userId)} disabled={sending}>
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
