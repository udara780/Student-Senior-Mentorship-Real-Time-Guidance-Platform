const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect, requireRole } = require('../middleware/auth');

// GET /api/dashboard/stats — Senior views their dashboard statistics
router.get('/stats', protect, requireRole('senior'), getDashboardStats);

module.exports = router;
