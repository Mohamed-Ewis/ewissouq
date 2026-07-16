const express = require('express');
const businessController = require('../controllers/businessController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', optionalAuth, businessController.getBusinesses);
router.get('/featured', optionalAuth, businessController.getFeatured);
router.get('/:slugOrId', optionalAuth, businessController.getBusiness);
router.post('/:id/follow', protect, businessController.followBusiness);
module.exports = router;
