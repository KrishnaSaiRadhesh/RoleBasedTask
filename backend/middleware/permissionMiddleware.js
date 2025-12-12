const checkPermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      // Admin has full access
      if (user.isAdmin) {
        return next();
      }

      // Check if user has a role
      if (!user.role) {
        return res.status(403).json({ message: 'No role assigned. Access denied' });
      }

      // Check permissions
      const permissions = user.role.permissions[resource];
      if (!permissions || !permissions[action]) {
        return res.status(403).json({ 
          message: `You don't have permission to ${action} ${resource}` 
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: 'Permission check failed', error: error.message });
    }
  };
};

module.exports = checkPermission;

