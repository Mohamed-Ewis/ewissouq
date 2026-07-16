const mongoose = require('mongoose');
const slugify = require('slugify');

const branchSchema = new mongoose.Schema(
  {
    name: String,
    city: String,
    area: String,
    address: String,
    phone: String,
    lat: Number,
    lng: Number,
  },
  { _id: true },
);

const businessSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    nameKey: { type: String, default: '' },
    description: { type: String, default: '' },
    descriptionKey: { type: String, default: '' },
    logo: { type: String, default: '' },
    cover: { type: String, default: '' },
    businessType: { type: String, enum: ['retail', 'wholesale', 'service'], default: 'retail' },
    tier: { type: String, enum: ['basic', 'verified', 'premium'], default: 'basic' },
    ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    verified: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    location: {
      country: { type: String, default: 'ae' },
      city: { type: String, default: '' },
      area: { type: String, default: '' },
    },
    phone: String,
    website: String,
    email: String,
    workingHours: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '21:00' },
      days: { type: String, default: 'daily' },
    },
    branches: [branchSchema],
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

businessSchema.pre('save', function ensureSlug() {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

module.exports = mongoose.model('Business', businessSchema);
