const express = require('express');
const notificationController = require('../controllers/notificationController');
const { optionalAuth, protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', optionalAuth, notificationController.getNotifications);
router.post('/read-all', protect, notificationController.markAllRead);
router.post('/:id/read', protect, notificationController.markRead);
module.exports = router;
