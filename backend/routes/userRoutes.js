const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/permissionMiddleware');


router.use(authMiddleware);


router.get('/', checkPermission('users', 'read'), userController.getAllUsers);
router.get('/:id', checkPermission('users', 'read'), userController.getUser);
router.post('/', checkPermission('users', 'create'), userController.createUser);
router.put('/:id', checkPermission('users', 'update'), userController.updateUser);
router.delete('/:id', checkPermission('users', 'delete'), userController.deleteUser);

module.exports = router;

