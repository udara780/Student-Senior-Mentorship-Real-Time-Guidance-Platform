const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    studentId: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['student', 'senior', 'admin'],
      default: 'student',
    },
    academicYear: {
      type: String,
      enum: ['Year 1', 'Year 2', 'Year 3', 'Year 4'],
    },
    semester: {
      type: String,
      enum: ['Semester 1', 'Semester 2'],
    },
    gpa: {
      type: Number,
      min: 0,
      max: 4.0,
    },
    interestedInMentorship: {
      type: Boolean,
      default: false,
    },
    skills: {
      type: [String],
      default: [],
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // Tracks a user's mentor application lifecycle
    // none     → regular student, never applied
    // pending  → applied to be a mentor, awaiting admin review
    // approved → admin approved; role has been flipped to 'senior'
    // rejected → admin rejected the application
    mentorStatus: {
      type: String,
      enum: ['none', 'pending', 'approved', 'rejected'],
      default: 'none',
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
