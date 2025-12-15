const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/permissionMiddleware');


router.use(authMiddleware);

router.get('/', checkPermission('tasks', 'read'), taskController.getAllTasks);
router.get('/:id', checkPermission('tasks', 'read'), taskController.getTask);
router.post('/', checkPermission('tasks', 'create'), taskController.createTask);
router.put('/:id', checkPermission('tasks', 'update'), taskController.updateTask);
router.delete('/:id', checkPermission('tasks', 'delete'), taskController.deleteTask);

module.exports = router;

