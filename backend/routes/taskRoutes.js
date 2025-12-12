const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/permissionMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Get all tasks - requires read permission
router.get('/', checkPermission('tasks', 'read'), taskController.getAllTasks);

// Get single task - requires read permission
router.get('/:id', checkPermission('tasks', 'read'), taskController.getTask);

// Create task - requires create permission
router.post('/', checkPermission('tasks', 'create'), taskController.createTask);

// Update task - requires update permission
router.put('/:id', checkPermission('tasks', 'update'), taskController.updateTask);

// Delete task - requires delete permission
router.delete('/:id', checkPermission('tasks', 'delete'), taskController.deleteTask);

module.exports = router;

