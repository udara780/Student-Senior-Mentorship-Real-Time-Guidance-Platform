const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getPendingMentorRequests,
  approveMentorRequest,
  rejectMentorRequest,
  getAllUsers,
} = require('../controllers/adminController');
const { protect, requireRole } = require('../middleware/auth');

// All admin routes require authentication + admin role
router.use(protect, requireRole('admin'));

// GET  /api/admin/stats                      — Platform overview stats
router.get('/stats', getDashboardStats);

// GET  /api/admin/mentor-requests            — All pending mentor applications
router.get('/mentor-requests', getPendingMentorRequests);

// PUT  /api/admin/mentor-requests/:id/approve — Approve a mentor application
router.put('/mentor-requests/:id/approve', approveMentorRequest);

// PUT  /api/admin/mentor-requests/:id/reject  — Reject a mentor application
router.put('/mentor-requests/:id/reject', rejectMentorRequest);

// GET  /api/admin/users                      — All users (with filtering & pagination)
router.get('/users', getAllUsers);

module.exports = router;
