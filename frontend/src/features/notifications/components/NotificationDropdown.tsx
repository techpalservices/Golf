import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Bell, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { Notification } from '../types';

interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAllRead: () => void;
}

// Group notifications by day
function groupByDay(notifications: Notification[], t: (key: string) => string) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);

  const groups: Record<string, Notification[]> = { today: [], yesterday: [], earlier: [] };

  notifications.forEach((n) => {
    const date = new Date(n.createdAt);
    const notifDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (notifDay.getTime() === today.getTime()) groups.today.push(n);
    else if (notifDay.getTime() === yesterday.getTime()) groups.yesterday.push(n);
    else groups.earlier.push(n);
  });

  return groups;
}

function formatTimeAgo(isoDate: string, t: (key: string, options?: any) => string) {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return t('notifications.minutesAgo', { count: minutes || 1 });
  if (hours < 24) return t('notifications.hoursAgo', { count: hours });
  return t('notifications.daysAgo', { count: days });
}

export default function NotificationDropdown({ notifications, onMarkAllRead }: NotificationDropdownProps) {
  const { t } = useTranslation('app');
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const groups = groupByDay(notifications, t);

  const handleNotificationClick = (notif: Notification) => {
    navigate(notif.link);
  };

  const notificationList = (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-3">
        <h3 className="font-serif text-sm font-bold text-secondary">{t('notifications.title')}</h3>
        <button
          onClick={onMarkAllRead}
          className="flex items-center gap-1 text-xs text-primary hover:text-primary-hover"
        >
          <Check size={12} />
          {t('notifications.markAllRead')}
        </button>
      </div>

      {/* Empty state */}
      {notifications.length === 0 ? (
        <p className="p-6 text-center text-sm text-muted-foreground">{t('notifications.empty')}</p>
      ) : (
        <>
          {/* Today */}
          {groups.today.length > 0 && (
            <NotificationGroup label={t('notifications.today')} items={groups.today} onClick={handleNotificationClick} formatTime={(iso) => formatTimeAgo(iso, t)} />
          )}
          {/* Yesterday */}
          {groups.yesterday.length > 0 && (
            <NotificationGroup label={t('notifications.yesterday')} items={groups.yesterday} onClick={handleNotificationClick} formatTime={(iso) => formatTimeAgo(iso, t)} />
          )}
          {/* Earlier */}
          {groups.earlier.length > 0 && (
            <NotificationGroup label={t('notifications.earlier')} items={groups.earlier} onClick={handleNotificationClick} formatTime={(iso) => formatTimeAgo(iso, t)} />
          )}
        </>
      )}
    </div>
  );

  // ─── Desktop: Popover ───
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
        <PopoverContent className="w-80 p-0 bg-white" align="end">
          {notificationList}
        </PopoverContent>
      </Popover>
    );
  }

  // ─── Mobile: Drawer ───
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
        <div className="overflow-y-auto">{notificationList}</div>
      </DrawerContent>
    </Drawer>
  );
}

function NotificationGroup({
  label,
  items,
  onClick,
  formatTime,
}: {
  label: string;
  items: Notification[];
  onClick: (n: Notification) => void;
  formatTime: (iso: string) => string;
}) {
  return (
    <div className="border-b border-border last:border-0">
      <h4 className="px-3 py-2 text-[11px] font-medium uppercase tracking-widest text-muted-foreground bg-muted/30">
        {label}
      </h4>
      {items.map((notif) => (
        <button
          key={notif.id}
          onClick={() => onClick(notif)}
          className="flex w-full gap-3 px-3 py-3 text-left transition-colors hover:bg-muted/50"
        >
          {/* Unread dot */}
          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${notif.read ? 'bg-transparent' : 'bg-primary'}`} />

          <div className="flex flex-1 flex-col gap-0.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-foreground">{notif.title}</span>
              <span className="shrink-0 text-[11px] text-muted-foreground">{formatTime(notif.createdAt)}</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{notif.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}