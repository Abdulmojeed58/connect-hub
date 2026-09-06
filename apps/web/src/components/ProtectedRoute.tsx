import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useCurrentUser } from '@/hooks/useAuth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const { isLoading } = useCurrentUser();

  if (!accessToken) return <Navigate to="/login" replace />;
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
