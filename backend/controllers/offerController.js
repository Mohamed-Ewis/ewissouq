const asyncHandler = require('express-async-handler');
const Offer = require('../models/offerModel');
const Business = require('../models/businessModel');
const { ok } = require('../utils/response');

async function enrichOffer(offer) {
  const obj = offer.toObject ? offer.toObject() : { ...offer };
  obj.id = obj._id;
  const business = await Business.findById(obj.businessId);
  obj.business = business
    ? {
        id: business._id,
        slug: business.slug,
        nameKey: business.nameKey || business.name,
        logo: business.logo,
        cover: business.cover,
        tier: business.tier,
        verified: business.verified,
        rating: business.rating,
        followers: business.followers,
      }
    : null;
  return obj;
}

exports.getOffers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 12;
  const filter = { isActive: true };
  if (req.query.badge) filter.badge = req.query.badge;
  if (req.query.businessId) filter.businessId = req.query.businessId;
  if (req.query.featured === 'true') filter.featured = true;
  if (req.query.q) {
    filter.$or = [
      { title: { $regex: req.query.q, $options: 'i' } },
      { titleKey: { $regex: req.query.q, $options: 'i' } },
    ];
  }

  let sort = { validUntil: 1 };
  if (req.query.sort === 'discount') sort = { discountPercent: -1 };
  if (req.query.sort === 'price_asc') sort = { salePrice: 1 };

  const total = await Offer.countDocuments(filter);
  const offers = await Offer.find(filter)
    .sort(sort)
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  const data = await Promise.all(offers.map(enrichOffer));
  ok(res, data, { page, pageSize, total, hasMore: page * pageSize < total });
});

exports.getOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) {
    res.status(404);
    throw new Error('Offer not found');
  }
  const enriched = await enrichOffer(offer);
  const related = await Offer.find({
    businessId: offer.businessId,
    _id: { $ne: offer._id },
    isActive: true,
  }).limit(6);
  enriched.relatedOffers = await Promise.all(related.map(enrichOffer));
  ok(res, enriched);
});

exports.createOffer = asyncHandler(async (req, res) => {
  if (!req.user.businessId) {
    res.status(403);
    throw new Error('Only store accounts can create offers');
  }
  const offer = await Offer.create({
    ...req.body,
    businessId: req.user.businessId,
  });
  ok(res, await enrichOffer(offer), null, 201);
});
