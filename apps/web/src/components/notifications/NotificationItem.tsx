import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { NotificationType } from '@connecthub/shared-types';

const TYPE_LABELS: Record<NotificationType, string> = {
  CONNECTION_REQUEST: 'Connection request',
  CONNECTION_ACCEPTED: 'Connection accepted',
  CONNECTION_DECLINED: 'Connection declined',
};

function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationItem({
  id,
  type,
  message,
  isRead,
  createdAt,
}: {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
}) {
  return (
    <div key={id} className={cn('flex items-start gap-3 py-4', !isRead && 'bg-primary/5 -mx-6 px-6')}>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">{TYPE_LABELS[type]}</Badge>
          {!isRead && <span className="h-2 w-2 rounded-full bg-primary" />}
        </div>
        <p className="mt-1 text-sm">{message}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{formatRelativeTime(createdAt)}</p>
      </div>
    </div>
  );
}
