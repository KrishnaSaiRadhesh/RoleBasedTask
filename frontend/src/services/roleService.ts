import api from './api';

export type Permissions = {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
};

export type RolePermissions = {
  tasks: Permissions;
  roles: Permissions;
  users: Permissions;
};

export type Role = {
  _id: string;
  name: string;
  permissions: RolePermissions;
  createdAt: string;
  updatedAt: string;
};

export type CreateRoleData = {
  name: string;
  permissions?: RolePermissions;
};

export type UpdateRoleData = {
  name?: string;
  permissions?: RolePermissions;
};

export const roleService = {
  getAll: async (): Promise<{ success: boolean; roles: Role[] }> => {
    const response = await api.get('/roles');
    return response.data;
  },

  getById: async (id: string): Promise<{ success: boolean; role: Role }> => {
    const response = await api.get(`/roles/${id}`);
    return response.data;
  },

  create: async (data: CreateRoleData): Promise<{ success: boolean; role: Role }> => {
    const response = await api.post('/roles', data);
    return response.data;
  },

  update: async (id: string, data: UpdateRoleData): Promise<{ success: boolean; role: Role }> => {
    const response = await api.put(`/roles/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/roles/${id}`);
    return response.data;
  },
};

