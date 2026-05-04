import { Navigate, Route, Routes } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import StaffPage from './pages/StaffPage';
import NotFoundPage from './pages/NotFoundPage';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <AppNavbar theme={theme} onToggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<StaffPage />} />
        <Route path="/staff" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
