const express = require('express');
const router = express.Router();
const {
  getSeniors,
  getStudents,
  getUserProfile,
  updateUserProfile,
  updateProfilePhoto,
  getUserById,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');

// GET /api/users/profile — get own profile
router.get('/profile', protect, getUserProfile);

// PUT /api/users/profile — update own profile (text fields)
router.put('/profile', protect, updateUserProfile);

// PUT /api/users/profile/photo — upload profile photo
router.put('/profile/photo', protect, upload.single('profilePhoto'), updateProfilePhoto);

// GET /api/users/seniors — get all seniors
router.get('/seniors', protect, getSeniors);

// GET /api/users/students — get all students
router.get('/students', protect, getStudents);

// GET /api/users/:id — get any user's public profile
router.get('/:id', protect, getUserById);

module.exports = router;
