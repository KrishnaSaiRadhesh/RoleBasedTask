const User = require('../models/User');
const Role = require('../models/Role');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('role').select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('role').select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, roleId, hasAccess } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (roleId) {
      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(404).json({ message: 'Role not found' });
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      role: roleId || null,
      hasAccess: hasAccess !== undefined ? hasAccess : false
    });

    const userResponse = await User.findById(user._id).populate('role').select('-password');

    res.status(201).json({ success: true, user: userResponse });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, roleId, hasAccess } = req.body;
    const userId = req.params.id;

    const updateData = { name, email, hasAccess };

    if (roleId) {
      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(404).json({ message: 'Role not found' });
      }
      updateData.role = roleId;
    } else if (roleId === null) {
      updateData.role = null;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).populate('role').select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isAdmin) {
      return res.status(403).json({ message: 'Cannot delete admin user' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

