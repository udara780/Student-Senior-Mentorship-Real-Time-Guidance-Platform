const Availability = require('../models/Availability');

// @route   POST /api/availability
// @desc    Senior creates a new time slot
// @access  Private (senior only)
const createSlot = async (req, res) => {
  try {
    const { date, startTime, endTime, note } = req.body;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({ message: 'Date, start time, and end time are required' });
    }

    // Prevent duplicate slots for the same senior
    const existing = await Availability.findOne({
      senior: req.user._id,
      date,
      startTime,
    });

    if (existing) {
      return res.status(400).json({ message: 'You already have a slot at this date and time' });
    }

    const slot = await Availability.create({
      senior: req.user._id,
      date,
      startTime,
      endTime,
      isBooked: req.body.isBooked === true,
      note: note || '',
    });

    res.status(201).json({ message: 'Time slot created', slot });
  } catch (error) {
    console.error('Create slot error:', error.message);
    res.status(500).json({ message: 'Server error creating slot' });
  }
};

// @route   GET /api/availability/my
// @desc    Senior views their own slots
// @access  Private (senior only)
const getMySlots = async (req, res) => {
  try {
    const slots = await Availability.find({ senior: req.user._id }).sort({ date: 1, startTime: 1 });
    res.json(slots);
  } catch (error) {
    console.error('Get my slots error:', error.message);
    res.status(500).json({ message: 'Server error fetching slots' });
  }
};

// @route   GET /api/availability/:seniorId
// @desc    Student views available (not booked) slots for a specific senior
// @access  Private
const getSlotsBySenior = async (req, res) => {
  try {
    const slots = await Availability.find({
      senior: req.params.seniorId,
      isBooked: false,
    }).sort({ date: 1, startTime: 1 });

    res.json(slots);
  } catch (error) {
    console.error('Get slots by senior error:', error.message);
    res.status(500).json({ message: 'Server error fetching slots' });
  }
};

// @route   PUT /api/availability/:id
// @desc    Senior updates one of their slots
// @access  Private (senior only)
const updateSlot = async (req, res) => {
  try {
    const slot = await Availability.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    // Only the senior who created it can modify it
    if (slot.senior.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this slot' });
    }

    const { date, startTime, endTime, isBooked } = req.body;
    
    if (date) slot.date = date;
    if (startTime) slot.startTime = startTime;
    if (endTime) slot.endTime = endTime;
    if (isBooked !== undefined) slot.isBooked = isBooked;

    await slot.save();
    res.json({ message: 'Slot updated successfully', slot });
  } catch (error) {
    console.error('Update slot error:', error.message);
    res.status(500).json({ message: 'Server error updating slot' });
  }
};

// @route   DELETE /api/availability/:id
// @desc    Senior deletes one of their slots
// @access  Private (senior only)
const deleteSlot = async (req, res) => {
  try {
    const slot = await Availability.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    // Only the senior who created it can delete it
    if (slot.senior.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this slot' });
    }

    await slot.deleteOne();
    res.json({ message: 'Slot deleted successfully' });
  } catch (error) {
    console.error('Delete slot error:', error.message);
    res.status(500).json({ message: 'Server error deleting slot' });
  }
};

module.exports = { createSlot, getMySlots, getSlotsBySenior, updateSlot, deleteSlot };
