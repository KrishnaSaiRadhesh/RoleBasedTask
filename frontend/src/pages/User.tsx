import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import type { User } from '../types';
import { roleService } from '../services/roleService';
import type { Role } from '../services/roleService';
import { Layout } from '../components/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import './Users.css';

export const Users = () => {
  const { hasPermission, user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleId: '',
    hasAccess: false,
  });
  const [error, setError] = useState('');

  const canCreate = currentUser?.isAdmin || hasPermission('users', 'create');
  const canUpdate = currentUser?.isAdmin || hasPermission('users', 'update');
  const canDelete = currentUser?.isAdmin || hasPermission('users', 'delete');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, rolesRes] = await Promise.all([
        userService.getAll(),
        roleService.getAll(),
      ]);
      setUsers(usersRes.users);
      setRoles(rolesRes.roles);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      roleId: '',
      hasAccess: false,
    });
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      roleId: user.role?._id || '',
      hasAccess: user.hasAccess,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingUser) {
        const updateData: any = {
          name: formData.name,
          email: formData.email,
          roleId: formData.roleId || null,
          hasAccess: formData.hasAccess,
        };
        await userService.update(editingUser._id, updateData);
      } else {
        if (!formData.password) {
          setError('Password is required');
          return;
        }
        await userService.create({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          roleId: formData.roleId || null,
          hasAccess: formData.hasAccess,
        });
      }
      setShowModal(false);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await userService.delete(id);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requirePermission={{ resource: 'users', action: 'read' }}>
        <Layout>
          <div className="loading">Loading...</div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requirePermission={{ resource: 'users', action: 'read' }}>
      <Layout>
        <div className="users-page">
          <div className="page-header">
            <h1>Users</h1>
            {canCreate && (
              <button onClick={handleCreate} className="btn-primary">
                Create User
              </button>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Access</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role?.name || 'No Role'}</td>
                    <td>
                      <span className={`badge ${user.hasAccess ? 'badge-success' : 'badge-warning'}`}>
                        {user.hasAccess ? 'Granted' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {canUpdate && (
                          <button onClick={() => handleEdit(user)} className="btn-edit">
                            Edit
                          </button>
                        )}
                        {canDelete && !user.isAdmin && (
                          <button onClick={() => handleDelete(user._id)} className="btn-delete">
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{editingUser ? 'Edit User' : 'Create User'}</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  {!editingUser && (
                    <div className="form-group">
                      <label>Password</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                    </div>
                  )}
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      value={formData.roleId}
                      onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                    >
                      <option value="">No Role</option>
                      {roles.map((role) => (
                        <option key={role._id} value={role._id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.hasAccess}
                          onChange={(e) =>
                            setFormData({ ...formData, hasAccess: e.target.checked })
                          }
                        />
                        <span>Grant Access</span>
                      </label>
                </div>
                  {error && <div className="error-message">{error}</div>}
                  <div className="modal-actions">
                    <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      {editingUser ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};