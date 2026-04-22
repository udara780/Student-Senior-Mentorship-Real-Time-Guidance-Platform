const Session = require('../models/Session');
const Availability = require('../models/Availability');

// @route   POST /api/sessions
// @desc    Student books an available session slot
// @access  Private (student only)
const bookSession = async (req, res) => {
  try {
    const { availabilityId } = req.body;

    if (!availabilityId) {
      return res.status(400).json({ message: 'Availability ID is required' });
    }

    // Check if slot exists and is not booked
    const slot = await Availability.findById(availabilityId);
    if (!slot) {
      return res.status(404).json({ message: 'Time slot not found' });
    }

    if (slot.isBooked) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Create session
    const session = await Session.create({
      student: req.user._id,
      senior: slot.senior,
      availability: slot._id,
    });

    // Mark availability slot as booked
    slot.isBooked = true;
    await slot.save();

    res.status(201).json({ message: 'Session booked successfully', session });
  } catch (error) {
    console.error('Book session error:', error.message);
    res.status(500).json({ message: 'Server error booking session' });
  }
};

// @route   GET /api/sessions
// @desc    Get user's sessions (student or senior)
// @access  Private
const getMySessions = async (req, res) => {
  try {
    // Find sessions where user is either the student or the senior
    const sessions = await Session.find({
      $or: [{ student: req.user._id }, { senior: req.user._id }]
    })
      .populate('student', 'name email profilePhoto studentId')
      .populate('senior', 'name email profilePhoto studentId')
      .populate('availability', 'date startTime endTime note assignedStudentId meetingLink')
      .sort({ createdAt: -1 });

    res.json(sessions);
  } catch (error) {
    console.error('Get sessions error:', error.message);
    res.status(500).json({ message: 'Server error fetching sessions' });
  }
};

// @route   PUT /api/sessions/:id
// @desc    Update session status (completed/cancelled)
// @access  Private
const updateSessionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Status must be completed or cancelled' });
    }

    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Verify user is part of the session
    if (
      session.student.toString() !== req.user._id.toString() &&
      session.senior.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to update this session' });
    }

    if (status === 'completed') {
      if (!session.joinedBy.includes(req.user._id)) {
        session.joinedBy.push(req.user._id);
      }
      // If both users have joined, mark global status as completed
      if (session.joinedBy.length >= 2) {
        session.status = 'completed';
      }
    } else {
      session.status = status;
    }
    
    await session.save();

    // If cancelled, free up the availability slot
    if (status === 'cancelled') {
      const slot = await Availability.findById(session.availability);
      if (slot) {
        slot.isBooked = false;
        await slot.save();
      }
    }

    res.json({ message: `Session ${status}`, session });
  } catch (error) {
    console.error('Update session error:', error.message);
    res.status(500).json({ message: 'Server error updating session' });
  }
};

module.exports = {
  bookSession,
  getMySessions,
  updateSessionStatus,
};
