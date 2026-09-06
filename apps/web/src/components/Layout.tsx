import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, Link2, Bell, LogOut } from 'lucide-react';
import { useCurrentUser, useLogout } from '@/hooks/useAuth';
import { usePendingRequests } from '@/hooks/useConnections';
import { useNotifications } from '@/hooks/useNotifications';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

const navItems = [
  { to: '/', label: 'Home', icon: Home, exact: true },
  { to: '/people', label: 'People', icon: Users, exact: false },
  { to: '/connections', label: 'Connections', icon: Link2, exact: false },
  { to: '/notifications', label: 'Notifications', icon: Bell, exact: false },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { data } = useCurrentUser();
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();
  const { data: pending } = usePendingRequests();
  const { data: notifications } = useNotifications();

  const pendingCount = pending?.requests.length ?? 0;
  const unreadCount = notifications?.notifications.filter((n) => !n.isRead).length ?? 0;

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="sticky top-0 z-40 border-b bg-background shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="text-xl font-bold text-primary"
          >
            ConnectHub
          </button>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) =>
                  cn(
                    'relative flex flex-col items-center gap-0.5 rounded-md px-3 py-2 text-xs font-medium transition-colors',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                    {/* Badges */}
                    {label === 'Connections' && pendingCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                        {pendingCount}
                      </span>
                    )}
                    {label === 'Notifications' && unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-primary-foreground">
                        {unreadCount}
                      </span>
                    )}
                    {/* Active underline */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User menu */}
          <div className="flex items-center gap-3">
            {data && (
              <button
                onClick={() => navigate(`/profile/${data.user.id}`)}
                className="flex items-center gap-2 text-sm"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={data.profile?.photoUrl ?? undefined} />
                  <AvatarFallback className="text-xs">
                    {data.profile?.fullName ? getInitials(data.profile.fullName) : '?'}
                  </AvatarFallback>
                </Avatar>
              </button>
            )}
            <Button variant="ghost" size="icon" onClick={() => logout()}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
