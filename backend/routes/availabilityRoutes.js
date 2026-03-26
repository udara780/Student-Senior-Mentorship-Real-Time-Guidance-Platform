const express = require('express');
const router = express.Router();
const {
  createSlot,
  getMySlots,
  getSlotsBySenior,
  deleteSlot,
  updateSlot,
} = require('../controllers/availabilityController');
const { protect, requireRole } = require('../middleware/auth');

// POST /api/availability — senior creates a slot
router.post('/', protect, requireRole('senior'), createSlot);

// PUT /api/availability/:id — senior updates a slot
router.put('/:id', protect, requireRole('senior'), updateSlot);

// GET /api/availability/my — senior views their own slots
router.get('/my', protect, requireRole('senior'), getMySlots);

// GET /api/availability/:seniorId — student views unbooked slots for a senior
router.get('/:seniorId', protect, getSlotsBySenior);

// DELETE /api/availability/:id — senior deletes a slot
router.delete('/:id', protect, requireRole('senior'), deleteSlot);

module.exports = router;
