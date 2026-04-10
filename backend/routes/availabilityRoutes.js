const express = require('express');
const router = express.Router();
const {
  createSlot,
  getMySlots,
  getSlotsBySenior,
  deleteSlot,
  updateSlot,
  sendMeetingLinkToStudent,
} = require('../controllers/availabilityController');
const { protect } = require('../middleware/auth');

// POST /api/availability — mentor creates a slot (meeting link auto-generated)
router.post('/', protect, createSlot);

// PUT /api/availability/:id — mentor updates a slot
router.put('/:id', protect, updateSlot);

// GET /api/availability/my — mentor views their own slots
router.get('/my', protect, getMySlots);

// POST /api/availability/:id/send-link — send meeting link to assigned student
router.post('/:id/send-link', protect, sendMeetingLinkToStudent);

// GET /api/availability/:seniorId — student views unbooked slots for a mentor
router.get('/:seniorId', protect, getSlotsBySenior);

// DELETE /api/availability/:id — mentor deletes a slot
router.delete('/:id', protect, deleteSlot);

module.exports = router;
