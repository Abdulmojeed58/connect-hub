import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function ProfileSummary() {
  const navigate = useNavigate();
  const { data: me } = useCurrentUser();
  const profile = me?.profile;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 text-xl">
            <AvatarImage src={profile?.photoUrl ?? undefined} />
            <AvatarFallback>{profile?.fullName ? getInitials(profile.fullName) : '?'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{profile?.fullName ?? '—'}</h2>
              {profile?.isPremium && <Badge>Premium</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{profile?.headline ?? 'Add a headline to your profile'}</p>
            <p className="text-xs text-muted-foreground">{me?.user.email}</p>
          </div>
        </div>
        <Separator className="my-4" />
        <Button variant="outline" size="sm" onClick={() => navigate(`/profile/${me?.user.id}`)}>
          View profile <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </CardContent>
    </Card>
  );
}
