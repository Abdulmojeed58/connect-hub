import { useParams } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useConnections, useSentRequests, usePendingRequests } from '@/hooks/useConnections';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ExperienceSection } from '@/components/profile/ExperienceSection';
import { EducationSection } from '@/components/profile/EducationSection';

export function ProfileView() {
  const { userId } = useParams<{ userId: string }>();
  const { data: me } = useCurrentUser();
  const { data: profile, isLoading, isError } = useProfile(userId!);
  const { data: connectionsData } = useConnections();
  const { data: sentData } = useSentRequests();
  const { data: pendingData } = usePendingRequests();

  const isOwnProfile = me?.user.id === userId;

  const isConnected = (connectionsData?.connections ?? []).some(
    (c) => c.requesterId === userId || c.addresseeId === userId,
  );

  // Request I sent to this user
  const sentRequest = (sentData?.requests ?? []).find(
    (c) => c.addresseeId === userId,
  );

  // Request this user sent to me (I am the addressee)
  const receivedRequest = (pendingData?.requests ?? []).find(
    (c) => c.requesterId === userId,
  );

  const connectionStatus = isConnected ? 'connected' as const
    : sentRequest ? 'sent' as const
    : receivedRequest ? 'received' as const
    : 'none' as const;

  const pendingConnectionId = sentRequest?.id ?? receivedRequest?.id;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isError || !profile) {
    return <p className="text-center text-muted-foreground">Profile not found.</p>;
  }

  return (
    <div className="space-y-5">
      <ProfileHeader profile={profile} userId={userId!} isOwnProfile={isOwnProfile} connectionStatus={connectionStatus} pendingConnectionId={pendingConnectionId} />
      <ExperienceSection experiences={profile.experiences} userId={userId!} isOwnProfile={isOwnProfile} />
      <EducationSection educations={profile.educations} userId={userId!} isOwnProfile={isOwnProfile} />
    </div>
  );
}
