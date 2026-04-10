const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Protect routes — verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Role-based access — only allow specified roles
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(' or ')}`,
      });
    }
    next();
  };
};

// Mentorship-based access — only allow users with interestedInMentorship: true
const requireMentorship = (req, res, next) => {
  if (!req.user.interestedInMentorship) {
    return res.status(403).json({
      message: 'Access denied. Only users opted into mentorship can perform this action.',
    });
  }
  next();
};

module.exports = { protect, requireRole, requireMentorship };
