const checkPermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (user.isAdmin) {
        return next();
      }

      if (!user.role) {
        return res.status(403).json({ message: 'No role assigned. Access denied' });
      }

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

