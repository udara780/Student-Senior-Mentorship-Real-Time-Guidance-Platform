const Request = require('../models/Request');
const Chat = require('../models/Chat');
const User = require('../models/user');

// @route   POST /api/requests
// @desc    Student sends a mentorship request to a senior
// @access  Private (student only)
const sendRequest = async (req, res) => {
  try {
    const { seniorId, message } = req.body;

    if (!seniorId) {
      return res.status(400).json({ message: 'Senior ID is required' });
    }

    // Verify senior exists
    const senior = await User.findOne({ _id: seniorId, role: 'senior' });
    if (!senior) {
      return res.status(404).json({ message: 'Verified senior not found' });
    }

    // Check if a pending or accepted request already exists
    const existingRequest = await Request.findOne({
      student: req.user._id,
      senior: seniorId,
      status: { $in: ['pending', 'accepted'] },
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have an active request with this senior' });
    }

    const request = await Request.create({
      student: req.user._id,
      senior: seniorId,
      message: message || '',
    });

    res.status(201).json({ message: 'Mentorship request sent successfully', request });
  } catch (error) {
    console.error('Send request error:', error.message);
    res.status(500).json({ message: 'Server error sending request' });
  }
};

// @route   GET /api/requests/my
// @desc    Student views their sent requests
// @access  Private (student only)
const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ student: req.user._id })
      .populate('senior', 'name email profilePhoto bio skills')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Get my requests error:', error.message);
    res.status(500).json({ message: 'Server error fetching requests' });
  }
};

// @route   GET /api/requests/incoming
// @desc    Senior views incoming requests
// @access  Private (senior only)
const getIncomingRequests = async (req, res) => {
  try {
    const requests = await Request.find({ senior: req.user._id })
      .populate('student', 'name email profilePhoto')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Get incoming requests error:', error.message);
    res.status(500).json({ message: 'Server error fetching requests' });
  }
};

// @route   PUT /api/requests/:id
// @desc    Senior accepts or rejects a request
// @access  Private (senior only)
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or rejected' });
    }

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Ensure only the requested senior can update it
    if (request.senior.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: `Request is already ${request.status}` });
    }

    request.status = status;
    await request.save();

    // If accepted, auto-create a Chat document for real-time messaging
    let chat = null;
    if (status === 'accepted') {
      chat = await Chat.create({
        student: request.student,
        senior: request.senior,
        request: request._id,
      });
    }

    res.json({
      message: `Request ${status} successfully`,
      request,
      chatCreated: !!chat,
    });
  } catch (error) {
    console.error('Update request status error:', error.message);
    res.status(500).json({ message: 'Server error updating request' });
  }
};

module.exports = {
  sendRequest,
  getMyRequests,
  getIncomingRequests,
  updateRequestStatus,
};
