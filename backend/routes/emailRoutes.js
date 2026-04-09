const express = require('express');
const router = express.Router();
const { sendMeetingLink } = require('../controllers/emailController');
const { protect, requireRole } = require('../middleware/auth');

// POST /api/sessions/send-meeting-link
// Only logged-in seniors can trigger this
router.post('/send-meeting-link', protect, requireRole('senior', 'admin'), sendMeetingLink);

module.exports = router;
