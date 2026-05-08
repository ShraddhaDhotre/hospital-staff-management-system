import { useEffect, useState } from 'react';
import api from '../api';

function AttendancePage() {
  const [staff, setStaff] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [staffRes, attendanceRes] = await Promise.all([
        api.get('/staff'),
        api.get('/attendance/daily', { params: { date: selectedDate } }),
      ]);
      setStaff(staffRes.data);
      setAttendance(attendanceRes.data);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const markLogin = async () => {
    if (!selectedStaffId) return showToast('Select staff first', 'error');
    try {
      await api.post('/attendance/login', { staff_id: Number(selectedStaffId), attendance_date: selectedDate });
      showToast('Login marked');
      await loadData();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to mark login', 'error');
    }
  };

  const markLogout = async () => {
    if (!selectedStaffId) return showToast('Select staff first', 'error');
    try {
      await api.post('/attendance/logout', { staff_id: Number(selectedStaffId), attendance_date: selectedDate });
      showToast('Logout marked');
      await loadData();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to mark logout', 'error');
    }
  };

  const updateShift = async (staffId, shiftType) => {
    try {
      await api.put(`/attendance/shifts/${staffId}`, { shift_type: shiftType });
      setStaff((prev) => prev.map((s) => (s.id === staffId ? { ...s, shift_type: shiftType } : s)));
      showToast('Shift updated');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update shift', 'error');
    }
  };

  return (
    <div className="container py-4">
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>{toast.message}</div>
        </div>
      )}

      <div className="main-card">
        <div className="card-header"><h2>Daily Attendance (Login / Logout)</h2></div>
        <div className="dept-toolbar">
          <div className="dept-add-form">
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            <select value={selectedStaffId} onChange={(e) => setSelectedStaffId(e.target.value)}>
              <option value="">Select staff</option>
              {staff.map((s) => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
            </select>
            <button type="button" className="btn btn-primary" onClick={markLogin}>Mark Login</button>
            <button type="button" className="btn btn-secondary" onClick={markLogout}>Mark Logout</button>
          </div>
        </div>
        {loading ? <div className="loading-state"><div className="spinner" /></div> : (
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>Staff</th><th>Department</th><th>Shift</th><th>Login</th><th>Logout</th></tr></thead>
              <tbody>
                {attendance.map((a) => (
                  <tr key={a.id}>
                    <td>{a.first_name} {a.last_name}</td>
                    <td>{a.department_name}</td>
                    <td>{a.shift_type}</td>
                    <td>{a.login_time ? new Date(a.login_time).toLocaleString() : '—'}</td>
                    <td>{a.logout_time ? new Date(a.logout_time).toLocaleString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="main-card mt-4">
        <div className="card-header"><h2>Shift Allocation (Morning / Evening / Night)</h2></div>
        <div className="table-responsive">
          <table className="data-table">
            <thead><tr><th>Staff</th><th>Department</th><th>Shift</th></tr></thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id}>
                  <td>{s.first_name} {s.last_name}</td>
                  <td>{s.department_name}</td>
                  <td>
                    <select value={s.shift_type || 'Morning'} onChange={(e) => updateShift(s.id, e.target.value)}>
                      <option value="Morning">Morning</option>
                      <option value="Evening">Evening</option>
                      <option value="Night">Night</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default AttendancePage;
