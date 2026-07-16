const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Business = require('../models/businessModel');
const { ok } = require('../utils/response');
const { enrichProduct } = require('./productController');

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').limit(50);
  ok(res, users.map((u) => u.toSafeJSON()));
});

exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  const data = user.toSafeJSON();
  if (user.businessId) {
    const biz = await Business.findById(user.businessId);
    if (biz) {
      data.business = {
        id: biz._id,
        slug: biz.slug,
        nameKey: biz.nameKey || biz.name,
        logo: biz.logo,
        tier: biz.tier,
      };
    }
  }
  const products = await Product.find({ sellerId: user._id, status: 'active' });
  data.products = await Promise.all(products.map((p) => enrichProduct(p, req.user)));
  data.soldProducts = await Product.find({ sellerId: user._id, status: 'sold' });
  if (req.user) {
    data.isFollowing = (req.user.followingUserIds || []).some((id) => String(id) === String(user._id));
  }
  ok(res, data);
});

exports.followUser = asyncHandler(async (req, res) => {
  const target = await User.findById(req.params.id);
  if (!target) {
    res.status(404);
    throw new Error('User not found');
  }
  const me = await User.findById(req.user._id);
  const idx = me.followingUserIds.findIndex((id) => String(id) === String(target._id));
  let following;
  if (idx === -1) {
    me.followingUserIds.push(target._id);
    me.following += 1;
    target.followers += 1;
    following = true;
  } else {
    me.followingUserIds.splice(idx, 1);
    me.following = Math.max(0, me.following - 1);
    target.followers = Math.max(0, target.followers - 1);
    following = false;
  }
  await me.save();
  await target.save();
  ok(res, { following });
});
