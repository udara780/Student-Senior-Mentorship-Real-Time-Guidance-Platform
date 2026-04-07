const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
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
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', chatSchema);
