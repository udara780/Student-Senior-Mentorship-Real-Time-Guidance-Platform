const Request = require('../models/Request');
const Session = require('../models/Session');
const Availability = require('../models/Availability');
const mongoose = require('mongoose');

// @desc    Get dashboard statistics for the logged-in senior
// @route   GET /api/dashboard/stats
// @access  Private/Senior
const getDashboardStats = async (req, res) => {
  try {
    const seniorId = req.user._id;

    // 1. Pending Requests Count
    const pendingRequestsCount = await Request.countDocuments({
      senior: seniorId,
      status: 'pending'
    });

    // 2. Upcoming Sessions Count
    const upcomingSessionsCount = await Session.countDocuments({
      senior: seniorId,
      status: 'scheduled'
    });

    // 3. Active Mentees (Unique students from accepted requests or scheduled sessions)
    const activeMenteesIds = await Request.distinct('student', {
      senior: seniorId,
      status: 'accepted'
    });
    const uniqueMenteesCount = activeMenteesIds.length;

    // 4. Total Guidance Hours
    // Calculate total duration from completed sessions
    const completedSessions = await Session.find({
      senior: seniorId,
      status: 'completed'
    }).populate('availability');

    let totalMinutes = 0;
    completedSessions.forEach(session => {
      if (session.availability && session.availability.startTime && session.availability.endTime) {
        const [startH, startM] = session.availability.startTime.split(':').map(Number);
        const [endH, endM] = session.availability.endTime.split(':').map(Number);
        
        const duration = (endH * 60 + endM) - (startH * 60 + startM);
        if (duration > 0) totalMinutes += duration;
      }
    });

    const totalHours = Math.round(totalMinutes / 60);

    res.status(200).json({
      pendingRequests: pendingRequestsCount,
      activeMentees: uniqueMenteesCount,
      upcomingSessions: upcomingSessionsCount,
      totalGuidance: `${totalHours}h`
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboardStats
};
