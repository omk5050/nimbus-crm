import { useEffect } from 'react';
import { BrowserRouter } from 'react-router';
import { AppRouter } from '@/routes/AppRouter';
import { ToastContainer } from '@/components/common/Toast';
import { useThemeSync } from '@/hooks/useThemeSync';
import { useAuthStore } from '@/store/auth.store';

function App() {
  useThemeSync();

  useEffect(() => {
    useAuthStore.getState().fetchMe();
  }, []);

  return (
    <BrowserRouter>
      <AppRouter />
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
