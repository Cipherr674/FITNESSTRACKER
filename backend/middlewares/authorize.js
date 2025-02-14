// authorize.js
const authorize = (allowedRoles) => {
    return (req, res, next) => {
      // Assuming your authentication middleware already sets req.user
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Check if the user's role is in the allowedRoles array
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      next();
    };
  };
  
  module.exports = {authorize};
  