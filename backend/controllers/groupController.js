const Group = require('../models/group');

// @route   POST /api/groups
// @desc    Create a new project group
// @access  Private
const createGroup = async (req, res) => {
  try {
    const { moduleName, moduleCode, projectTitle, maxMembers, members, leaderId, leaderName } = req.body;

    if (!moduleName || !moduleCode || !maxMembers || !leaderId) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newGroup = await Group.create({
      moduleName,
      moduleCode,
      projectTitle,
      maxMembers,
      leaderId,
      leaderName,
      members: Array.isArray(members) ? members : []
    });

    res.status(201).json({
      ...newGroup._doc,
      id: newGroup._id // Compatibility map for frontend
    });
  } catch (error) {
    console.error('Create group error:', error.message);
    res.status(500).json({ message: error.message || 'Server error creating group' });
  }
};

// @route   GET /api/groups
// @desc    Get all project groups
// @access  Private (though easily could be public for viewing)
const getGroups = async (req, res) => {
  try {
    const groups = await Group.find().sort({ createdAt: -1 });
    const formattedGroups = groups.map(g => ({
      ...g._doc,
      id: g._id // Map to what frontend expects for `key={group.id}`
    }));
    res.json(formattedGroups);
  } catch (error) {
    console.error('Get groups error:', error.message);
    res.status(500).json({ message: 'Server error fetching groups' });
  }
};

module.exports = { createGroup, getGroups };
