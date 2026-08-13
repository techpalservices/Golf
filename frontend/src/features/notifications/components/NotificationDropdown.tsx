import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useNotifications } from '../hooks/useNotifications';
import { useUnreadCount } from '../hooks/useUnreadCount';
import { useMarkAsRead } from '../hooks/useMarkAsRead';
import { useMarkAllAsRead } from '../hooks/useMarkAllAsRead';
import { notificationLink, type Notification } from '../types';

function groupByDay(notifications: Notification[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const groups: Record<string, Notification[]> = { today: [], yesterday: [], earlier: [] };

  notifications.forEach((n) => {
    const d = new Date(n.createdAt);
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (day.getTime() === today.getTime()) groups.today.push(n);
    else if (day.getTime() === yesterday.getTime()) groups.yesterday.push(n);
    else groups.earlier.push(n);
  });
  return groups;
}

function timeAgo(iso: string, t: (key: string, opts?: any) => string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return t('notifications.minutesAgo', { count: minutes || 1 });
  if (hours < 24) return t('notifications.hoursAgo', { count: hours });
  return t('notifications.daysAgo', { count: days });
}

// ← your "date of the day" idea, client-side
function fullDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function NotificationDropdown() {
  const { t } = useTranslation('app');
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const navigate = useNavigate();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const markAllRead = useMarkAllAsRead();

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const notifications = useMemo(() => data?.pages.flat() ?? [], [data]);
  const groups = useMemo(() => groupByDay(notifications), [notifications]);

  // Infinite scroll — sentinel observes itself; clipping by the scroll container handles visibility
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
        },
        { rootMargin: '100px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleClick = (notif: Notification) => {
    if (!notif.isRead) markAsRead.mutate(notif.id);
    const link = notificationLink(notif.type);
    if (link) navigate(link);
  };

  const renderGroup = (label: string, items: Notification[], format: (iso: string) => string) =>
      items.length > 0 && (
          <div className="border-b border-border last:border-0">
            <h4 className="bg-muted/30 px-3 py-2 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              {label}
            </h4>
            {items.map((notif) => (
                <button key={notif.id} onClick={() => handleClick(notif)}
                        className="flex w-full gap-3 px-3 py-3 text-left transition-colors hover:bg-muted/50">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${notif.isRead ? 'bg-transparent' : 'bg-primary'}`} />
                  <div className="flex flex-1 flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">{notif.title}</span>
                    <span className="shrink-0 self-end text-[11px] text-muted-foreground">{format(notif.createdAt)}</span>
                    <p className="text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
                  </div>
                </button>
            ))}
          </div>
      );

  const list = (
      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b border-border p-3">
          <h3 className="font-serif text-sm font-bold text-secondary">{t('notifications.title')}</h3>
          <button onClick={() => markAllRead.mutate()} className="flex items-center gap-1 text-xs text-primary hover:text-primary-hover">
            <Check size={12} />
            {t('notifications.markAllRead')}
          </button>
        </div>

        {notifications.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">{t('notifications.empty')}</p>
        ) : (
            <>
              {renderGroup(t('notifications.today'), groups.today, (iso) => timeAgo(iso, t))}
              {renderGroup(t('notifications.yesterday'), groups.yesterday, (iso) => timeAgo(iso, t))}
              {renderGroup(t('notifications.earlier'), groups.earlier, fullDate)}
            </>
        )}

        <div ref={loadMoreRef} className="flex justify-center p-2">
          {isFetchingNextPage && <Loader2 className="size-4 animate-spin" />}
        </div>
      </div>
  );

  if (isDesktop) {
    return (
        <Popover>
          <PopoverTrigger className="relative" aria-label="Notifications">
            <Bell size={18} className="text-secondary hover:text-primary transition-colors" />
            {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {unreadCount}
            </span>
            )}
          </PopoverTrigger>
          <PopoverContent className="max-h-[70vh] w-80 overflow-y-auto bg-white p-0" align="end">
            {list}
          </PopoverContent>
        </Popover>
    );
  }

  return (
      <Drawer>
        <DrawerTrigger className="relative" aria-label="Notifications">
          <Bell size={18} className="text-secondary hover:text-primary transition-colors" />
          {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {unreadCount}
          </span>
          )}
        </DrawerTrigger>
        <DrawerContent className="max-h-[70vh] bg-white">
          <div className="overflow-y-auto">{list}</div>
        </DrawerContent>
      </Drawer>
  );
}