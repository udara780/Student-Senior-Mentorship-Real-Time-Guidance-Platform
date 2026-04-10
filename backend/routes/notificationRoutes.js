const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// GET /api/notifications/my — fetch all notifications for the logged-in user
router.get('/my', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching notifications' });
  }
});

// PUT /api/notifications/:id/read — mark a notification as read
router.put('/:id/read', protect, async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true }
    );
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
