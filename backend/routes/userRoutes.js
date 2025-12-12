const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/permissionMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Get all users - requires read permission
router.get('/', checkPermission('users', 'read'), userController.getAllUsers);

// Get single user - requires read permission
router.get('/:id', checkPermission('users', 'read'), userController.getUser);

// Create user - requires create permission
router.post('/', checkPermission('users', 'create'), userController.createUser);

// Update user - requires update permission
router.put('/:id', checkPermission('users', 'update'), userController.updateUser);

// Delete user - requires delete permission
router.delete('/:id', checkPermission('users', 'delete'), userController.deleteUser);

module.exports = router;

