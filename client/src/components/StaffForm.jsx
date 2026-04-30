import { useEffect, useState } from 'react';

const initialState = {
  first_name: '',
  last_name: '',
  email: '',
  role: '',
};

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
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="first_name">First Name</label>
          <input
            className="form-control"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="last_name">Last Name</label>
          <input
            className="form-control"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="role">Role</label>
          <input
            className="form-control"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="mt-4 text-end">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : selectedStaff ? 'Update Staff' : 'Add Staff'}
        </button>
      </div>
    </form>
  );
}

export default StaffForm;
