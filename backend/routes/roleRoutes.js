const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/permissionMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Get all roles - requires read permission
router.get('/', checkPermission('roles', 'read'), roleController.getAllRoles);

// Get single role - requires read permission
router.get('/:id', checkPermission('roles', 'read'), roleController.getRole);

// Create role - requires create permission
router.post('/', checkPermission('roles', 'create'), roleController.createRole);

// Update role - requires update permission
router.put('/:id', checkPermission('roles', 'update'), roleController.updateRole);

// Delete role - requires delete permission
router.delete('/:id', checkPermission('roles', 'delete'), roleController.deleteRole);

module.exports = router;

