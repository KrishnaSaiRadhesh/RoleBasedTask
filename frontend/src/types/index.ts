export type User = {
  id: string;
  name: string;
  email: string;
  hasAccess: boolean;
  isAdmin: boolean;
  role?: {
    _id: string;
    name: string;
    permissions: {
      tasks: { create: boolean; read: boolean; update: boolean; delete: boolean };
      roles: { create: boolean; read: boolean; update: boolean; delete: boolean };
      users: { create: boolean; read: boolean; update: boolean; delete: boolean };
    };
  };
};

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

