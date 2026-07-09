import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Header() {
  const { t } = useTranslation('landing');

  const navItems = [
    { key: 'nav.Courses', to: '/' },
    { key: 'nav.Memberships', to: '/search' },
    { key: 'nav.Tournaments', to: '/campus' },
    { key: 'nav.shop', to: '/shop' },
  ];

  return (
    <header className="absolute inset-x-0 top-0 z-50 min-h-16 bg-linear-to-b from-background via-background/65 to-transparent">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-25 py-5">
        {/* Logo */}
        <Link to="/">
          <img src="/teetime-logo.png" alt="TeeTime Executive" className="h-10 w-auto rounded-lg" />
        </Link>

        {/* Nav links */}
        <ul className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <li key={item.key}>
              <Link
                to={item.to}
                className="relative text-[13px] font-medium tracking-widest text-secondary transition-colors hover:text-primary-hover after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary-hover after:transition-all after:duration-300 hover:after:w-full"
              >
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="relative text-[13px] font-medium tracking-widest text-primary transition-colors hover:text-primary-hover after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary-hover after:transition-all after:duration-300 hover:after:w-full"
          >
            {t('auth.login')}
          </Link>
          <Link
            to="/register"
            className="rounded-md bg-secondary px-3.25 py-2 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-secondary-hover"
          >
            {t('auth.register')}
          </Link>
        </div>
      </nav>
    </header>
  );
}