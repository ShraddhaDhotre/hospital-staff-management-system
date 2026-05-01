import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: 16 }}>
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a2332' }}>Page Not Found</h1>
      <p style={{ color: '#6c757d' }}>The page you are looking for does not exist.</p>
      <Link className="btn btn-primary" to="/">
        Back to Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
