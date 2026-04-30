import { Link } from 'react-router-dom';

function AppNavbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container">
        <Link className="navbar-brand fw-semibold" to="/">
          Staff Management
        </Link>
      </div>
    </nav>
  );
}

export default AppNavbar;
