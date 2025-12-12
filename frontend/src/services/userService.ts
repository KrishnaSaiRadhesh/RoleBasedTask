import api from './api';
import type { User } from '../types';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  roleId?: string | null;
  hasAccess?: boolean;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  roleId?: string | null;
  hasAccess?: boolean;
}

export const userService = {
  getAll: async (): Promise<{ success: boolean; users: User[] }> => {
    const response = await api.get('/users');
    return response.data;
  },

  getById: async (id: string): Promise<{ success: boolean; user: User }> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (data: CreateUserData): Promise<{ success: boolean; user: User }> => {
    const response = await api.post('/users', data);
    return response.data;
  },

  update: async (id: string, data: UpdateUserData): Promise<{ success: boolean; user: User }> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

