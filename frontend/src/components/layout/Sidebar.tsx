import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, type LucideIcon } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store';

export interface NavItem {
  key: string;
  to: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: NavItem[];
}

export default function Sidebar({ items }: SidebarProps) {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-secondary">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-secondary-hover">
        <img src="/teetime-logo.png" alt="TeeTime Executive" className="h-8 w-auto brightness-0 invert" />
      </div>

      {/* Nav items */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
        {items.map((item) => (
          <NavLink
            key={item.key}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-secondary-foreground/70 hover:bg-secondary-hover hover:text-primary'
              }`
            }
          >
            <item.icon size={18} />
            <span>{t(item.key)}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-secondary-hover p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-secondary-foreground/70 transition-colors hover:bg-secondary-hover hover:text-primary"
        >
          <LogOut size={18} />
          <span>{t('nav.logout')}</span>
        </button>
      </div>
    </aside>
  );
}