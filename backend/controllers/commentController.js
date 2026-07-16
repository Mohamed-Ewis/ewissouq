const asyncHandler = require('express-async-handler');
const Comment = require('../models/commentModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const { ok } = require('../utils/response');

exports.getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ productId: req.params.id }).sort({ createdAt: -1 });
  const data = await Promise.all(
    comments.map(async (c) => {
      const user = await User.findById(c.userId).select('-password');
      return {
        id: c._id,
        text: c.text,
        createdAt: c.createdAt,
        user: user ? user.toSafeJSON() : null,
      };
    }),
  );
  ok(res, data);
});

exports.addComment = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const comment = await Comment.create({
    productId: product._id,
    userId: req.user._id,
    text: req.body.text || req.body.content,
  });
  product.commentsCount += 1;
  await product.save();
  ok(res, {
    id: comment._id,
    text: comment.text,
    createdAt: comment.createdAt,
    user: req.user.toSafeJSON(),
  }, null, 201);
});
