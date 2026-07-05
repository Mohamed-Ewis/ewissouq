import {
  avatarPool,
  coverPool,
  productImages,
  DEMO_VIDEO,
  demoStoryVideos,
  demoStoryImage,
} from '@/utils/demoImages'
import { categoryTree } from '@/data/categories'
import { businesses, getBusinessSummary } from '@/data/businesses'
import { getLeafCategories, findCategoryPath, getRootCategoryId } from '@/utils/categoryHelpers'

export { categoryTree, categoryTree as categories, businesses }

export const users = [
  {
    id: 1,
    name: 'Ahmed Al-Rashid',
    email: 'ahmed@example.com',
    password: 'password123',
    avatar: avatarPool[0],
    cover: coverPool[0],
    bio: 'Premium electronics seller. Fast shipping across UAE.',
    accountType: 'business',
    businessId: 5,
    verified: true,
    rating: 4.9,
    followers: 2840,
    following: 156,
    location: { country: 'ae', city: 'Dubai', area: 'Marina' },
    joinedAt: '2023-03-15',
  },
  {
    id: 2,
    name: 'Sara Hassan',
    email: 'sara@example.com',
    password: 'password123',
    avatar: avatarPool[1],
    cover: coverPool[1],
    bio: 'Fashion enthusiast & vintage collector.',
    accountType: 'individual',
    businessId: null,
    verified: true,
    rating: 4.7,
    followers: 1520,
    following: 89,
    location: { country: 'ae', city: 'Dubai', area: 'Downtown' },
    joinedAt: '2023-06-20',
  },
  {
    id: 3,
    name: 'Omar Khalil',
    email: 'omar@example.com',
    password: 'password123',
    avatar: avatarPool[2],
    cover: coverPool[2],
    bio: 'Car enthusiast. Certified pre-owned vehicles.',
    accountType: 'individual',
    businessId: null,
    verified: false,
    rating: 4.5,
    followers: 890,
    following: 45,
    location: { country: 'sa', city: 'Riyadh', area: 'Olaya' },
    joinedAt: '2024-01-10',
  },
  {
    id: 4,
    name: 'Layla Mansour',
    email: 'layla@example.com',
    password: 'password123',
    avatar: avatarPool[3],
    cover: coverPool[3],
    bio: 'Home decor & furniture specialist.',
    accountType: 'business',
    businessId: 7,
    verified: true,
    rating: 4.8,
    followers: 2100,
    following: 120,
    location: { country: 'eg', city: 'Cairo', area: 'Zamalek' },
    joinedAt: '2023-09-05',
  },
  {
    id: 5,
    name: 'Youssef Nabil',
    email: 'youssef@example.com',
    password: 'password123',
    avatar: avatarPool[4],
    cover: coverPool[0],
    bio: 'Sports gear & outdoor equipment.',
    accountType: 'individual',
    businessId: null,
    verified: false,
    rating: 4.3,
    followers: 456,
    following: 78,
    location: { country: 'jo', city: 'Amman', area: 'Abdoun' },
    joinedAt: '2024-04-18',
  },
  {
    id: 6,
    name: 'B.Tech Egypt',
    email: 'btech@example.com',
    password: 'password123',
    avatar: productImages[2],
    cover: coverPool[0],
    bio: 'Official B.Tech store — electronics & appliances across Egypt.',
    accountType: 'business',
    businessId: 1,
    verified: true,
    rating: 4.8,
    followers: 45200,
    following: 12,
    location: { country: 'eg', city: 'Cairo', area: 'Nasr City' },
    joinedAt: '2019-01-15',
  },
  {
    id: 7,
    name: 'Carrefour Egypt',
    email: 'carrefour@example.com',
    password: 'password123',
    avatar: productImages[7],
    cover: coverPool[1],
    bio: 'Hypermarket — groceries, electronics, home & more.',
    accountType: 'business',
    businessId: 2,
    verified: true,
    rating: 4.6,
    followers: 89100,
    following: 5,
    location: { country: 'eg', city: 'Cairo', area: 'New Cairo' },
    joinedAt: '2018-06-01',
  },
  {
    id: 8,
    name: 'IKEA Egypt',
    email: 'ikea@example.com',
    password: 'password123',
    avatar: productImages[11],
    cover: coverPool[2],
    bio: 'Affordable furniture & home solutions.',
    accountType: 'business',
    businessId: 3,
    verified: true,
    rating: 4.7,
    followers: 62400,
    following: 8,
    location: { country: 'eg', city: 'Cairo', area: 'New Cairo' },
    joinedAt: '2020-03-10',
  },
  {
    id: 9,
    name: 'Virgin Megastore UAE',
    email: 'virgin@example.com',
    password: 'password123',
    avatar: productImages[3],
    cover: coverPool[3],
    bio: 'Entertainment, electronics & lifestyle retail.',
    accountType: 'business',
    businessId: 4,
    verified: true,
    rating: 4.5,
    followers: 28300,
    following: 20,
    location: { country: 'ae', city: 'Dubai', area: 'Downtown' },
    joinedAt: '2017-11-20',
  },
  {
    id: 10,
    name: 'El Araby Group',
    email: 'elaraby@example.com',
    password: 'password123',
    avatar: productImages[14],
    cover: coverPool[1],
    bio: 'Home appliances & electronics manufacturer.',
    accountType: 'business',
    businessId: 6,
    verified: true,
    rating: 4.6,
    followers: 35600,
    following: 3,
    location: { country: 'eg', city: 'Tanta', area: 'Industrial' },
    joinedAt: '2016-05-01',
  },
  {
    id: 11,
    name: 'Sharaf DG',
    email: 'sharafdg@example.com',
    password: 'password123',
    avatar: productImages[5],
    cover: coverPool[3],
    bio: 'Electronics & gadgets — UAE & GCC.',
    accountType: 'business',
    businessId: 8,
    verified: true,
    rating: 4.7,
    followers: 52100,
    following: 15,
    location: { country: 'ae', city: 'Dubai', area: 'Deira' },
    joinedAt: '2015-02-14',
  },
]

const titles = [
  'iPhone 15 Pro Max 256GB — Titanium Blue',
  'Samsung Galaxy S24 Ultra — Like New',
  'MacBook Pro M3 14" — 16GB RAM',
  'Sony WH-1000XM5 Noise Cancelling Headphones',
  'Designer Leather Handbag — Authentic',
  'Vintage Rolex Submariner — Serviced',
  'Nike Air Jordan 1 Retro High OG',
  'Modern L-Shaped Sofa — Grey Fabric',
  '2022 Toyota Camry — Low Mileage',
  'Canon EOS R6 Mark II Camera Body',
  'PlayStation 5 Slim + 2 Controllers',
  'Apple Watch Ultra 2 — Titanium',
  'Dyson V15 Detect Vacuum Cleaner',
  'Gaming PC RTX 4080 — Custom Build',
  'Antique Persian Rug — 3x2 meters',
  'Baby Stroller Premium — Almost New',
  'Professional Drone DJI Mavic 3',
  'Electric Scooter — 65km Range',
  'Luxury Perfume Collection — 5 Bottles',
  'Office Desk Standing Adjustable',
  'iPad Pro 12.9" M2 — With Pencil',
  'Winter Jacket Canada Goose — Size L',
  'Smart Home Security Bundle',
  'Mountain Bike Carbon Frame — 29"',
]

const businessTitles = {
  1: ['Samsung 55" QLED Smart TV — B.Tech Exclusive', 'LG Front Load Washer 9kg', 'Haier Split AC 1.5 HP', 'iPhone 15 — Official Warranty', 'PlayStation 5 Slim Bundle', 'Dyson Air Purifier Hot+Cool'],
  2: ['Weekly Grocery Bundle — Family Pack', 'Nespresso Vertuo Machine', 'Baby Care Essentials Box', 'Organic Fresh Produce Box', 'Kitchen Starter Kit'],
  3: ['MALM Bed Frame — Queen Size', 'BILLY Bookcase White', 'POÄNG Armchair', 'KALLAX Shelf Unit', 'HEMNES TV Unit', 'LACK Coffee Table'],
  4: ['AirPods Pro 2nd Gen', 'Nintendo Switch OLED', 'Vinyl Records Collection Box', 'DJI Mini 4 Pro Drone', 'MacBook Air M3'],
  5: ['Samsung Galaxy A55 — New Sealed', 'Redmi Note 13 Pro', 'Phone Case + Screen Guard Bundle', 'Fast Charger 65W'],
  6: ['El Araby Refrigerator 420L', 'El Araby Washing Machine 8kg', 'El Araby Microwave Oven', 'El Araby Water Dispenser'],
  7: ['Modern Sectional Sofa — Grey', 'Dining Set 6 Seater', 'King Size Bed with Storage', 'Office Desk & Chair Set'],
  8: ['Sony WH-1000XM5 Headphones', 'Apple iPad Air M2', 'Samsung Galaxy Tab S9', 'Gaming Monitor 27" 165Hz', 'Logitech MX Master 3S'],
}

function buildSellerFields(seller, business = null) {
  if (business) {
    return {
      sellerType: 'business',
      businessId: business.id,
      sellerId: business.ownerUserId,
      seller: {
        id: business.ownerUserId,
        name: business.nameKey,
        nameKey: business.nameKey,
        avatar: business.logo,
        verified: business.verified,
        rating: business.rating,
        isBusiness: true,
        businessSlug: business.slug,
        businessTier: business.tier,
      },
      business: getBusinessSummary(business),
    }
  }
  return {
    sellerType: 'individual',
    businessId: null,
    sellerId: seller.id,
    seller: {
      id: seller.id,
      name: seller.name,
      avatar: seller.avatar,
      verified: seller.verified,
      rating: seller.rating,
      isBusiness: false,
    },
    business: null,
  }
}

function buildProducts() {
  const leafCategories = getLeafCategories(categoryTree)
  const products = []
  let productId = 1

  for (let i = 0; i < 36; i++) {
    const seller = users.find((u) => u.accountType === 'individual') || users[i % users.length]
    const leaf = leafCategories[i % leafCategories.length]
    const path = findCategoryPath(leaf.id) || [leaf]
    const rootId = getRootCategoryId(leaf.id)
    const condition = i % 3 === 0 ? 'new' : i % 3 === 1 ? 'used' : 'refurbished'
    const hasVideo = i % 4 === 0
    products.push({
      id: productId++,
      title: titles[i % titles.length],
      description: `Premium quality listing in ${leaf.slug.replace(/-/g, ' ')} category. Item is in ${condition} condition. Carefully maintained and ready for immediate use.`,
      price: Math.round((Math.random() * 15000 + 200) / 10) * 10,
      currency: 'AED',
      condition,
      categoryId: leaf.id,
      rootCategoryId: rootId,
      parentCategoryId: path.length > 1 ? path[path.length - 2].id : rootId,
      categorySlug: leaf.slug,
      category: leaf.i18nKey,
      categoryPath: path.map((n) => n.id),
      images: [
        productImages[i % productImages.length],
        productImages[(i + 3) % productImages.length],
        productImages[(i + 5) % productImages.length],
      ],
      video: hasVideo ? DEMO_VIDEO : null,
      location: seller.location,
      ...buildSellerFields(seller),
      views: Math.floor(Math.random() * 5000) + 100,
      likes: Math.floor(Math.random() * 500) + 10,
      commentsCount: Math.floor(Math.random() * 50),
      rating: +(3.5 + Math.random() * 1.5).toFixed(1),
      status: i % 10 === 0 ? 'sold' : 'active',
      isAuction: false,
      createdAt: new Date(Date.now() - i * 3600000 * 6).toISOString(),
      tags: ['trending', 'featured'].filter(() => Math.random() > 0.7),
    })
  }

  businesses.forEach((business, bi) => {
    const titlesForBiz = businessTitles[business.id] || ['Store Product']
    const owner = users.find((u) => u.id === business.ownerUserId) || users[0]
    titlesForBiz.forEach((title, ti) => {
      const leaf = leafCategories[(bi * 3 + ti) % leafCategories.length]
      const path = findCategoryPath(leaf.id) || [leaf]
      const rootId = getRootCategoryId(leaf.id)
      const idx = bi * 10 + ti
      products.push({
        id: productId++,
        title,
        description: `Official listing from our store. Brand new with warranty. Available for pickup or delivery.`,
        price: Math.round((Math.random() * 12000 + 500) / 10) * 10,
        currency: business.location.country === 'eg' ? 'EGP' : 'AED',
        condition: 'new',
        categoryId: leaf.id,
        rootCategoryId: rootId,
        parentCategoryId: path.length > 1 ? path[path.length - 2].id : rootId,
        categorySlug: leaf.slug,
        category: leaf.i18nKey,
        categoryPath: path.map((n) => n.id),
        images: [
          productImages[idx % productImages.length],
          productImages[(idx + 2) % productImages.length],
        ],
        video: ti === 0 && bi % 2 === 0 ? DEMO_VIDEO : null,
        location: business.location,
        ...buildSellerFields(owner, business),
        views: Math.floor(Math.random() * 8000) + 500,
        likes: Math.floor(Math.random() * 800) + 50,
        commentsCount: Math.floor(Math.random() * 30),
        rating: +(4 + Math.random() * 1).toFixed(1),
        status: 'active',
        isAuction: false,
        createdAt: new Date(Date.now() - idx * 3600000 * 4).toISOString(),
        tags: business.tier === 'premium' ? ['featured', 'business'] : ['business'],
      })
    })
  })

  return products
}

export let products = buildProducts()

export const auctions = [
  {
    id: 1,
    productId: 1,
    title: 'iPhone 15 Pro Max — Auction',
    description: 'Brand new sealed iPhone 15 Pro Max. Auction ends soon!',
    images: [productImages[0], productImages[1]],
    startingBid: 3000,
    currentBid: 4250,
    bidIncrement: 50,
    currency: 'AED',
    biddersCount: 18,
    endTime: new Date(Date.now() + 2 * 3600000).toISOString(),
    sellerId: 1,
    seller: users[0],
    status: 'active',
    bids: [
      { id: 1, userId: 2, userName: 'Sara Hassan', amount: 4250, createdAt: new Date(Date.now() - 300000).toISOString() },
      { id: 2, userId: 3, userName: 'Omar Khalil', amount: 4200, createdAt: new Date(Date.now() - 600000).toISOString() },
      { id: 3, userId: 4, userName: 'Layla Mansour', amount: 4100, createdAt: new Date(Date.now() - 900000).toISOString() },
    ],
  },
  {
    id: 2,
    productId: 6,
    title: 'Vintage Rolex Submariner',
    description: 'Authenticated vintage Rolex. Rare find!',
    images: [productImages[5], productImages[6]],
    startingBid: 25000,
    currentBid: 38500,
    bidIncrement: 500,
    currency: 'AED',
    biddersCount: 32,
    endTime: new Date(Date.now() + 24 * 3600000).toISOString(),
    sellerId: 2,
    seller: users[1],
    status: 'active',
    bids: [
      { id: 4, userId: 1, userName: 'Ahmed Al-Rashid', amount: 38500, createdAt: new Date(Date.now() - 120000).toISOString() },
      { id: 5, userId: 5, userName: 'Youssef Nabil', amount: 38000, createdAt: new Date(Date.now() - 480000).toISOString() },
    ],
  },
  {
    id: 3,
    productId: 9,
    title: '2022 Toyota Camry — Live Auction',
    description: 'Low mileage, full service history. Bid now!',
    images: [productImages[8], productImages[9]],
    startingBid: 45000,
    currentBid: 58200,
    bidIncrement: 1000,
    currency: 'AED',
    biddersCount: 24,
    endTime: new Date(Date.now() + 48 * 3600000).toISOString(),
    sellerId: 3,
    seller: users[2],
    status: 'active',
    bids: [
      { id: 6, userId: 1, userName: 'Ahmed Al-Rashid', amount: 58200, createdAt: new Date(Date.now() - 180000).toISOString() },
    ],
  },
  {
    id: 4,
    productId: 14,
    title: 'Gaming PC RTX 4080 Build',
    description: 'Custom gaming rig with top specs.',
    images: [productImages[3], productImages[4]],
    startingBid: 8000,
    currentBid: 11200,
    bidIncrement: 200,
    currency: 'AED',
    biddersCount: 15,
    endTime: new Date(Date.now() - 3600000).toISOString(),
    sellerId: 5,
    seller: users[4],
    status: 'ended',
    bids: [],
  },
]

function buildStoryItems(userIndex) {
  const imageIds = [1, 10, 20, 30, 48, 60, 77, 96, 101, 119]
  const base = userIndex * 2
  return [
    {
      id: userIndex * 10 + 1,
      type: 'image',
      url: demoStoryImage(imageIds[base % imageIds.length]),
      duration: 5000,
    },
    {
      id: userIndex * 10 + 2,
      type: userIndex % 2 === 0 ? 'video' : 'image',
      url: userIndex % 2 === 0
        ? demoStoryVideos[userIndex % demoStoryVideos.length]
        : demoStoryImage(imageIds[(base + 1) % imageIds.length]),
      duration: userIndex % 2 === 0 ? 12000 : 5000,
    },
    {
      id: userIndex * 10 + 3,
      type: 'image',
      url: demoStoryImage(imageIds[(base + 2) % imageIds.length]),
      duration: 5000,
    },
  ]
}

export const stories = users.map((user, i) => ({
  id: i + 1,
  userId: user.id,
  userName: user.name,
  avatar: user.avatar,
  viewed: i % 3 === 0,
  createdAt: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
  items: buildStoryItems(i),
}))

export const notifications = [
  { id: 1, type: 'like', message: 'Sara Hassan liked your iPhone listing', read: false, createdAt: new Date(Date.now() - 600000).toISOString(), link: '/marketplace/1' },
  { id: 2, type: 'follow', message: 'Omar Khalil started following you', read: false, createdAt: new Date(Date.now() - 3600000).toISOString(), link: '/profile/3' },
  { id: 3, type: 'bid', message: 'New bid on your Rolex auction: AED 38,500', read: true, createdAt: new Date(Date.now() - 7200000).toISOString(), link: '/auctions/2' },
  { id: 4, type: 'comment', message: 'Layla commented on your sofa listing', read: true, createdAt: new Date(Date.now() - 86400000).toISOString(), link: '/marketplace/8' },
  { id: 5, type: 'sale', message: 'Your PlayStation 5 has been sold!', read: false, createdAt: new Date(Date.now() - 172800000).toISOString(), link: '/marketplace/11' },
]

export const comments = {
  1: [
    { id: 1, userId: 2, userName: 'Sara Hassan', avatar: avatarPool[1], text: 'Is this still available?', createdAt: new Date(Date.now() - 7200000).toISOString() },
    { id: 2, userId: 3, userName: 'Omar Khalil', avatar: avatarPool[2], text: 'Great price! Can you do AED 4000?', createdAt: new Date(Date.now() - 3600000).toISOString() },
  ],
  2: [
    { id: 3, userId: 4, userName: 'Layla Mansour', avatar: avatarPool[3], text: 'Beautiful bag!', createdAt: new Date(Date.now() - 86400000).toISOString() },
  ],
}

export let savedProductIds = [2, 5, 11, 18]
export let likedProductIds = [1, 3, 7, 12]
export let followingUserIds = [2, 4]

export let followingBusinessIds = [1, 2, 4, 8]

export function resetMockData() {
  products = buildProducts()
}
