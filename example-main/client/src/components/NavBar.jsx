import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext.jsx';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/stores" className="brand">Store Ratings</Link>
      </div>
      <div className="nav-right">
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup" className="primary">Sign Up</Link>
          </>
        )}
        {user && (
          <>
            <span className="muted">Hi, {user.name} ({user.role})</span>
            <Link to="/stores">Stores</Link>
            {user.role === 'USER' && <Link to="/dashboard/user">My Dashboard</Link>}
            {user.role === 'OWNER' && <Link to="/dashboard/owner">Owner</Link>}
            {user.role === 'ADMIN' && <Link to="/dashboard/admin">Admin</Link>}
            <button className="ghost" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
