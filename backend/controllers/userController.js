const User = require('../models/user');

// @route   GET /api/users/seniors
// @desc    Get all seniors (for students to browse)
// @access  Private
const getSeniors = async (req, res) => {
  try {
    const seniors = await User.find(
      { role: 'senior' },
      '-password'
    ).sort({ createdAt: -1 });

    res.json(seniors);
  } catch (error) {
    console.error('Get seniors error:', error.message);
    res.status(500).json({ message: 'Server error fetching seniors' });
  }
};

// @route   GET /api/users/students
// @desc    Get all students (for finding group members)
// @access  Private
const getStudents = async (req, res) => {
  try {
    const students = await User.find(
      { role: 'student' },
      '-password'
    ).sort({ createdAt: -1 });

    res.json(students);
  } catch (error) {
    console.error('Get students error:', error.message);
    res.status(500).json({ message: 'Server error fetching students' });
  }
};

// @route   GET /api/users/profile
// @desc    Get logged-in user's profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

// @route   PUT /api/users/profile
// @desc    Update logged-in user's profile (bio, skills, name)
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { name, bio, skills } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = skills;

    const updated = await user.save();

    res.json({
      message: 'Profile updated',
      user: {
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        bio: updated.bio,
        skills: updated.skills,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// @route   GET /api/users/:id
// @desc    Get a single user's public profile by ID
// @access  Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error.message);
    res.status(500).json({ message: 'Server error fetching user' });
  }
};

module.exports = { getSeniors, getStudents, getUserProfile, updateUserProfile, getUserById };
