const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/permissionMiddleware');

router.use(authMiddleware);

router.get('/', checkPermission('roles', 'read'), roleController.getAllRoles);
router.get('/:id', checkPermission('roles', 'read'), roleController.getRole);
router.post('/', checkPermission('roles', 'create'), roleController.createRole);
router.put('/:id', checkPermission('roles', 'update'), roleController.updateRole);
router.delete('/:id', checkPermission('roles', 'delete'), roleController.deleteRole);

module.exports = router;

