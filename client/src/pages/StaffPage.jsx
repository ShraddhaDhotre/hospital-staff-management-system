import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../api';
import StaffTable from '../components/StaffTable';
import StaffForm from '../components/StaffForm';
import AppModal from '../components/AppModal';

function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [staffIdFilter, setStaffIdFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const { data } = await api.get('/departments');
        setDepartments(data);
      } catch (error) {
        showToast(error.response?.data?.message || 'Failed to load departments', 'error');
      }
    };
    loadDepartments();
  }, []);

  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (staffIdFilter.trim()) params.id = staffIdFilter.trim();
      if (departmentFilter) params.department_id = departmentFilter;
      if (searchText.trim()) params.q = searchText.trim();
      const response = await api.get('/staff', { params });
      setStaff(response.data);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to load staff data', 'error');
    } finally {
      setLoading(false);
    }
  }, [staffIdFilter, departmentFilter, searchText]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const stats = useMemo(() => {
    const uniqueRoles = new Set(staff.map((m) => m.role.toLowerCase()));
    const uniqueDepts = new Set(staff.map((m) => m.department_id).filter(Boolean));
    return {
      total: staff.length,
      roles: uniqueRoles.size,
      departments: uniqueDepts.size,
      latest: staff.length > 0 ? new Date(staff[0].created_at).toLocaleDateString() : '—',
    };
  }, [staff]);

  const handleOpenCreate = () => {
    setSelectedStaff(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (member) => {
    setSelectedStaff(member);
    setIsFormOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      if (selectedStaff) {
        await api.put(`/staff/${selectedStaff.id}`, formData);
        showToast('Staff member updated successfully');
      } else {
        await api.post('/staff', formData);
        showToast('Staff member added successfully');
      }
      setIsFormOpen(false);
      setSelectedStaff(null);
      await fetchStaff();
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to save staff member', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!staffToDelete) return;
    try {
      await api.delete(`/staff/${staffToDelete.id}`);
      setStaffToDelete(null);
      showToast('Staff member deleted successfully');
      await fetchStaff();
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to delete staff member', 'error');
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedStaff(null);
  };

  return (
    <div className="container py-4">
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            <svg className="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {toast.type === 'success' ? (
                <path d="M20 6L9 17l-5-5" />
              ) : (
                <>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </>
              )}
            </svg>
            {toast.message}
          </div>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Staff</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </div>
          <div>
            <div className="stat-value">{stats.roles}</div>
            <div className="stat-label">Roles in results</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div>
            <div className="stat-value">{stats.departments}</div>
            <div className="stat-label">Depts in results</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <div className="stat-value">{stats.latest}</div>
            <div className="stat-label">Last added (list)</div>
          </div>
        </div>
      </div>

      <div className="main-card">
        <div className="card-header">
          <h2>Staff Directory</h2>
          <div className="card-header-actions staff-filters">
            <input
              type="number"
              min={1}
              className="filter-input"
              placeholder="Staff ID"
              value={staffIdFilter}
              onChange={(e) => setStaffIdFilter(e.target.value)}
              aria-label="Filter by staff ID"
            />
            <select
              className="filter-select"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              aria-label="Filter by department"
            >
              <option value="">All departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <div className="search-input search-input--grow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search name, email, ID, or department…"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                aria-label="Search staff"
              />
            </div>
            <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Staff
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
          </div>
        ) : (
          <StaffTable staff={staff} onEdit={handleOpenEdit} onDelete={setStaffToDelete} />
        )}
      </div>

      {isFormOpen && (
        <AppModal
          title={selectedStaff ? 'Edit Staff Member' : 'Register Staff'}
          onClose={closeForm}
        >
          <StaffForm
            selectedStaff={selectedStaff}
            departments={departments}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            isSubmitting={isSubmitting}
          />
        </AppModal>
      )}

      {staffToDelete && (
        <AppModal
          title="Delete Staff Member"
          onClose={() => setStaffToDelete(null)}
          onConfirm={handleDelete}
          confirmLabel="Delete"
          variant="danger"
        >
          <div className="delete-warning">
            <div className="delete-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <p>
              Are you sure you want to delete <strong>{staffToDelete.first_name} {staffToDelete.last_name}</strong>? This action cannot be undone.
            </p>
          </div>
        </AppModal>
      )}
    </div>
  );
}

export default StaffPage;
