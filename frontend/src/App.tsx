import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useThemeStore } from './store/theme.store';
import { AppRouter } from './routes';
import { Toaster } from 'sonner';
import {useWebSocket} from "@/hooks/useWebSocket.ts";

const queryClient = new QueryClient();

function App() {
  const { theme } = useThemeStore();
  useWebSocket()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}

export default App;
