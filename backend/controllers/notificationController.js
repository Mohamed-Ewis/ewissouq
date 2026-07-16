const asyncHandler = require('express-async-handler');
const Notification = require('../models/notificationModel');
const { ok } = require('../utils/response');

exports.getNotifications = asyncHandler(async (req, res) => {
  const filter = req.user
    ? { $or: [{ userId: req.user._id }, { userId: null }] }
    : { userId: null };
  const list = await Notification.find(filter).sort({ createdAt: -1 }).limit(50);
  ok(res, list.map((n) => ({ ...n.toObject(), id: n._id })));
});

exports.markRead = asyncHandler(async (req, res) => {
  const n = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  ok(res, n);
});

exports.markAllRead = asyncHandler(async (req, res) => {
  const filter = req.user ? { userId: req.user._id } : {};
  await Notification.updateMany(filter, { read: true });
  ok(res, { success: true });
});
