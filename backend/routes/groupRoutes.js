const express = require('express');
const router = express.Router();
const { createGroup, getGroups } = require('../controllers/groupController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createGroup);
router.get('/', protect, getGroups);

module.exports = router;
