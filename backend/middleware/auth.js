const authorize = (roles = []) => {
  return (req, res, next) => {
    // Add admin role verification
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
}; 