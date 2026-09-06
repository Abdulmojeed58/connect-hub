import { useParams } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Layout } from '@/components/Layout';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ExperienceSection } from '@/components/profile/ExperienceSection';
import { EducationSection } from '@/components/profile/EducationSection';

export function ProfileView() {
  const { userId } = useParams<{ userId: string }>();
  const { data: me } = useCurrentUser();
  const { data: profile, isLoading, isError } = useProfile(userId!);

  const isOwnProfile = me?.user.id === userId;

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
      <ProfileHeader profile={profile} userId={userId!} isOwnProfile={isOwnProfile} />
      <ExperienceSection experiences={profile.experiences} userId={userId!} isOwnProfile={isOwnProfile} />
      <EducationSection educations={profile.educations} userId={userId!} isOwnProfile={isOwnProfile} />
    </div>
  );
}
