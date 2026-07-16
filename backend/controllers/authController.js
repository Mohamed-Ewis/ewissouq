const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Business = require('../models/businessModel');
const { ok } = require('../utils/response');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/tokens');

function authPayload(user) {
  return {
    user: user.toSafeJSON ? user.toSafeJSON() : user,
    accessToken: signAccessToken(user._id),
    refreshToken: signRefreshToken(user._id),
  };
}

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  ok(res, authPayload(user));
});

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, avatar, accountType, city } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('Email already registered');
  }

  let businessId = null;
  if (accountType === 'business') {
    const business = await Business.create({
      name,
      nameKey: name,
      description: name,
      logo: avatar || '',
      email,
      location: { country: 'ae', city: city || 'Dubai' },
      tier: 'basic',
      verified: true,
    });
    businessId = business._id;
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar: avatar || '',
    accountType: accountType === 'business' ? 'business' : 'individual',
    businessId,
    verified: accountType === 'business',
    location: { country: 'ae', city: city || 'Dubai', area: '' },
  });

  if (businessId) {
    await Business.findByIdAndUpdate(businessId, { ownerUserId: user._id });
    const business = await Business.findById(businessId);
    const safe = user.toSafeJSON();
    safe.business = {
      id: business._id,
      slug: business.slug,
      nameKey: business.nameKey || business.name,
      logo: business.logo,
      tier: business.tier,
    };
    return ok(res, {
      user: safe,
      accessToken: signAccessToken(user._id),
      refreshToken: signRefreshToken(user._id),
    }, null, 201);
  }

  ok(res, authPayload(user), null, 201);
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  ok(res, { message: 'If the email exists, a reset link was sent', email: req.body.email });
});

exports.getMe = asyncHandler(async (req, res) => {
  ok(res, req.user.toSafeJSON());
});

exports.refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(401);
    throw new Error('Refresh token required');
  }
  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.id);
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }
  ok(res, {
    accessToken: signAccessToken(user._id),
    refreshToken: signRefreshToken(user._id),
  });
});
