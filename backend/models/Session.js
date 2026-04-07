const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senior: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    availability: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Availability',
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    meetingLink: {
      type: String, // Optional, if they want to use Google Meet/Zoom instead of in-app chat
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Session', sessionSchema);
