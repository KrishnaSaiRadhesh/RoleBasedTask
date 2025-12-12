import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-brand">
          <h2>Admin Platform</h2>
        </div>
        <div className="nav-links">
          {user && (user.isAdmin || hasPermission('users', 'read')) && (
            <Link to="/users" className="nav-link">Users</Link>
          )}
          {user && (user.isAdmin || hasPermission('tasks', 'read')) && (
            <Link to="/tasks" className="nav-link">Tasks</Link>
          )}
          {user && (user.isAdmin || hasPermission('roles', 'read')) && (
            <Link to="/roles" className="nav-link">Roles</Link>
          )}
        </div>
        <div className="nav-user">
          {user && (
            <>
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.isAdmin ? 'Admin' : user.role?.name || 'No Role'}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          )}
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

