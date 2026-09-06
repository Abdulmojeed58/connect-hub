import { useNavigate } from 'react-router-dom';
import { Users, Link2, Bell } from 'lucide-react';
import { useConnections, usePendingRequests } from '@/hooks/useConnections';
import { useNotifications } from '@/hooks/useNotifications';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function StatsPanel() {
  const navigate = useNavigate();
  const { data: connectionsData } = useConnections();
  const { data: pendingData } = usePendingRequests();
  const { data: notificationsData } = useNotifications();

  const connectionCount = connectionsData?.connections.length ?? 0;
  const pendingCount = pendingData?.requests.length ?? 0;
  const unreadCount = notificationsData?.notifications.filter((n) => !n.isRead).length ?? 0;

  return (
    <div className="space-y-4">
      <Card className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => navigate('/connections')}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Connections</CardTitle>
          <Link2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{connectionCount}</p>
          {pendingCount > 0 && <p className="mt-1 text-xs text-primary">{pendingCount} pending request{pendingCount > 1 ? 's' : ''}</p>}
        </CardContent>
      </Card>

      <Card className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => navigate('/people')}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Browse People</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Discover and connect with professionals</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => navigate('/notifications')}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Notifications</CardTitle>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {unreadCount > 0 ? (
            <p className="text-sm text-primary font-medium">{unreadCount} unread</p>
          ) : (
            <p className="text-sm text-muted-foreground">All caught up</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
