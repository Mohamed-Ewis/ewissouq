const asyncHandler = require('express-async-handler');
const Ad = require('../models/adModel');
const { ok } = require('../utils/response');

exports.getHomeAds = asyncHandler(async (req, res) => {
  const ads = await Ad.find({ isActive: true, placement: { $in: ['home', 'sidebar'] } }).sort({ order: 1 });
  ok(res, ads.map((a) => ({ ...a.toObject(), id: a._id })));
});
