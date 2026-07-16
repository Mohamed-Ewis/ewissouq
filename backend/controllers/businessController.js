const asyncHandler = require('express-async-handler');
const Business = require('../models/businessModel');
const Offer = require('../models/offerModel');
const User = require('../models/userModel');
const { ok } = require('../utils/response');

function mapBusiness(b, isFollowing = false) {
  const obj = b.toObject ? b.toObject() : { ...b };
  obj.id = obj._id;
  obj.branchesCount = (obj.branches || []).length;
  obj.isFollowing = isFollowing;
  return obj;
}

exports.getBusinesses = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 12;
  const filter = {};
  if (req.query.tier) filter.tier = req.query.tier;
  if (req.query.featured === 'true') filter.featured = true;
  if (req.query.q) {
    filter.$or = [
      { name: { $regex: req.query.q, $options: 'i' } },
      { nameKey: { $regex: req.query.q, $options: 'i' } },
    ];
  }

  const total = await Business.countDocuments(filter);
  const list = await Business.find(filter)
    .sort({ followers: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  const following = req.user?.followingBusinessIds || [];
  const data = list.map((b) =>
    mapBusiness(b, following.some((id) => String(id) === String(b._id))),
  );
  ok(res, data, { page, pageSize, total, hasMore: page * pageSize < total });
});

exports.getFeatured = asyncHandler(async (req, res) => {
  const list = await Business.find({ featured: true }).sort({ followers: -1 }).limit(8);
  ok(res, list.map((b) => mapBusiness(b)));
});

exports.getBusiness = asyncHandler(async (req, res) => {
  const key = req.params.slugOrId;
  const business = await Business.findOne(
    mongooseOr(key),
  );
  if (!business) {
    res.status(404);
    throw new Error('Store not found');
  }

  const offers = await Offer.find({ businessId: business._id, isActive: true }).sort({ featured: -1 });
  const featuredOffer = offers.find((o) => o.featured) || offers[0] || null;
  const owner = business.ownerUserId
    ? await User.findById(business.ownerUserId).select('-password')
    : null;
  const following = req.user?.followingBusinessIds || [];
  const data = {
    ...mapBusiness(business, following.some((id) => String(id) === String(business._id))),
    offers,
    offersCount: offers.length,
    featuredOffer,
    owner: owner ? owner.toSafeJSON() : null,
  };
  ok(res, data);
});

function mongooseOr(key) {
  const mongoose = require('mongoose');
  if (mongoose.Types.ObjectId.isValid(key)) {
    return { $or: [{ slug: key }, { _id: key }] };
  }
  return { slug: key };
}

exports.followBusiness = asyncHandler(async (req, res) => {
  const business = await Business.findById(req.params.id);
  if (!business) {
    res.status(404);
    throw new Error('Store not found');
  }
  const user = await User.findById(req.user._id);
  const idx = user.followingBusinessIds.findIndex((id) => String(id) === String(business._id));
  let following;
  if (idx === -1) {
    user.followingBusinessIds.push(business._id);
    business.followers += 1;
    following = true;
  } else {
    user.followingBusinessIds.splice(idx, 1);
    business.followers = Math.max(0, business.followers - 1);
    following = false;
  }
  await user.save();
  await business.save();
  ok(res, { following });
});
