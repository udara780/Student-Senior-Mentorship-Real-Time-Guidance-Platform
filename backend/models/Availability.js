const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema(
  {
    senior: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: [true, 'Date is required'],
    },
    startTime: {
      type: String, // Format: HH:MM (24hr)
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String, // Format: HH:MM (24hr)
      required: [true, 'End time is required'],
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    note: {
      type: String,
      default: '',
      maxlength: 200,
    },
    assignedStudentId: {
      type: String,
      required: [true, 'Student IT number is required'],
      trim: true,
    },
    meetingLink: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Availability', availabilitySchema);

