const asyncHandler = require('express-async-handler');
const Auction = require('../models/auctionModel');
const User = require('../models/userModel');
const { ok } = require('../utils/response');

exports.getAuctions = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const auctions = await Auction.find(filter).sort({ endTime: 1 });
  const data = await Promise.all(
    auctions.map(async (a) => {
      const obj = a.toObject();
      obj.id = obj._id;
      const seller = await User.findById(a.sellerId).select('-password');
      obj.seller = seller ? seller.toSafeJSON() : null;
      return obj;
    }),
  );
  ok(res, data);
});

exports.getAuction = asyncHandler(async (req, res) => {
  const auction = await Auction.findById(req.params.id);
  if (!auction) {
    res.status(404);
    throw new Error('Auction not found');
  }
  const obj = auction.toObject();
  obj.id = obj._id;
  const seller = await User.findById(auction.sellerId).select('-password');
  obj.seller = seller ? seller.toSafeJSON() : null;
  ok(res, obj);
});

exports.placeBid = asyncHandler(async (req, res) => {
  const auction = await Auction.findById(req.params.id);
  if (!auction) {
    res.status(404);
    throw new Error('Auction not found');
  }
  if (auction.status === 'ended') {
    res.status(400);
    throw new Error('Auction has ended');
  }
  const amount = Number(req.body.amount);
  if (amount <= auction.currentBid) {
    res.status(400);
    throw new Error('Bid must be higher than current bid');
  }
  auction.currentBid = amount;
  auction.biddersCount += 1;
  auction.bids.unshift({
    userId: req.user._id,
    userName: req.user.name,
    amount,
    createdAt: new Date(),
  });
  await auction.save();
  const obj = auction.toObject();
  obj.id = obj._id;
  ok(res, obj);
});
