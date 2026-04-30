import { useEffect, useState } from 'react';

const initialState = {
  first_name: '',
  last_name: '',
  email: '',
  role: '',
};

const ROLES = ['Doctor', 'Nurse', 'Admin', 'Technician', 'Receptionist', 'Pharmacist'];

function StaffForm({ selectedStaff, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (selectedStaff) {
      setFormData({
        first_name: selectedStaff.first_name,
        last_name: selectedStaff.last_name,
        email: selectedStaff.email,
        role: selectedStaff.role,
      });
    } else {
      setFormData(initialState);
    }
  }, [selectedStaff]);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="staff-form">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            id="first_name"
            name="first_name"
            placeholder="Enter first name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input
            id="last_name"
            name="last_name"
            placeholder="Enter last name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select id="role" name="role" value={formData.role} onChange={handleChange} required>
            <option value="" disabled>Select a role</option>
            {ROLES.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-actions">
        <button type="button" className="btn" style={{ background: '#f0f4f8', color: '#495057' }} onClick={() => onSubmit(null)}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : selectedStaff ? 'Update Staff' : 'Add Staff'}
        </button>
      </div>
    </form>
  );
}

export default StaffForm;
