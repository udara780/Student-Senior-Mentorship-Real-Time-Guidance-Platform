const User = require('../models/user');

// @route   GET /api/users/seniors
// @desc    Get all seniors (for students to browse)
// @access  Private
const getSeniors = async (req, res) => {
  try {
    const seniors = await User.find({ role: 'senior' }).select('-password');
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
    const students = await User.find({ role: 'student' }).select('-password');
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
// @desc    Update logged-in user's profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { name, skills, studentId, academicYear, semester, gpa, interestedInMentorship } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (skills !== undefined) user.skills = skills;
    if (studentId !== undefined) user.studentId = studentId === '' ? undefined : studentId;
    if (academicYear !== undefined) user.academicYear = academicYear === '' ? undefined : academicYear;
    if (semester !== undefined) user.semester = semester === '' ? undefined : semester;
    if (gpa !== undefined) user.gpa = gpa === '' ? undefined : Number(gpa);
    if (interestedInMentorship !== undefined) user.interestedInMentorship = interestedInMentorship;

    const updated = await user.save();

    res.json({
      message: 'Profile updated',
      user: {
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        skills: updated.skills,
        studentId: updated.studentId,
        academicYear: updated.academicYear,
        semester: updated.semester,
        gpa: updated.gpa,
        interestedInMentorship: updated.interestedInMentorship,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// @route   PUT /api/users/profile/photo
// @desc    Upload/update logged-in user's profile photo
// @access  Private
const updateProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Build a publicly accessible URL path
    const photoUrl = `/uploads/profiles/${req.file.filename}`;
    user.profilePhoto = photoUrl;

    const updated = await user.save();

    res.json({
      message: 'Profile photo updated',
      profilePhoto: updated.profilePhoto,
    });
  } catch (error) {
    console.error('Update photo error:', error.message);
    res.status(500).json({ message: 'Server error updating profile photo' });
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

module.exports = { getSeniors, getStudents, getUserProfile, updateUserProfile, updateProfilePhoto, getUserById };
