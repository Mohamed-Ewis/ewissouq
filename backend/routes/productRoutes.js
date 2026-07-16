const express = require('express');
const productController = require('../controllers/productController');
const commentController = require('../controllers/commentController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/trending', optionalAuth, productController.getTrending);
router.get('/recommended', optionalAuth, productController.getRecommended);
router.get('/most-viewed', optionalAuth, productController.getMostViewed);
router.get('/saved', protect, productController.getSaved);
router.get('/', optionalAuth, productController.getProducts);
router.post('/', protect, productController.createProduct);
router.get('/:id', optionalAuth, productController.getProduct);
router.post('/:id/like', protect, productController.likeProduct);
router.post('/:id/save', protect, productController.saveProduct);
router.get('/:id/comments', commentController.getComments);
router.post('/:id/comments', protect, commentController.addComment);

module.exports = router;
