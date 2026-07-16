const express = require('express');
const auctionController = require('../controllers/auctionController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', optionalAuth, auctionController.getAuctions);
router.get('/:id', optionalAuth, auctionController.getAuction);
router.post('/:id/bid', protect, auctionController.placeBid);
module.exports = router;
