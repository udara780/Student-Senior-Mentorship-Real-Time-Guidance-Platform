const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect, requireRole } = require('../middleware/auth');

// GET /api/dashboard/stats — Senior (or admin) views dashboard statistics
router.get('/stats', protect, requireRole('senior', 'admin'), getDashboardStats);

module.exports = router;
