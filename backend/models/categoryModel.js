const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    nameKey: { type: String, default: '' },
    slug: { type: String, lowercase: true, trim: true },
    icon: { type: String, default: 'bi bi-grid' },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    legacyId: { type: Number, default: null },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

categorySchema.pre('save', function ensureSlug() {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

module.exports = mongoose.model('Category', categorySchema);
