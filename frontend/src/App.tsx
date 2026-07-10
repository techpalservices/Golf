import { useEffect } from 'react';
import { useThemeStore } from './store/theme.store';
import { AppRouter } from './routes';
import { Toaster } from 'sonner';

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <>
      <AppRouter />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;