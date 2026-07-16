const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Business = require('../models/businessModel');
const Product = require('../models/productModel');
const { ok } = require('../utils/response');

async function attachSeller(product, reqUser) {
  const obj = product.toObject ? product.toObject() : { ...product };
  obj.id = obj._id;
  const seller = await User.findById(obj.sellerId).select('-password');
  if (seller) {
    obj.seller = seller.toSafeJSON();
    if (seller.businessId) {
      const biz = await Business.findById(seller.businessId);
      if (biz) {
        obj.seller.isBusiness = true;
        obj.seller.businessSlug = biz.slug;
        obj.seller.businessTier = biz.tier;
        obj.seller.nameKey = biz.nameKey || biz.name;
        obj.business = {
          id: biz._id,
          slug: biz.slug,
          nameKey: biz.nameKey || biz.name,
          logo: biz.logo,
          tier: biz.tier,
        };
      }
    }
  }
  if (reqUser) {
    obj.isLiked = (reqUser.likedProductIds || []).some((id) => String(id) === String(obj._id));
    obj.isSaved = (reqUser.savedProductIds || []).some((id) => String(id) === String(obj._id));
  }
  return obj;
}

exports.enrichProduct = attachSeller;

exports.getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 12;
  const filter = { status: req.query.status || 'active' };
  if (req.query.condition) filter.condition = req.query.condition;
  if (req.query.q) filter.title = { $regex: req.query.q, $options: 'i' };
  if (req.query.sellerId) filter.sellerId = req.query.sellerId;

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  const data = await Promise.all(products.map((p) => attachSeller(p, req.user)));
  ok(res, data, { page, pageSize, total, hasMore: page * pageSize < total });
});

exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  product.views += 1;
  await product.save();
  ok(res, await attachSeller(product, req.user));
});

exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({
    ...req.body,
    sellerId: req.user._id,
    sellerType: req.user.accountType === 'business' ? 'business' : 'individual',
    businessId: req.user.businessId || null,
    images: req.body.images?.length ? req.body.images : ['https://picsum.photos/seed/new/800/600'],
  });
  ok(res, await attachSeller(product, req.user), null, 201);
});

exports.likeProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const user = await User.findById(req.user._id);
  const idx = user.likedProductIds.findIndex((id) => String(id) === String(product._id));
  let liked;
  if (idx === -1) {
    user.likedProductIds.push(product._id);
    product.likes += 1;
    liked = true;
  } else {
    user.likedProductIds.splice(idx, 1);
    product.likes = Math.max(0, product.likes - 1);
    liked = false;
  }
  await user.save();
  await product.save();
  ok(res, { liked, likes: product.likes });
});

exports.saveProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const user = await User.findById(req.user._id);
  const idx = user.savedProductIds.findIndex((id) => String(id) === String(product._id));
  let saved;
  if (idx === -1) {
    user.savedProductIds.push(product._id);
    saved = true;
  } else {
    user.savedProductIds.splice(idx, 1);
    saved = false;
  }
  await user.save();
  ok(res, { saved });
});

exports.getSaved = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const products = await Product.find({ _id: { $in: user.savedProductIds } });
  const data = await Promise.all(products.map((p) => attachSeller(p, req.user)));
  ok(res, data);
});

exports.getTrending = asyncHandler(async (req, res) => {
  const products = await Product.find({ status: 'active' }).sort({ likes: -1 }).limit(8);
  ok(res, await Promise.all(products.map((p) => attachSeller(p, req.user))));
});

exports.getRecommended = asyncHandler(async (req, res) => {
  const products = await Product.find({ status: 'active' }).sort({ createdAt: -1 }).limit(8);
  ok(res, await Promise.all(products.map((p) => attachSeller(p, req.user))));
});

exports.getMostViewed = asyncHandler(async (req, res) => {
  const products = await Product.find({ status: 'active' }).sort({ views: -1 }).limit(8);
  ok(res, await Promise.all(products.map((p) => attachSeller(p, req.user))));
});
