import { useEffect } from 'react';
import { useThemeStore } from './store/theme.store';

function App() {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background text-foreground">
      <div className="rounded-lg bg-surface p-8 shadow-lg border border-border">
        <h1 className="text-3xl font-serif text-primary font-bold">TeeTime Executive</h1>
        <p className="mt-2 text-muted-foreground">
          Theme actuel : <span className="">{theme}</span>
        </p>
      </div>

      <button
        onClick={toggleTheme}
        className="rounded-md bg-secondary px-6 py-3 text-secondary-foreground hover:bg-secondary-hover transition-colors"
      >
        Basculer en mode {theme === 'light' ? 'sombre' : 'clair'}
      </button>
    </div>
  );
}

export default App;