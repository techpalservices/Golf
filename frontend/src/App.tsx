import { useEffect } from 'react';
import { useThemeStore } from './store/theme.store';
import { AppRouter } from './routes';

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return <AppRouter />;
}

export default App;