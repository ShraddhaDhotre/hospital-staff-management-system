function StaffTable({ staff, onEdit, onDelete }) {
  const getInitials = (first, last) => `${first[0]}${last[0]}`.toUpperCase();

  const getRoleClass = (role) => {
    const r = role.toLowerCase();
    if (r === 'doctor') return 'doctor';
    if (r === 'nurse') return 'nurse';
    if (r === 'admin' || r === 'administrator') return 'admin';
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
        <p>Add your first staff member to get started.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((member) => (
            <tr key={member.id}>
              <td>
                <div className="staff-name">
                  <div className="avatar">{getInitials(member.first_name, member.last_name)}</div>
                  <span className="staff-name-text">{member.first_name} {member.last_name}</span>
                </div>
              </td>
              <td className="email-cell">{member.email}</td>
              <td>
                <span className={`role-badge ${getRoleClass(member.role)}`}>{member.role}</span>
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
