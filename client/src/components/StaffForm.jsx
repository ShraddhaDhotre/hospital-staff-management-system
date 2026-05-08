import { useEffect, useState } from 'react';

const initialState = {
  first_name: '',
  last_name: '',
  email: '',
  role: '',
  department_id: '',
  shift_type: 'Morning',
};

const ROLES = ['Doctor', 'Nurse', 'Admin', 'Receptionist'];

function StaffForm({ selectedStaff, departments, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (selectedStaff) {
      setFormData({
        first_name: selectedStaff.first_name,
        last_name: selectedStaff.last_name,
        email: selectedStaff.email,
        role: selectedStaff.role,
        department_id: String(selectedStaff.department_id ?? ''),
        shift_type: selectedStaff.shift_type ?? 'Morning',
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
    onSubmit({
      ...formData,
      department_id: Number(formData.department_id),
    });
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
        <div className="form-group">
          <label htmlFor="department_id">Department</label>
          <select
            id="department_id"
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            required
            disabled={departments.length === 0}
          >
            <option value="" disabled>
              {departments.length === 0 ? 'Add a department first' : 'Select department'}
            </option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="shift_type">Default Shift</label>
          <select
            id="shift_type"
            name="shift_type"
            value={formData.shift_type}
            onChange={handleChange}
            required
          >
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
          </select>
        </div>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting || departments.length === 0}>
          {isSubmitting ? 'Saving...' : selectedStaff ? 'Update Staff' : 'Add Staff'}
        </button>
      </div>
    </form>
  );
}

export default StaffForm;
