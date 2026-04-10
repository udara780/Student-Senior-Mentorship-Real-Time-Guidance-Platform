const express = require('express');
const router = express.Router();
const {
  sendRequest,
  getMyRequests,
  getIncomingRequests,
  updateRequestStatus,
} = require('../controllers/requestController');
const { protect, requireRole, requireMentorship } = require('../middleware/auth');

// POST /api/requests — Student sends a request
router.post('/', protect, requireRole('student'), sendRequest);

// GET /api/requests/my — Any logged-in user views their sent requests
router.get('/my', protect, getMyRequests);

// GET /api/requests/incoming — Users with interestedInMentorship:true view incoming requests
router.get('/incoming', protect, requireMentorship, getIncomingRequests);

// PUT /api/requests/:id — Users with interestedInMentorship:true accept/reject requests
router.put('/:id', protect, requireMentorship, updateRequestStatus);

module.exports = router;

