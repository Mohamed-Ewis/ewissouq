const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const locationSchema = new mongoose.Schema(
  {
    country: { type: String, default: 'ae' },
    city: { type: String, default: '' },
    area: { type: String, default: '' },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    avatar: { type: String, default: '' },
    cover: { type: String, default: '' },
    bio: { type: String, default: '' },
    accountType: { type: String, enum: ['individual', 'business'], default: 'individual' },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', default: null },
    verified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    location: { type: locationSchema, default: () => ({}) },
    likedProductIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    savedProductIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    followingUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followingBusinessIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Business' }],
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = function matchPassword(entered) {
  return bcrypt.compare(entered, this.password);
};

userSchema.methods.toSafeJSON = function toSafeJSON() {
  const obj = this.toObject({ virtuals: true });
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
