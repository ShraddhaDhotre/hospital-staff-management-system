import { useCallback, useEffect, useState } from 'react';
import api from '../api';
import AppModal from '../components/AppModal';

function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [editingDept, setEditingDept] = useState(null);
  const [editName, setEditName] = useState('');
  const [deptToDelete, setDeptToDelete] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/departments');
      setDepartments(data);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to load departments', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    try {
      setSaving(true);
      await api.post('/departments', { name });
      setNewName('');
      showToast('Department added');
      await fetchDepartments();
    } catch (error) {
      showToast(error.response?.data?.message || 'Could not add department', 'error');
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (dept) => {
    setEditingDept(dept);
    setEditName(dept.name);
  };

  const handleUpdate = async () => {
    if (!editingDept) return;
    const name = editName.trim();
    if (!name) return;
    try {
      setSaving(true);
      await api.put(`/departments/${editingDept.id}`, { name });
      setEditingDept(null);
      showToast('Department updated');
      await fetchDepartments();
    } catch (error) {
      showToast(error.response?.data?.message || 'Could not update department', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deptToDelete) return;
    try {
      await api.delete(`/departments/${deptToDelete.id}`);
      setDeptToDelete(null);
      showToast('Department deleted');
      await fetchDepartments();
    } catch (error) {
      showToast(error.response?.data?.message || 'Could not delete department', 'error');
    }
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

      <div className="main-card">
        <div className="card-header card-header--block">
          <div>
            <h2>Departments</h2>
            <p className="card-header-hint">Add hospital units (Cardiology, ICU, etc.). Every staff member must belong to one department.</p>
          </div>
        </div>

        <div className="dept-toolbar">
          <form className="dept-add-form" onSubmit={handleCreate}>
            <input
              type="text"
              placeholder="New department name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              maxLength={100}
              aria-label="New department name"
            />
            <button type="submit" className="btn btn-primary" disabled={saving || !newName.trim()}>
              Add department
            </button>
          </form>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
          </div>
        ) : departments.length === 0 ? (
          <div className="empty-state">
            <h3>No departments yet</h3>
            <p>Create your first department above.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((d) => (
                  <tr key={d.id}>
                    <td className="staff-name-text">{d.name}</td>
                    <td>
                      <div className="actions-cell">
                        <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => openEdit(d)}>
                          Edit
                        </button>
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setDeptToDelete(d)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingDept && (
        <AppModal
          title="Edit department"
          onClose={() => setEditingDept(null)}
          onConfirm={handleUpdate}
          confirmLabel={saving ? 'Saving...' : 'Save'}
          variant="primary"
          confirmDisabled={saving || !editName.trim()}
        >
          <div className="form-group full-width">
            <label htmlFor="edit-dept-name">Name</label>
            <input
              id="edit-dept-name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              maxLength={100}
            />
          </div>
        </AppModal>
      )}

      {deptToDelete && (
        <AppModal
          title="Delete department"
          onClose={() => setDeptToDelete(null)}
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
              Delete <strong>{deptToDelete.name}</strong>? You cannot delete a department that still has staff assigned.
            </p>
          </div>
        </AppModal>
      )}
    </div>
  );
}

export default DepartmentsPage;
