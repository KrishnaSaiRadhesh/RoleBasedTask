import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/taskService';
import type { Task } from '../services/taskService';
import { userService } from '../services/userService';
import type { User } from '../types';
import { Layout } from '../components/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import './Tasks.css';

export const Tasks = () => {
  const { hasPermission, user: currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending' as 'pending' | 'in-progress' | 'completed',
    assignedTo: '',
  });
  const [error, setError] = useState('');

  const canCreate = currentUser?.isAdmin || hasPermission('tasks', 'create');
  const canUpdate = currentUser?.isAdmin || hasPermission('tasks', 'update');
  const canDelete = currentUser?.isAdmin || hasPermission('tasks', 'delete');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksRes, usersRes] = await Promise.all([
        taskService.getAll(),
        userService.getAll(),
      ]);
      setTasks(tasksRes.tasks);
      setUsers(usersRes.users.filter(u => u.hasAccess || u.isAdmin));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      status: 'pending',
      assignedTo: '',
    });
    setShowModal(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      assignedTo: task.assignedTo?._id || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingTask) {
        await taskService.update(editingTask._id, {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          assignedTo: formData.assignedTo || null,
        });
      } else {
        await taskService.create({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          assignedTo: formData.assignedTo || null,
        });
      }
      setShowModal(false);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskService.delete(id);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'in-progress':
        return 'badge-info';
      default:
        return 'badge-warning';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requirePermission={{ resource: 'tasks', action: 'read' }}>
        <Layout>
          <div className="loading">Loading...</div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requirePermission={{ resource: 'tasks', action: 'read' }}>
      <Layout>
        <div className="tasks-page">
          <div className="page-header">
            <h1>Tasks</h1>
            {canCreate && (
              <button onClick={handleCreate} className="btn-primary">
                Create Task
              </button>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Created By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id}>
                    <td>{task.title}</td>
                    <td>{task.description || '-'}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td>{task.assignedTo?.name || 'Unassigned'}</td>
                    <td>{task.createdBy.name}</td>
                    <td>
                      <div className="action-buttons">
                        {canUpdate && (
                          <button onClick={() => handleEdit(task)} className="btn-edit">
                            Edit
                          </button>
                        )}
                        {canDelete && (
                          <button onClick={() => handleDelete(task._id)} className="btn-delete">
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
                <h2>{editingTask ? 'Edit Task' : 'Create Task'}</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Assign To</label>
                    <select
                      value={formData.assignedTo}
                      onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    >
                      <option value="">Unassigned</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {error && <div className="error-message">{error}</div>}
                  <div className="modal-actions">
                    <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      {editingTask ? 'Update' : 'Create'}
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

