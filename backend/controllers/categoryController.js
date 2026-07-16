const asyncHandler = require('express-async-handler');
const Category = require('../models/categoryModel');
const Story = require('../models/storyModel');
const User = require('../models/userModel');
const { ok } = require('../utils/response');

function buildTree(categories) {
  const map = {};
  categories.forEach((c) => {
    const obj = c.toObject();
    obj.id = obj.legacyId || obj._id;
    obj._mongoId = String(obj._id);
    obj.children = [];
    map[obj._mongoId] = obj;
  });
  const roots = [];
  categories.forEach((c) => {
    const node = map[String(c._id)];
    if (c.parentId && map[String(c.parentId)]) {
      map[String(c.parentId)].children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });
  ok(res, buildTree(categories));
});

exports.getStories = asyncHandler(async (req, res) => {
  const now = new Date();
  const stories = await Story.find({ expiresAt: { $gt: now } }).sort({ createdAt: -1 }).limit(20);
  const data = await Promise.all(
    stories.map(async (s) => {
      const user = await User.findById(s.userId).select('-password');
      return {
        id: s._id,
        mediaUrl: s.mediaUrl,
        mediaType: s.mediaType,
        user: user ? user.toSafeJSON() : null,
        createdAt: s.createdAt,
      };
    }),
  );
  ok(res, data);
});
