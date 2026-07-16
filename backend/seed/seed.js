const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'config.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/userModel');
const Category = require('../models/categoryModel');
const Business = require('../models/businessModel');
const Product = require('../models/productModel');
const Auction = require('../models/auctionModel');
const Offer = require('../models/offerModel');
const Notification = require('../models/notificationModel');
const Story = require('../models/storyModel');
const Ad = require('../models/adModel');
const Comment = require('../models/commentModel');

const img = (seed) => `https://picsum.photos/seed/${seed}/800/600`;
const avatar = (seed) => `https://i.pravatar.cc/150?u=${seed}`;

async function seed() {
  await connectDB();
  console.log('Clearing collections...');
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Business.deleteMany({}),
    Product.deleteMany({}),
    Auction.deleteMany({}),
    Offer.deleteMany({}),
    Notification.deleteMany({}),
    Story.deleteMany({}),
    Ad.deleteMany({}),
    Comment.deleteMany({}),
  ]);

  const electronics = await Category.create({
    name: 'Electronics',
    nameKey: 'categories.electronics',
    slug: 'electronics',
    icon: 'bi bi-phone',
    legacyId: 1,
    order: 1,
  });
  const phones = await Category.create({
    name: 'Phones',
    nameKey: 'categories.phones',
    slug: 'phones',
    parentId: electronics._id,
    legacyId: 2,
    order: 1,
  });
  const fashion = await Category.create({
    name: 'Fashion',
    nameKey: 'categories.fashion',
    slug: 'fashion',
    icon: 'bi bi-bag',
    legacyId: 3,
    order: 2,
  });
  const vehicles = await Category.create({
    name: 'Vehicles',
    nameKey: 'categories.vehicles',
    slug: 'vehicles',
    icon: 'bi bi-car-front',
    legacyId: 4,
    order: 3,
  });

  const ahmed = await User.create({
    name: 'Ahmed Al-Rashid',
    email: 'ahmed@example.com',
    password: 'password123',
    avatar: avatar('ahmed'),
    cover: img('cover1'),
    bio: 'Premium electronics seller.',
    accountType: 'individual',
    verified: true,
    rating: 4.9,
    followers: 2840,
    following: 156,
    location: { country: 'ae', city: 'Dubai', area: 'Marina' },
  });

  const sara = await User.create({
    name: 'Sara Hassan',
    email: 'sara@example.com',
    password: 'password123',
    avatar: avatar('sara'),
    verified: true,
    rating: 4.7,
    location: { country: 'ae', city: 'Dubai', area: 'Downtown' },
  });

  const storeOwner = await User.create({
    name: 'B.Tech Manager',
    email: 'store@btech.com',
    password: 'password123',
    avatar: avatar('btech'),
    accountType: 'business',
    verified: true,
  });

  const btech = await Business.create({
    slug: 'b-tech',
    name: 'B.Tech',
    nameKey: 'businesses.bTech.name',
    descriptionKey: 'businesses.bTech.description',
    description: 'Leading electronics retailer',
    logo: img('btech-logo'),
    cover: img('btech-cover'),
    tier: 'premium',
    ownerUserId: storeOwner._id,
    verified: true,
    featured: true,
    rating: 4.8,
    followers: 45200,
    location: { country: 'eg', city: 'Cairo', area: 'Nasr City' },
    phone: '+20 19999',
    website: 'https://btech.com',
    email: 'hello@btech.com',
    branches: [
      { name: 'Nasr City', city: 'Cairo', area: 'Nasr City', phone: '+20 19999' },
      { name: 'Maadi', city: 'Cairo', area: 'Maadi', phone: '+20 19999' },
    ],
  });

  const carrefour = await Business.create({
    slug: 'carrefour-egypt',
    name: 'Carrefour',
    nameKey: 'businesses.carrefour.name',
    descriptionKey: 'businesses.carrefour.description',
    logo: img('carrefour'),
    cover: img('carrefour-cover'),
    tier: 'premium',
    verified: true,
    featured: true,
    rating: 4.6,
    followers: 89100,
    location: { country: 'eg', city: 'Cairo', area: 'New Cairo' },
    branches: [{ name: 'City Stars', city: 'Cairo', area: 'Nasr City' }],
  });

  const ikea = await Business.create({
    slug: 'ikea-egypt',
    name: 'IKEA',
    nameKey: 'businesses.ikea.name',
    descriptionKey: 'businesses.ikea.description',
    logo: img('ikea'),
    cover: img('ikea-cover'),
    tier: 'verified',
    verified: true,
    featured: true,
    rating: 4.5,
    followers: 62000,
    location: { country: 'eg', city: 'Cairo', area: 'New Cairo' },
  });

  storeOwner.businessId = btech._id;
  await storeOwner.save();

  const products = await Product.insertMany([
    {
      title: 'iPhone 15 Pro Max 256GB',
      description: 'Brand new sealed iPhone 15 Pro Max.',
      price: 4800,
      condition: 'new',
      images: [img('iphone1'), img('iphone2')],
      categoryId: phones._id,
      category: 'phones',
      sellerId: ahmed._id,
      location: { country: 'ae', city: 'Dubai', area: 'Marina' },
      likes: 214,
      views: 1820,
      commentsCount: 2,
    },
    {
      title: 'Samsung 55" QLED Smart TV',
      description: 'Excellent condition smart TV.',
      price: 6300,
      condition: 'used',
      images: [img('tv1')],
      categoryId: electronics._id,
      category: 'electronics',
      sellerId: ahmed._id,
      sellerType: 'business',
      businessId: btech._id,
      location: { country: 'ae', city: 'Dubai', area: 'JBR' },
      likes: 98,
      views: 940,
    },
    {
      title: 'Vintage Leather Jacket',
      description: 'Authentic vintage piece.',
      price: 450,
      condition: 'used',
      images: [img('jacket')],
      categoryId: fashion._id,
      category: 'fashion',
      sellerId: sara._id,
      location: { country: 'ae', city: 'Dubai', area: 'Downtown' },
      likes: 56,
      views: 420,
    },
    {
      title: '2022 Toyota Camry',
      description: 'Low mileage, full service history.',
      price: 78000,
      condition: 'used',
      images: [img('camry')],
      categoryId: vehicles._id,
      category: 'vehicles',
      sellerId: sara._id,
      location: { country: 'sa', city: 'Riyadh', area: 'Olaya' },
      likes: 120,
      views: 2100,
    },
    {
      title: 'MacBook Pro M3 14"',
      description: 'Barely used, with warranty.',
      price: 7200,
      condition: 'refurbished',
      images: [img('macbook')],
      categoryId: electronics._id,
      category: 'electronics',
      sellerId: ahmed._id,
      likes: 180,
      views: 1500,
    },
    {
      title: 'Nike Air Max 270',
      description: 'Size 42, original box.',
      price: 380,
      condition: 'new',
      images: [img('nike')],
      categoryId: fashion._id,
      category: 'fashion',
      sellerId: sara._id,
      likes: 44,
      views: 310,
    },
  ]);

  await Auction.insertMany([
    {
      productId: products[0]._id,
      title: 'iPhone 15 Pro Max — Auction',
      description: 'Brand new sealed. Auction ends soon!',
      images: [img('iphone1')],
      startingBid: 3000,
      currentBid: 4250,
      bidIncrement: 50,
      biddersCount: 18,
      endTime: new Date(Date.now() + 2 * 3600000),
      sellerId: ahmed._id,
      status: 'active',
      bids: [
        { userId: sara._id, userName: 'Sara Hassan', amount: 4250, createdAt: new Date() },
      ],
    },
    {
      title: 'Vintage Rolex Submariner',
      description: 'Authenticated vintage Rolex.',
      images: [img('rolex')],
      startingBid: 25000,
      currentBid: 38500,
      bidIncrement: 500,
      biddersCount: 32,
      endTime: new Date(Date.now() + 24 * 3600000),
      sellerId: sara._id,
      status: 'active',
      bids: [],
    },
    {
      title: '2022 Toyota Camry — Live Auction',
      description: 'Low mileage. Bid now!',
      images: [img('camry')],
      startingBid: 45000,
      currentBid: 58200,
      bidIncrement: 200,
      biddersCount: 12,
      endTime: new Date(Date.now() + 8 * 3600000),
      sellerId: ahmed._id,
      status: 'active',
      bids: [],
    },
  ]);

  const days = (n) => new Date(Date.now() + n * 86400000);

  await Offer.insertMany([
    {
      businessId: btech._id,
      title: 'Samsung QLED 30% Off',
      titleKey: 'businesses.offers.bTech.tv.title',
      descKey: 'businesses.offers.bTech.tv.desc',
      description: 'Flash sale on selected TVs',
      image: img('tv1'),
      discountPercent: 30,
      originalPrice: 24999,
      salePrice: 17499,
      currency: 'EGP',
      badge: 'flash',
      validUntil: days(2),
      featured: true,
    },
    {
      businessId: btech._id,
      title: 'Phone Exclusive Deal',
      titleKey: 'businesses.offers.bTech.phone.title',
      descKey: 'businesses.offers.bTech.phone.desc',
      image: img('iphone1'),
      discountPercent: 15,
      originalPrice: 45999,
      salePrice: 39099,
      currency: 'EGP',
      badge: 'exclusive',
      validUntil: days(7),
    },
    {
      businessId: carrefour._id,
      title: 'Weekly Grocery Deals',
      titleKey: 'businesses.offers.carrefour.grocery.title',
      descKey: 'businesses.offers.carrefour.grocery.desc',
      image: img('grocery'),
      discountPercent: 40,
      originalPrice: 500,
      salePrice: 300,
      currency: 'EGP',
      badge: 'weekly',
      validUntil: days(3),
      featured: true,
    },
    {
      businessId: ikea._id,
      title: 'Summer Furniture Sale',
      titleKey: 'businesses.offers.ikea.summer.title',
      descKey: 'businesses.offers.ikea.summer.desc',
      image: img('sofa'),
      discountPercent: 30,
      originalPrice: 12000,
      salePrice: 8400,
      currency: 'EGP',
      badge: 'weekly',
      validUntil: days(21),
      featured: true,
    },
  ]);

  await Story.insertMany([
    {
      userId: ahmed._id,
      mediaUrl: img('story1'),
      mediaType: 'image',
      expiresAt: days(1),
    },
    {
      userId: sara._id,
      mediaUrl: img('story2'),
      mediaType: 'image',
      expiresAt: days(1),
    },
  ]);

  await Ad.insertMany([
    {
      title: '30% off Electronics',
      titleKey: 'ads.items.bTech.title',
      subtitleKey: 'ads.items.bTech.subtitle',
      image: img('ad1'),
      link: '/stores/b-tech',
      placement: 'home',
      order: 1,
    },
    {
      title: 'Weekly grocery deals',
      titleKey: 'ads.items.carrefour.title',
      subtitleKey: 'ads.items.carrefour.subtitle',
      image: img('ad2'),
      link: '/stores/carrefour-egypt',
      placement: 'sidebar',
      order: 2,
    },
  ]);

  await Notification.insertMany([
    { type: 'like', message: 'Sara liked your iPhone listing', link: `/marketplace/${products[0]._id}`, read: false },
    { type: 'bid', message: 'New bid on your auction: AED 4,250', link: '/auctions', read: false },
    { type: 'offer', message: 'New flash offer from B.Tech', link: '/stores', read: true },
  ]);

  await Comment.create({
    productId: products[0]._id,
    userId: sara._id,
    text: 'Is this still available?',
  });

  console.log('Seed complete');
  console.log('Demo login: ahmed@example.com / password123');
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
