const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/admin_platform');
    console.log('Connected to MongoDB');
    const adminExists = await User.findOne({ email: 'admin@admin.com' });
    if (adminExists) {
      console.log('Admin user already exists');
      await mongoose.connection.close();
      return;
    }
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin123', 
      isAdmin: true,
      hasAccess: true
    });

    console.log('Admin user created successfully:');
    console.log('Email: admin@admin.com');
    console.log('Password: admin123');
    console.log('Please change the password after first login!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createAdmin();

