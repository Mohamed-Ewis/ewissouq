const express = require('express');
const userController = require('../controllers/userController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', optionalAuth, userController.getUsers);
router.get('/:id', optionalAuth, userController.getUser);
router.post('/:id/follow', protect, userController.followUser);
module.exports = router;
