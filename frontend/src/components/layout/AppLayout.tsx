import { useAuthStore } from '@/features/auth/store';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar, { type NavItem } from './Sidebar';
import BottomNav from './BottomNav';
import {
  LayoutDashboard, Calendar, Building2, ShoppingCart, GraduationCap,
  CalendarClock, ClipboardList, Users, Trophy, Package,
  UserCog, Building, Store, Bell, User,
} from 'lucide-react';

const roleNavItems: Record<string, NavItem[]> = {
  PLAYER: [
    { key: 'nav.dashboard', to: '/dashboard', icon: LayoutDashboard },
    { key: 'nav.reservations', to: '/my-reservations', icon: Calendar },
    { key: 'nav.clubs', to: '/my-clubs', icon: Building2 },
    { key: 'nav.orders', to: '/my-orders', icon: ShoppingCart },
    { key: 'nav.campus', to: '/my-campus', icon: GraduationCap },
    { key: 'nav.notifications', to: '/notifications', icon: Bell },
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
    { key: 'nav.notifications', to: '/notifications', icon: Bell },
    { key: 'nav.profile', to: '/profile', icon: User },
  ],
  ADMIN: [
    { key: 'nav.dashboard', to: '/dashboard', icon: LayoutDashboard },
    { key: 'nav.users', to: '/users', icon: UserCog },
    { key: 'nav.clubsManagement', to: '/clubs-management', icon: Building },
    { key: 'nav.shopManagement', to: '/shop-management', icon: Store },
    { key: 'nav.notifications', to: '/notifications', icon: Bell },
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
      {/* Desktop sidebar (icon-only, expand on hover) */}
      <Sidebar items={items} />

      {/* Content — offset for sidebar on desktop, bottom padding for nav on mobile */}
      <div className="md:ml-16">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 md:px-6">
          <h1 className="font-serif text-lg font-bold text-secondary">
            {t('nav.' + getCurrentPageKey(pathname, items))}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User size={16} className="text-primary" />
            <span className="hidden sm:inline">{user?.firstName}</span>
          </div>
        </header>

        {/* Page content — extra bottom padding on mobile for the bottom nav */}
        <main className="p-4 pb-20 md:p-6 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <BottomNav items={items} />
    </div>
  );
}

function getCurrentPageKey(pathname: string, items: NavItem[]): string {
  const match = items.find((item) => pathname.startsWith(item.to));
  return match ? match.key.replace('nav.', '') : 'dashboard';
}