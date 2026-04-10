const GroupRequest = require('../models/GroupRequest');
const Group = require('../models/group');
const User = require('../models/user');

// @route   POST /api/group-requests
// @desc    Student sends a join request to a group
// @access  Private (any authenticated user)
const sendGroupRequest = async (req, res) => {
  try {
    const { groupId } = req.body;

    if (!groupId) {
      return res.status(400).json({ message: 'Group ID is required' });
    }

    // Verify group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if group is full
    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({ message: 'This group is already full' });
    }

    // Check if student is already a member
    const studentId = req.user.studentId || req.user._id.toString();
    const alreadyMember = group.members.some(
      m => m.studentId === studentId || m.studentId === req.user._id.toString()
    );
    if (alreadyMember) {
      return res.status(400).json({ message: 'You are already a member of this group' });
    }

    // Check for existing pending request
    const existing = await GroupRequest.findOne({
      student: req.user._id,
      group: groupId,
      status: 'pending',
    });
    if (existing) {
      return res.status(400).json({ message: 'You already have a pending request for this group' });
    }

    // Find the leader — leaderId may be a human-readable studentId OR a MongoDB _id
    let leader = await User.findOne({ studentId: group.leaderId });
    if (!leader) {
      // Only try _id lookup if it looks like a valid ObjectId (24 hex chars)
      const isObjectId = /^[a-f\d]{24}$/i.test(group.leaderId);
      if (isObjectId) {
        leader = await User.findById(group.leaderId);
      }
    }
    if (!leader) {
      return res.status(404).json({ message: 'Group leader not found' });
    }

    const groupRequest = await GroupRequest.create({
      student: req.user._id,
      group: groupId,
      leader: leader._id,
    });

    res.status(201).json({ message: 'Join request sent successfully', groupRequest });
  } catch (error) {
    console.error('Send group request error:', error.message);
    res.status(500).json({ message: 'Server error sending group join request' });
  }
};

// @route   GET /api/group-requests/incoming
// @desc    Leader fetches pending join requests for their groups
// @access  Private
const getIncomingGroupRequests = async (req, res) => {
  try {
    const requests = await GroupRequest.find({
      leader: req.user._id,
      status: 'pending',
    })
      .populate('student', 'name email profilePhoto studentId')
      .populate('group', 'moduleName moduleCode')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Get incoming group requests error:', error.message);
    res.status(500).json({ message: 'Server error fetching group requests' });
  }
};

// @route   GET /api/group-requests/responses
// @desc    Student fetches resolved (approved/rejected) requests for themselves
// @access  Private
const getMyGroupRequestResponses = async (req, res) => {
  try {
    const requests = await GroupRequest.find({
      student: req.user._id,
      status: { $in: ['approved', 'rejected'] },
    })
      .populate('group', 'moduleName moduleCode')
      .sort({ updatedAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Get group request responses error:', error.message);
    res.status(500).json({ message: 'Server error fetching group request responses' });
  }
};

// @route   PUT /api/group-requests/:id/approve
// @desc    Leader approves a join request
// @access  Private
const approveGroupRequest = async (req, res) => {
  try {
    const groupRequest = await GroupRequest.findById(req.params.id)
      .populate('student', 'name studentId _id')
      .populate('group');

    if (!groupRequest) {
      return res.status(404).json({ message: 'Group request not found' });
    }

    // Ensure only the leader of this request can approve
    if (groupRequest.leader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to approve this request' });
    }

    if (groupRequest.status !== 'pending') {
      return res.status(400).json({ message: `Request is already ${groupRequest.status}` });
    }

    const group = await Group.findById(groupRequest.group._id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check group is still not full
    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({ message: 'Group is now full, cannot approve' });
    }

    // Add student to group members
    const studentId = groupRequest.student.studentId || groupRequest.student._id.toString();
    group.members.push({
      studentId: studentId,
      name: groupRequest.student.name,
    });
    await group.save();

    // Update request status
    groupRequest.status = 'approved';
    await groupRequest.save();

    res.json({ message: 'Request approved, student added to group', groupRequest });
  } catch (error) {
    console.error('Approve group request error:', error.message);
    res.status(500).json({ message: 'Server error approving group request' });
  }
};

// @route   PUT /api/group-requests/:id/reject
// @desc    Leader rejects a join request
// @access  Private
const rejectGroupRequest = async (req, res) => {
  try {
    const groupRequest = await GroupRequest.findById(req.params.id);

    if (!groupRequest) {
      return res.status(404).json({ message: 'Group request not found' });
    }

    if (groupRequest.leader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to reject this request' });
    }

    if (groupRequest.status !== 'pending') {
      return res.status(400).json({ message: `Request is already ${groupRequest.status}` });
    }

    groupRequest.status = 'rejected';
    await groupRequest.save();

    res.json({ message: 'Request rejected', groupRequest });
  } catch (error) {
    console.error('Reject group request error:', error.message);
    res.status(500).json({ message: 'Server error rejecting group request' });
  }
};

module.exports = {
  sendGroupRequest,
  getIncomingGroupRequests,
  getMyGroupRequestResponses,
  approveGroupRequest,
  rejectGroupRequest,
};
