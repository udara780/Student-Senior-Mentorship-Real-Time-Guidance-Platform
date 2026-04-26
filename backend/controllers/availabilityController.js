const Availability = require('../models/Availability');
const Session = require('../models/Session');
const Notification = require('../models/Notification');
const User = require('../models/user');
const { sendMeetingLinkEmail } = require('../utils/emailService');
const { v4: uuidv4 } = require('uuid');

// @route   POST /api/availability
// @desc    Mentor creates a new time slot with auto-generated meeting link
// @access  Private
const createSlot = async (req, res) => {
  try {
    const { date, startTime, endTime, note, assignedStudentId, isBooked } = req.body;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({ message: 'Date, start time, and end time are required' });
    }

    if (!assignedStudentId || !assignedStudentId.trim()) {
      return res.status(400).json({ message: 'Student IT number is required' });
    }

    // Prevent duplicate slots for same mentor at same time
    const existing = await Availability.findOne({
      senior: req.user._id,
      date,
      startTime,
    });
    if (existing) {
      return res.status(400).json({ message: 'You already have a slot at this date and time' });
    }

    // Auto-generate a unique Microsoft Teams link (placeholder format)
    const meetingLink = `https://teams.microsoft.com/l/meetup-join/mentorship-${uuidv4()}`;

    const slot = await Availability.create({
      senior: req.user._id,
      date,
      startTime,
      endTime,
      isBooked: false,
      note: note || '',
      assignedStudentId: assignedStudentId.trim(),
      meetingLink,
    });

    // Auto-create a Session for the assigned student if they exist in the system
    let autoSession = null;
    const assignedStudent = await User.findOne({ studentId: new RegExp(`^${assignedStudentId.trim()}$`, 'i') });
    if (assignedStudent) {
      autoSession = await Session.create({
        student: assignedStudent._id,
        senior: req.user._id,
        availability: slot._id,
        status: 'scheduled',
      });
      // Mark slot as booked since it's now assigned
      slot.isBooked = true;
      await slot.save();
    }

    res.status(201).json({ message: 'Time slot created', slot, session: autoSession });
  } catch (error) {
    console.error('Create slot error:', error.message);
    res.status(500).json({ message: 'Server error creating slot' });
  }
};

// @route   GET /api/availability/my
// @desc    Mentor views their own slots
// @access  Private
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
// @desc    Student views available (not booked) slots for a specific mentor
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
// @desc    Mentor updates one of their slots
// @access  Private
const updateSlot = async (req, res) => {
  try {
    const slot = await Availability.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    if (slot.senior.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this slot' });
    }

    const { date, startTime, endTime, isBooked, assignedStudentId } = req.body;

    if (date) slot.date = date;
    if (startTime) slot.startTime = startTime;
    if (endTime) slot.endTime = endTime;
    if (isBooked !== undefined) slot.isBooked = isBooked;
    if (assignedStudentId !== undefined) slot.assignedStudentId = assignedStudentId.trim();

    await slot.save();
    res.json({ message: 'Slot updated successfully', slot });
  } catch (error) {
    console.error('Update slot error:', error.message);
    res.status(500).json({ message: 'Server error updating slot' });
  }
};

// @route   DELETE /api/availability/:id
// @desc    Mentor deletes one of their slots
// @access  Private
const deleteSlot = async (req, res) => {
  try {
    const slot = await Availability.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

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

// @route   POST /api/availability/:id/send-link
// @desc    Mentor sends the auto-generated meeting link to the assigned student
//          via in-app notification AND email
// @access  Private
const sendMeetingLinkToStudent = async (req, res) => {
  try {
    const slot = await Availability.findById(req.params.id).populate('senior', 'name email');

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    if (slot.senior._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!slot.meetingLink) {
      return res.status(400).json({ message: 'No meeting link found on this slot' });
    }

    // Find the student by their IT number (case-insensitive)
    const student = await User.findOne({ studentId: new RegExp(`^${slot.assignedStudentId.trim()}$`, 'i') });
    if (!student) {
      return res.status(404).json({ message: `No user found with IT number: ${slot.assignedStudentId}` });
    }

    const sessionTime = `${slot.date} · ${slot.startTime} – ${slot.endTime}`;
    const message = `Your session on ${slot.date} (${slot.startTime}–${slot.endTime}) is ready. Join here: ${slot.meetingLink}`;

    // 1. Create in-app notification
    await Notification.create({
      recipient: student._id,
      type: 'meeting_link',
      message,
      link: slot.meetingLink,
    });

    // 2. Send email (non-blocking — don't fail if email fails)
    try {
      await sendMeetingLinkEmail({
        studentEmail: student.email,
        studentName: student.name,
        meetingLink: slot.meetingLink,
        sessionTime,
        mentorName: slot.senior?.name || 'Your Mentor',
      });
    } catch (emailErr) {
      console.error('Email send failed (non-fatal):', emailErr.message);
    }

    res.json({ message: 'Meeting link sent via notification and email' });
  } catch (error) {
    console.error('Send meeting link error:', error.message);
    res.status(500).json({ message: 'Server error sending meeting link' });
  }
};

module.exports = {
  createSlot,
  getMySlots,
  getSlotsBySenior,
  updateSlot,
  deleteSlot,
  sendMeetingLinkToStudent,
};
