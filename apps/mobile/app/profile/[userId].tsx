import { useLocalSearchParams } from 'expo-router';
import { UserProfileView } from '../../components/profile/UserProfileView';

export default function UserProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  return <UserProfileView userId={userId!} />;
}
