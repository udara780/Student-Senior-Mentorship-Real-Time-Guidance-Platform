const express = require('express');
const router = express.Router();
const {
  sendGroupRequest,
  getIncomingGroupRequests,
  getMyGroupRequestResponses,
  approveGroupRequest,
  rejectGroupRequest,
} = require('../controllers/groupRequestController');
const { protect } = require('../middleware/auth');

// POST /api/group-requests — Any logged-in user sends a join request
router.post('/', protect, sendGroupRequest);

// GET /api/group-requests/incoming — Leader fetches pending requests for their groups
router.get('/incoming', protect, getIncomingGroupRequests);

// GET /api/group-requests/responses — Student fetches their resolved requests
router.get('/responses', protect, getMyGroupRequestResponses);

// PUT /api/group-requests/:id/approve — Leader approves a request
router.put('/:id/approve', protect, approveGroupRequest);

// PUT /api/group-requests/:id/reject — Leader rejects a request
router.put('/:id/reject', protect, rejectGroupRequest);

module.exports = router;
