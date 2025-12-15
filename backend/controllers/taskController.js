const Task = require('../models/Task');

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch task', error: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, assignedTo } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Please provide a title' });
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'pending',
      assignedTo: assignedTo || null,
      createdBy: req.user._id
    });

    const taskResponse = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json({ success: true, task: taskResponse });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, assignedTo } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, assignedTo },
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
};

