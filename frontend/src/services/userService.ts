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
  _id: string;
  name?: string;
  email?: string;
  roleId?: string | null;
  hasAccess?: boolean;
}

const normalizeUser = (user: any): User => ({
  ...user,
  id: user._id,
});

export const userService = {
  getAll: async (): Promise<{ success: boolean; users: User[] }> => {
    const response = await api.get('/users');
    return {
      ...response.data,
      users: response.data.users.map(normalizeUser),
    };
  },

  getById: async (id: string): Promise<{ success: boolean; user: User }> => {
    const response = await api.get(`/users/${id}`);
    return {
      ...response.data,
      user: normalizeUser(response.data.user),
    };
  },

  create: async (
    data: CreateUserData
  ): Promise<{ success: boolean; user: User }> => {
    const response = await api.post('/users', data);
    return {
      ...response.data,
      user: normalizeUser(response.data.user),
    };
  },

  update: async (
    id: string,
    data: UpdateUserData
  ): Promise<{ success: boolean; user: User }> => {
    const response = await api.put(`/users/${id}`, data);
    return {
      ...response.data,
      user: normalizeUser(response.data.user),
    };
  },

  delete: async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
