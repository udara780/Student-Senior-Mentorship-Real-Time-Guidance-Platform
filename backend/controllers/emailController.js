const { sendMeetingLinkEmail } = require('../utils/emailService');
const Session = require('../models/Session');

// @route  POST /api/sessions/send-meeting-link
// @desc   Open Teams + send meeting link email to the student
// @access Private (Senior only)
const sendMeetingLink = async (req, res) => {
  try {
    const { studentEmail, studentName, meetingLink, sessionTime, sessionId } = req.body;

    // Validate required fields
    if (!studentEmail || !meetingLink) {
      return res.status(400).json({
        message: 'studentEmail and meetingLink are required.',
      });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentEmail)) {
      return res.status(400).json({ message: 'Invalid student email address.' });
    }

    // Send the email — fire and forget (don't block response on SMTP)
    await sendMeetingLinkEmail({
      studentEmail,
      studentName: studentName || 'Student',
      meetingLink,
      sessionTime: sessionTime || 'Session time not specified',
      mentorName: req.user?.name || 'Your Mentor',
    });

    return res.json({ message: 'Meeting link sent to student successfully.' });
  } catch (error) {
    console.error('sendMeetingLink error:', error.message);
    return res.status(500).json({
      message: 'Failed to send meeting link email.',
      error: error.message,
    });
  }
};

module.exports = { sendMeetingLink };
