const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    title: { type: String, required: true },
    titleKey: { type: String, default: '' },
    description: { type: String, default: '' },
    descKey: { type: String, default: '' },
    image: { type: String, default: '' },
    discountPercent: { type: Number, default: 0 },
    originalPrice: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    currency: { type: String, default: 'AED' },
    badge: {
      type: String,
      enum: ['flash', 'weekly', 'exclusive', 'bundle', 'clearance'],
      default: 'weekly',
    },
    validUntil: { type: Date, required: true },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Offer', offerSchema);
