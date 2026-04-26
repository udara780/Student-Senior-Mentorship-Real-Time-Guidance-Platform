const User = require('../models/user');
const Request = require('../models/Request');
const Session = require('../models/Session');
const Notification = require('../models/Notification');

// @route   GET /api/admin/stats
// @desc    Get platform-wide statistics
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalMentors, totalStudents, pendingMentorRequests, totalSessions, activeSessions] =
      await Promise.all([
        User.countDocuments({ role: { $ne: 'admin' } }),
        User.countDocuments({ role: 'senior' }),
        User.countDocuments({ role: 'student' }),
        User.countDocuments({ mentorStatus: 'pending' }),
        Session.countDocuments(),
        Session.countDocuments({ status: 'scheduled' }),
      ]);

    res.json({
      totalUsers,
      totalMentors,
      totalStudents,
      pendingMentorRequests,
      totalSessions,
      activeSessions,
    });
  } catch (error) {
    console.error('Admin stats error:', error.message);
    res.status(500).json({ message: 'Server error fetching admin stats' });
  }
};

// @route   GET /api/admin/mentor-requests
// @desc    Get all users with pending mentor applications
// @access  Private/Admin
const getPendingMentorRequests = async (req, res) => {
  try {
    const pending = await User.find({ mentorStatus: 'pending' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(pending);
  } catch (error) {
    console.error('Get pending mentor requests error:', error.message);
    res.status(500).json({ message: 'Server error fetching mentor requests' });
  }
};

// @route   PUT /api/admin/mentor-requests/:id/approve
// @desc    Approve a mentor request — flip role to 'senior'
// @access  Private/Admin
const approveMentorRequest = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.mentorStatus !== 'pending') {
      return res.status(400).json({ message: `Cannot approve — current status is '${user.mentorStatus}'` });
    }

    user.role = 'senior';
    user.mentorStatus = 'approved';
    user.isVerified = true;
    await user.save();

    // Send in-app notification to the approved user
    await Notification.create({
      recipient: user._id,
      type: 'mentor_approved',
      message: '🎉 Congratulations! Your mentor application has been approved. You are now a verified mentor on the platform.',
      link: '/profile',
    });

    res.json({ message: `${user.name} has been approved as a mentor`, user });
  } catch (error) {
    console.error('Approve mentor error:', error.message);
    res.status(500).json({ message: 'Server error approving mentor request' });
  }
};

// @route   PUT /api/admin/mentor-requests/:id/reject
// @desc    Reject a mentor request — user stays as student
// @access  Private/Admin
const rejectMentorRequest = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.mentorStatus !== 'pending') {
      return res.status(400).json({ message: `Cannot reject — current status is '${user.mentorStatus}'` });
    }

    user.mentorStatus = 'rejected';
    user.interestedInMentorship = false;
    await user.save();

    // Send in-app notification to the rejected user
    await Notification.create({
      recipient: user._id,
      type: 'mentor_rejected',
      message: 'Your mentor application was not approved at this time. You may update your profile and re-apply.',
      link: '/profile',
    });

    res.json({ message: `${user.name}'s mentor request has been rejected`, user });
  } catch (error) {
    console.error('Reject mentor error:', error.message);
    res.status(500).json({ message: 'Server error rejecting mentor request' });
  }
};

// @route   GET /api/admin/users
// @desc    Get all non-admin users with pagination
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const { role, mentorStatus, search, page = 1, limit = 20 } = req.query;

    const filter = { role: { $ne: 'admin' } };
    if (role) filter.role = role;
    if (mentorStatus) filter.mentorStatus = mentorStatus;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Get all users error:', error.message);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

module.exports = {
  getDashboardStats,
  getPendingMentorRequests,
  approveMentorRequest,
  rejectMentorRequest,
  getAllUsers,
};
