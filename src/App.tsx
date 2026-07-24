import { BrowserRouter } from 'react-router';
import { AppRouter } from '@/routes/AppRouter';
import { ToastContainer } from '@/components/common/Toast';
import { useThemeSync } from '@/hooks/useThemeSync';

function App() {
  useThemeSync();

  return (
    <BrowserRouter>
      <AppRouter />
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
