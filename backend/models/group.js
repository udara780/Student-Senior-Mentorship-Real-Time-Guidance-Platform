const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    moduleName: { type: String, required: true },
    moduleCode: { type: String, required: true },
    projectTitle: { type: String, default: null },
    maxMembers: { type: Number, required: true, default: 4 },
    leaderId: { type: String, required: true },
    leaderName: { type: String },
    members: [
      {
        studentId: { type: String, required: true },
        name: { type: String }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Group', groupSchema);
