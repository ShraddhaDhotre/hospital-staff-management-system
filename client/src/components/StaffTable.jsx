function StaffTable({ staff, onEdit, onDelete }) {
  const getInitials = (first, last) => {
    const a = (first && first[0]) || '?';
    const b = (last && last[0]) || '?';
    return `${a}${b}`.toUpperCase();
  };

  const getRoleClass = (role) => {
    const r = role.toLowerCase();
    if (r === 'doctor') return 'doctor';
    if (r === 'nurse') return 'nurse';
    if (r === 'admin' || r === 'administrator') return 'admin';
    if (r === 'receptionist') return 'receptionist';
    if (r === 'technician') return 'technician';
    return 'default';
  };

  if (staff.length === 0) {
    return (
      <div className="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="16" y1="11" x2="22" y2="11" />
        </svg>
        <h3>No staff members found</h3>
        <p>Try changing filters or add a new staff member.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Role</th>
            <th>Shift</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((member) => (
            <tr key={member.id}>
              <td className="id-cell">{member.id}</td>
              <td>
                <div className="staff-name">
                  <div className="avatar">{getInitials(member.first_name, member.last_name)}</div>
                  <span className="staff-name-text">{member.first_name} {member.last_name}</span>
                </div>
              </td>
              <td className="email-cell">{member.email}</td>
              <td className="dept-cell">{member.department_name || '—'}</td>
              <td>
                <span className={`role-badge ${getRoleClass(member.role)}`}>{member.role}</span>
              </td>
              <td>
                <span className="role-badge default">{member.shift_type || 'Morning'}</span>
              </td>
              <td>
                <div className="actions-cell">
                  <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => onEdit(member)}>
                    Edit
                  </button>
                  <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => onDelete(member)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StaffTable;
