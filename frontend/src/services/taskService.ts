import api from './api';

export type Task = {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskData = {
  title: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  assignedTo?: string | null;
};

export type UpdateTaskData = {
  title?: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  assignedTo?: string | null;
};

export const taskService = {
  getAll: async (): Promise<{ success: boolean; tasks: Task[] }> => {
    const response = await api.get('/tasks');
    return response.data;
  },

  getById: async (id: string): Promise<{ success: boolean; task: Task }> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  create: async (data: CreateTaskData): Promise<{ success: boolean; task: Task }> => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTaskData): Promise<{ success: boolean; task: Task }> => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

