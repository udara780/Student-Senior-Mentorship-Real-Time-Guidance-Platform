const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role, skills, wantsToBeMentor } = req.body;
    let profilePhoto = '';

    if (req.file) {
      profilePhoto = req.file.path.replace(/\\/g, '/'); // Normalize path for web
    }

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if role is valid (admin cannot self-register)
    if (!['student', 'senior'].includes(role)) {
      return res.status(400).json({ message: 'Role must be either student or senior' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // If wantsToBeMentor, keep role as student but flag for admin review
    const finalRole = wantsToBeMentor ? 'student' : (role || 'student');
    const mentorStatus = wantsToBeMentor ? 'pending' : 'none';

    // Create user (password hashed via pre-save hook in model)
    const user = await User.create({
      name,
      email,
      password,
      role: finalRole,
      skills: skills ? (typeof skills === 'string' ? JSON.parse(skills) : skills) : [],
      profilePhoto: profilePhoto || '',
      mentorStatus,
      isVerified: false,
    });

    res.status(201).json({
      message: wantsToBeMentor
        ? 'Registration successful. Your mentor application is pending admin review.'
        : 'Registration successful',
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        studentId: user.studentId,
        academicYear: user.academicYear,
        semester: user.semester,
        gpa: user.gpa,
        interestedInMentorship: user.interestedInMentorship,
        profilePhoto: user.profilePhoto,
        isVerified: user.isVerified,
        mentorStatus: user.mentorStatus,
      },
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        studentId: user.studentId,
        academicYear: user.academicYear,
        semester: user.semester,
        gpa: user.gpa,
        interestedInMentorship: user.interestedInMentorship,
        profilePhoto: user.profilePhoto,
        isVerified: user.isVerified,
        mentorStatus: user.mentorStatus,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = { register, login };
