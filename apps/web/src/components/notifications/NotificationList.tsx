import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { Card, CardContent } from '@/components/ui/card';
import { NotificationItem } from '@/components/notifications/NotificationItem';

export function NotificationList() {
  const { data, isLoading } = useNotifications();
  const notifications = data?.notifications ?? [];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Notifications</h1>
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-16">
            <Bell className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">No notifications yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="divide-y pt-2">
            {notifications.map((n) => (
              <NotificationItem
                key={n.id}
                id={n.id}
                type={n.type}
                message={n.message}
                isRead={n.isRead}
                createdAt={n.createdAt}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
