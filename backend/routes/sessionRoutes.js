const express = require('express');
const router = express.Router();
const {
  bookSession,
  getMySessions,
  updateSessionStatus,
} = require('../controllers/sessionController');
const { protect, requireRole } = require('../middleware/auth');

// POST /api/sessions — Student books an available slot
router.post('/', protect, requireRole('student'), bookSession);

// GET /api/sessions — User views their own sessions
router.get('/', protect, getMySessions);

// PUT /api/sessions/:id — User updates session status (e.g., mark as completed or cancelled)
router.put('/:id', protect, updateSessionStatus);

module.exports = router;
