import { Navigate, Route, Routes } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import StaffPage from './pages/StaffPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<StaffPage />} />
        <Route path="/staff" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
