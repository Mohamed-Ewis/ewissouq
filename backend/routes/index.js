const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const feedRoutes = require('./feedRoutes');
const auctionRoutes = require('./auctionRoutes');
const businessRoutes = require('./businessRoutes');
const offerRoutes = require('./offerRoutes');
const categoryRoutes = require('./categoryRoutes');
const storyRoutes = require('./storyRoutes');
const userRoutes = require('./userRoutes');
const notificationRoutes = require('./notificationRoutes');
const adRoutes = require('./adRoutes');

module.exports = (app) => {
  const express = require('express');
  const router = express.Router();

  router.use('/auth', authRoutes);
  router.use('/products', productRoutes);
  router.use('/feed', feedRoutes);
  router.use('/auctions', auctionRoutes);
  router.use('/businesses', businessRoutes);
  router.use('/offers', offerRoutes);
  router.use('/categories', categoryRoutes);
  router.use('/stories', storyRoutes);
  router.use('/users', userRoutes);
  router.use('/notifications', notificationRoutes);
  router.use('/ads', adRoutes);

  // Same structure as learning project (/api/v1) + alias /api for frontend
  app.use('/api/v1', router);
  app.use('/api', router);
};
