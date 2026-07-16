const express = require('express');
const feedController = require('../controllers/feedController');
const { optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', optionalAuth, feedController.getFeed);
module.exports = router;
