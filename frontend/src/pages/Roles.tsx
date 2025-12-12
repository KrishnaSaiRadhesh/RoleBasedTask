import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { roleService } from '../services/roleService';
import type { Role, RolePermissions } from '../services/roleService';
import { Layout } from '../components/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import './Roles.css';

export const Roles = () => {
  const { hasPermission, user: currentUser } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    permissions: RolePermissions;
  }>({
    name: '',
    permissions: {
      tasks: { create: false, read: false, update: false, delete: false },
      roles: { create: false, read: false, update: false, delete: false },
      users: { create: false, read: false, update: false, delete: false },
    },
  });
  const [error, setError] = useState('');

  const canCreate = currentUser?.isAdmin || hasPermission('roles', 'create');
  const canUpdate = currentUser?.isAdmin || hasPermission('roles', 'update');
  const canDelete = currentUser?.isAdmin || hasPermission('roles', 'delete');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await roleService.getAll();
      setRoles(response.roles);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingRole(null);
    setFormData({
      name: '',
      permissions: {
        tasks: { create: false, read: false, update: false, delete: false },
        roles: { create: false, read: false, update: false, delete: false },
        users: { create: false, read: false, update: false, delete: false },
      },
    });
    setShowModal(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      permissions: role.permissions,
    });
    setShowModal(true);
  };

  const handlePermissionChange = (
    resource: 'tasks' | 'roles' | 'users',
    action: 'create' | 'read' | 'update' | 'delete',
    value: boolean
  ) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [resource]: {
          ...formData.permissions[resource],
          [action]: value,
        },
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingRole) {
        await roleService.update(editingRole._id, {
          name: formData.name,
          permissions: formData.permissions,
        });
      } else {
        await roleService.create({
          name: formData.name,
          permissions: formData.permissions,
        });
      }
      setShowModal(false);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;

    try {
      await roleService.delete(id);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete role');
    }
  };

  const renderPermissions = (permissions: RolePermissions) => {
    return (
      <div className="permissions-display">
        {(['tasks', 'roles', 'users'] as const).map((resource) => (
          <div key={resource} className="permission-resource">
            <strong>{resource}:</strong>
            {(['create', 'read', 'update', 'delete'] as const).map((action) => (
              <span
                key={action}
                className={`permission-badge ${permissions[resource][action] ? 'active' : ''}`}
              >
                {action}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute requirePermission={{ resource: 'roles', action: 'read' }}>
        <Layout>
          <div className="loading">Loading...</div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requirePermission={{ resource: 'roles', action: 'read' }}>
      <Layout>
        <div className="roles-page">
          <div className="page-header">
            <h1>Roles</h1>
            {canCreate && (
              <button onClick={handleCreate} className="btn-primary">
                Create Role
              </button>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Permissions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role._id}>
                    <td>{role.name}</td>
                    <td>{renderPermissions(role.permissions)}</td>
                    <td>
                      <div className="action-buttons">
                        {canUpdate && (
                          <button onClick={() => handleEdit(role)} className="btn-edit">
                            Edit
                          </button>
                        )}
                        {canDelete && (
                          <button onClick={() => handleDelete(role._id)} className="btn-delete">
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
              <div className="modal-content modal-content-large" onClick={(e) => e.stopPropagation()}>
                <h2>{editingRole ? 'Edit Role' : 'Create Role'}</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Role Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="permissions-section">
                    <h3>Permissions</h3>
                    {(['tasks', 'roles', 'users'] as const).map((resource) => (
                      <div key={resource} className="permission-group">
                        <h4>{resource.charAt(0).toUpperCase() + resource.slice(1)}</h4>
                        <div className="permission-checkboxes">
                          {(['create', 'read', 'update', 'delete'] as const).map((action) => (
                            <label key={action} className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={formData.permissions[resource][action]}
                                onChange={(e) =>
                                  handlePermissionChange(resource, action, e.target.checked)
                                }
                              />
                              <span>{action}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {error && <div className="error-message">{error}</div>}
                  <div className="modal-actions">
                    <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      {editingRole ? 'Update' : 'Create'}
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

