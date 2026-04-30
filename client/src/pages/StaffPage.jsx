import { useEffect, useState } from 'react';
import api from '../api';
import StaffTable from '../components/StaffTable';
import StaffForm from '../components/StaffForm';
import AppModal from '../components/AppModal';

function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await api.get('/staff');
      setStaff(response.data);
      setError('');
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || 'Failed to load staff data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

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
      } else {
        await api.post('/staff', formData);
      }
      setIsFormOpen(false);
      setSelectedStaff(null);
      await fetchStaff();
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'Unable to save staff member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!staffToDelete) return;
    try {
      await api.delete(`/staff/${staffToDelete.id}`);
      setStaffToDelete(null);
      await fetchStaff();
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || 'Unable to delete staff member');
    }
  };

  return (
    <div className="container pb-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2 className="h5 mb-0">Staff Directory</h2>
              <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
                Add Staff
              </button>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {loading ? <p className="mb-0">Loading staff...</p> : <StaffTable staff={staff} onEdit={handleOpenEdit} onDelete={setStaffToDelete} />}
            </div>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <AppModal
          title={selectedStaff ? 'Edit Staff Member' : 'Add Staff Member'}
          onClose={() => setIsFormOpen(false)}
          onConfirm={null}
          hideFooter
        >
          <StaffForm selectedStaff={selectedStaff} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
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
          <p className="mb-0">
            Are you sure you want to delete <strong>{staffToDelete.first_name} {staffToDelete.last_name}</strong>?
          </p>
        </AppModal>
      )}
    </div>
  );
}

export default StaffPage;
