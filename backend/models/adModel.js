const mongoose = require('mongoose');

const adSchema = new mongoose.Schema(
  {
    titleKey: { type: String, default: '' },
    title: { type: String, default: '' },
    subtitleKey: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    image: { type: String, required: true },
    link: { type: String, default: '/stores' },
    ctaKey: { type: String, default: 'ads.shopNow' },
    placement: { type: String, enum: ['home', 'sidebar', 'banner'], default: 'home' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Ad', adSchema);
