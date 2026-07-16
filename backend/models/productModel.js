const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'AED' },
    condition: { type: String, enum: ['new', 'used', 'refurbished'], default: 'used' },
    images: [{ type: String }],
    video: { type: String, default: null },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    category: { type: String, default: '' },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sellerType: { type: String, enum: ['individual', 'business'], default: 'individual' },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', default: null },
    location: {
      country: { type: String, default: 'ae' },
      city: { type: String, default: '' },
      area: { type: String, default: '' },
    },
    status: { type: String, enum: ['active', 'sold', 'draft'], default: 'active' },
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Product', productSchema);
