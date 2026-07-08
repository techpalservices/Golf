import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from './store/theme.store';

function App() {
  const { theme, toggleTheme } = useThemeStore();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background text-foreground">
      <div className="rounded-lg bg-surface p-8 shadow-lg border border-border">
        <h1 className="text-3xl font-serif text-primary font-bold">{t('title')}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('text')} <span>{theme === 'dark' ? t('dark') : t('light')}</span>
        </p>
      </div>

      <button
        onClick={toggleTheme}
        className="rounded-md bg-secondary px-6 py-3 text-secondary-foreground hover:bg-secondary-hover transition-colors"
      >
        {t('button1')}
      </button>

      <button
        onClick={toggleLanguage}
        className="rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary-hover transition-colors"
      >
        {t('button2')} ({i18n.language === 'fr' ? 'EN' : 'FR'})
      </button>
    </div>
  );
}

export default App;