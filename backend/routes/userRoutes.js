const express = require('express');
const router = express.Router();
const {
  getSeniors,
  getUserProfile,
  updateUserProfile,
  getUserById,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// GET /api/users/seniors — list all seniors
router.get('/seniors', protect, getSeniors);

// GET /api/users/profile — get own profile
router.get('/profile', protect, getUserProfile);

// PUT /api/users/profile — update own profile
router.put('/profile', protect, updateUserProfile);

// GET /api/users/:id — get any user's public profile
router.get('/:id', protect, getUserById);

module.exports = router;
