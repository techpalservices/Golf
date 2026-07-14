import { useAuthStore } from '@/features/auth/store';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar, { type NavItem } from './Sidebar';
import BottomNav from './BottomNav';
import NotificationDropdown from '@/features/notifications/components/NotificationDropdown';
import type { Notification } from '@/features/notifications/types';
import { User } from 'lucide-react';
import {
  LayoutDashboard, Calendar, Building2, ShoppingCart, GraduationCap,
  CalendarClock, ClipboardList, Users, Trophy, Package,
  UserCog, Building, Store,
} from 'lucide-react';

// Mock notifications — replace with useNotifications() hook later
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Réservation confirmée',
    description: 'Votre réservation au Royal Golf de Marrakech a été confirmée.',
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(), // 10 min ago
    read: false,
    link: '/my-reservations',
  },
  {
    id: '2',
    title: 'Nouveau tournoi',
    description: 'Un nouveau tournoi est disponible : Open de Marrakech.',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
    read: false,
    link: '/tournaments',
  },
  {
    id: '3',
    title: 'Demande acceptée',
    description: 'Votre demande d\'adhésion au Golf d\'Anfa a été acceptée.',
    createdAt: new Date(Date.now() - 26 * 3600000).toISOString(), // yesterday
    read: true,
    link: '/my-clubs',
  },
  {
    id: '4',
    title: 'Offre spéciale',
    description: 'Profitez de 20% sur le Pass Premium jusqu\'à la fin du mois.',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
    read: true,
    link: '/memberships',
  },
];

const roleNavItems: Record<string, NavItem[]> = {
  PLAYER: [
    { key: 'nav.dashboard', to: '/dashboard', icon: LayoutDashboard },
    { key: 'nav.reservations', to: '/my-reservations', icon: Calendar },
    { key: 'nav.clubs', to: '/my-clubs', icon: Building2 },
    { key: 'nav.orders', to: '/my-orders', icon: ShoppingCart },
    { key: 'nav.campus', to: '/my-campus', icon: GraduationCap },
    { key: 'nav.profile', to: '/profile', icon: User },
  ],
  MANAGER: [
    { key: 'nav.dashboard', to: '/dashboard', icon: LayoutDashboard },
    { key: 'nav.myClub', to: '/my-club', icon: Building },
    { key: 'nav.planning', to: '/planning', icon: CalendarClock },
    { key: 'nav.requests', to: '/requests', icon: ClipboardList },
    { key: 'nav.members', to: '/members', icon: Users },
    { key: 'nav.tournaments', to: '/manage-tournaments', icon: Trophy },
    { key: 'nav.packages', to: '/packages', icon: Package },
    { key: 'nav.profile', to: '/profile', icon: User },
  ],
  ADMIN: [
    { key: 'nav.dashboard', to: '/dashboard', icon: LayoutDashboard },
    { key: 'nav.users', to: '/users', icon: UserCog },
    { key: 'nav.clubsManagement', to: '/clubs', icon: Building },
    { key: 'nav.shopManagement', to: '/shop-management', icon: Store },
    { key: 'nav.profile', to: '/profile', icon: User },
  ],
};

export default function AppLayout() {
  const role = useAuthStore((s) => s.user?.role || 'PLAYER');
  const user = useAuthStore((s) => s.user);
  const { t } = useTranslation('app');
  const { pathname } = useLocation();
  const items = roleNavItems[role] || [];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar items={items} />

      <div className="md:ml-16">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 md:px-6">
          <h1 className="font-serif text-lg font-bold text-secondary">
            {t('nav.' + getCurrentPageKey(pathname, items))}
          </h1>

          {/* Bell + Profile */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <NotificationDropdown
              notifications={mockNotifications}
              onMarkAllRead={() => {}}
            />
            <div className="flex items-center gap-2">
              <User size={16} className="text-primary" />
              <span className="hidden sm:inline">{user?.firstName}</span>
            </div>
          </div>
        </header>

        <main className="p-4 pb-20 md:p-6 md:pb-6">
          <Outlet />
        </main>
      </div>

      <BottomNav items={items} />
    </div>
  );
}

function getCurrentPageKey(pathname: string, items: NavItem[]): string {
  const match = items.find((item) => pathname.startsWith(item.to));
  return match ? match.key.replace('nav.', '') : 'dashboard';
}