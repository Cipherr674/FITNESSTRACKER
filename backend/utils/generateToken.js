const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  // Make sure you have a JWT_SECRET set in your environment variables
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = generateToken; 