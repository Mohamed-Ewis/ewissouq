const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const Auction = require('../models/auctionModel');
const Offer = require('../models/offerModel');
const Business = require('../models/businessModel');
const { ok, paginate } = require('../utils/response');
const { enrichProduct } = require('./productController');

exports.getFeed = asyncHandler(async (req, res) => {
  const typeFilter = req.query.type || 'all';
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const items = [];

  if (typeFilter === 'all' || typeFilter === 'classified') {
    const products = await Product.find({ status: 'active' }).sort({ createdAt: -1 }).limit(40);
    for (const p of products) {
      const enriched = await enrichProduct(p, req.user);
      items.push({
        ...enriched,
        feedId: `classified-${p._id}`,
        listingType: 'classified',
        href: `/marketplace/${p._id}`,
        sortAt: p.createdAt,
      });
    }
  }

  if (typeFilter === 'all' || typeFilter === 'auction') {
    const auctions = await Auction.find({ status: 'active' }).sort({ endTime: 1 }).limit(20);
    for (const a of auctions) {
      items.push({
        id: a._id,
        _id: a._id,
        feedId: `auction-${a._id}`,
        listingType: 'auction',
        title: a.title,
        images: a.images,
        price: a.currentBid,
        currentBid: a.currentBid,
        endTime: a.endTime,
        sellerId: a.sellerId,
        status: a.status,
        href: `/auctions/${a._id}`,
        sortAt: a.endTime,
        likes: a.biddersCount || 0,
      });
    }
  }

  if (typeFilter === 'all' || typeFilter === 'offer') {
    const offers = await Offer.find({ isActive: true }).sort({ validUntil: 1 }).limit(20);
    for (const o of offers) {
      const business = await Business.findById(o.businessId);
      items.push({
        id: o._id,
        _id: o._id,
        feedId: `offer-${o._id}`,
        listingType: 'offer',
        titleKey: o.titleKey,
        title: o.title,
        images: [o.image],
        image: o.image,
        price: o.salePrice,
        salePrice: o.salePrice,
        originalPrice: o.originalPrice,
        discountPercent: o.discountPercent,
        currency: o.currency,
        badge: o.badge,
        validUntil: o.validUntil,
        business: business
          ? {
              id: business._id,
              slug: business.slug,
              nameKey: business.nameKey || business.name,
              logo: business.logo,
              tier: business.tier,
              verified: business.verified,
            }
          : null,
        sellerType: 'business',
        seller: business
          ? {
              name: business.name,
              nameKey: business.nameKey || business.name,
              avatar: business.logo,
              verified: business.verified,
              isBusiness: true,
              businessSlug: business.slug,
              businessTier: business.tier,
            }
          : null,
        href: `/offers/${o._id}`,
        sortAt: o.validUntil,
        likes: 0,
      });
    }
  }

  items.sort((a, b) => new Date(b.sortAt || 0) - new Date(a.sortAt || 0));
  const result = paginate(items, page, pageSize);
  ok(res, result.data, result.meta);
});
