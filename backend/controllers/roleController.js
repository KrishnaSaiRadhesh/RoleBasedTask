const Role = require('../models/Role');

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    res.json({ success: true, roles });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch roles', error: error.message });
  }
};

// Get single role
exports.getRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json({ success: true, role });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch role', error: error.message });
  }
};

// Create role
exports.createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Please provide a role name' });
    }

    const roleExists = await Role.findOne({ name });
    if (roleExists) {
      return res.status(400).json({ message: 'Role already exists' });
    }

    const defaultPermissions = {
      tasks: { create: false, read: false, update: false, delete: false },
      roles: { create: false, read: false, update: false, delete: false },
      users: { create: false, read: false, update: false, delete: false }
    };

    const role = await Role.create({
      name,
      permissions: permissions || defaultPermissions
    });

    res.status(201).json({ success: true, role });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create role', error: error.message });
  }
};

// Update role
exports.updateRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { name, permissions },
      { new: true, runValidators: true }
    );

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.json({ success: true, role });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update role', error: error.message });
  }
};

// Delete role
exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.json({ success: true, message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete role', error: error.message });
  }
};

