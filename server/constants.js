const ALLOWED_STAFF_ROLES = ['Doctor', 'Nurse', 'Admin', 'Receptionist'];

function isAllowedRole(role) {
  return ALLOWED_STAFF_ROLES.includes(role);
}

module.exports = {
  ALLOWED_STAFF_ROLES,
  isAllowedRole,
};
