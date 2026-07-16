const express = require('express');
const offerController = require('../controllers/offerController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', optionalAuth, offerController.getOffers);
router.post('/', protect, offerController.createOffer);
router.get('/:id', optionalAuth, offerController.getOffer);
module.exports = router;
