const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  create: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
  update: { type: Boolean, default: false },
  delete: { type: Boolean, default: false }
}, { _id: false });

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  permissions: {
    tasks: {
      type: permissionSchema,
      default: { create: false, read: false, update: false, delete: false }
    },
    roles: {
      type: permissionSchema,
      default: { create: false, read: false, update: false, delete: false }
    },
    users: {
      type: permissionSchema,
      default: { create: false, read: false, update: false, delete: false }
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Role', roleSchema);

