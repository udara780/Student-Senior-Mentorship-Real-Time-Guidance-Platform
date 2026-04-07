const express = require('express');
const router = express.Router();
const {
  sendRequest,
  getMyRequests,
  getIncomingRequests,
  updateRequestStatus,
} = require('../controllers/requestController');
const { protect, requireRole } = require('../middleware/auth');

// POST /api/requests — Student sends a request
router.post('/', protect, requireRole('student'), sendRequest);

// GET /api/requests/my — Student views their sent requests
router.get('/my', protect, requireRole('student'), getMyRequests);

// GET /api/requests/incoming — Senior views incoming requests
router.get('/incoming', protect, requireRole('senior'), getIncomingRequests);

// PUT /api/requests/:id — Senior accepts/rejects
router.put('/:id', protect, requireRole('senior'), updateRequestStatus);

module.exports = router;
