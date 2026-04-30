function StaffTable({ staff, onEdit, onDelete }) {
  if (staff.length === 0) {
    return (
      <div className="alert alert-info mb-0" role="alert">
        No staff members found. Add one using the button above.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle mb-0">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((member) => (
            <tr key={member.id}>
              <td>{member.first_name} {member.last_name}</td>
              <td>{member.email}</td>
              <td>
                <span className="badge bg-secondary">{member.role}</span>
              </td>
              <td className="text-end">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => onEdit(member)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDelete(member)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StaffTable;
