const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    amount: Number,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const auctionSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    images: [{ type: String }],
    startingBid: { type: Number, required: true },
    currentBid: { type: Number, required: true },
    bidIncrement: { type: Number, default: 50 },
    currency: { type: String, default: 'AED' },
    biddersCount: { type: Number, default: 0 },
    endTime: { type: Date, required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['active', 'ended'], default: 'active' },
    bids: [bidSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Auction', auctionSchema);
