import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { t } = useTranslation('landing');
  const year = new Date().getFullYear();

  const links = [
    { key: 'footer.links.policy', to: '/about' },
    { key: 'footer.links.terms_of_service', to: '/contact' },
    { key: 'footer.links.press_kit', to: '/legal' },
    { key: 'footer.links.contact', to: '/privacy' },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground p-4">
      <div className="mx-auto flex flex-col max-w-7xl gap-6 px-6 py-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
            <img src="/teetime-logo.png" alt="TeeTime Executive" className="h-20 w-auto brightness-0 invert rounded-md" />

            <ul className="flex flex-wrap items-center gap-6">
            {links.map((link) => (
                <li key={link.key}>
                <Link to={link.to} className="text-sm tracking-widest text-secondary-foreground/70 transition-colors hover:text-primary">
                    {t(link.key)}
                </Link>
                </li>
            ))}
            </ul>
        </div>
        <p className="text-md text-secondary-foreground/60">
            {t('footer.description')}
        </p>

        <hr></hr>

        <p className="text-md text-secondary-foreground/60">
            {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
}