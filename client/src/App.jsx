import { Navigate, Route, Routes } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import StaffPage from './pages/StaffPage';
import AttendancePage from './pages/AttendancePage';
import DepartmentsPage from './pages/DepartmentsPage';
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
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
