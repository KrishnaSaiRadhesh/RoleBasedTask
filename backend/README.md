# Backend API

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/admin_platform
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
```

3. Make sure MongoDB is running on your system

4. Create admin user:
```bash
node scripts/createAdmin.js
```

5. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user (requires auth)

### Users (requires auth + permissions)
- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get single user
- POST `/api/users` - Create user
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

### Tasks (requires auth + permissions)
- GET `/api/tasks` - Get all tasks
- GET `/api/tasks/:id` - Get single task
- POST `/api/tasks` - Create task
- PUT `/api/tasks/:id` - Update task
- DELETE `/api/tasks/:id` - Delete task

### Roles (requires auth + permissions)
- GET `/api/roles` - Get all roles
- GET `/api/roles/:id` - Get single role
- POST `/api/roles` - Create role
- PUT `/api/roles/:id` - Update role
- DELETE `/api/roles/:id` - Delete role

## Default Admin Credentials
- Email: admin@admin.com
- Password: admin123

**Important:** Change the admin password after first login!

