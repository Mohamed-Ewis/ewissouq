import {
  users,
  products,
  auctions,
  categoryTree,
  businesses,
  stories,
  notifications,
  comments,
  savedProductIds,
  likedProductIds,
  followingUserIds,
  followingBusinessIds,
} from './data'
import { getBranchesForBusiness } from '@/data/businessBranches'
import { getOffersForBusiness, getFeaturedOffer } from '@/data/businessOffers'
import { homeAds } from '@/data/ads'
import { DEFAULT_AVATAR, DEFAULT_COVER, DEFAULT_PRODUCT_IMAGE } from '@/utils/demoImages'
import { getDescendantIds, findCategoryById, findCategoryPath, getRootCategoryId } from '@/utils/categoryHelpers'

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

function paginate(items, page = 1, pageSize = 12) {
  const start = (page - 1) * pageSize
  const data = items.slice(start, start + pageSize)
  return {
    data,
    meta: {
      page,
      pageSize,
      total: items.length,
      totalPages: Math.ceil(items.length / pageSize),
      hasMore: start + pageSize < items.length,
    },
  }
}

function filterProducts(params = {}) {
  let result = [...products].filter((p) => p.status === 'active')

  if (params.category) {
    const catId = Number(params.category)
    const ids = getDescendantIds(catId)
    result = result.filter((p) => ids.includes(p.categoryId) || ids.includes(p.rootCategoryId))
  }
  if (params.country) result = result.filter((p) => p.location?.country === params.country)
  if (params.city) result = result.filter((p) => p.location?.city === params.city)
  if (params.area) result = result.filter((p) => p.location?.area === params.area)
  if (params.condition) result = result.filter((p) => p.condition === params.condition)
  if (params.minPrice) result = result.filter((p) => p.price >= Number(params.minPrice))
  if (params.maxPrice) result = result.filter((p) => p.price <= Number(params.maxPrice))
  if (params.verified === 'true' || params.verified === true) {
    result = result.filter((p) => p.seller?.verified)
  }
  if (params.hasVideo === 'true' || params.hasVideo === true) {
    result = result.filter((p) => !!p.video)
  }
  if (params.q) {
    const q = params.q.toLowerCase()
    result = result.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
  }
  if (params.sellerId) result = result.filter((p) => p.sellerId === Number(params.sellerId))
  if (params.businessId) result = result.filter((p) => p.businessId === Number(params.businessId))
  if (params.sellerType) result = result.filter((p) => p.sellerType === params.sellerType)
  if (params.businessOnly === 'true' || params.businessOnly === true) {
    result = result.filter((p) => p.sellerType === 'business')
  }

  const sort = params.sort || 'recent'
  switch (sort) {
    case 'views':
      result.sort((a, b) => b.views - a.views)
      break
    case 'price_asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    case 'likes':
      result.sort((a, b) => b.likes - a.likes)
      break
    default:
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  return result
}

function filterBusinesses(params = {}) {
  let result = [...businesses]

  if (params.q) {
    const q = params.q.toLowerCase()
    result = result.filter((b) => b.slug.includes(q) || b.nameKey.toLowerCase().includes(q))
  }
  if (params.tier) result = result.filter((b) => b.tier === params.tier)
  if (params.featured === 'true' || params.featured === true) result = result.filter((b) => b.featured)
  if (params.country) result = result.filter((b) => b.location?.country === params.country)
  if (params.city) result = result.filter((b) => b.location?.city === params.city)
  if (params.category) {
    const catId = Number(params.category)
    const ids = getDescendantIds(catId)
    result = result.filter((b) => b.categoryIds.some((id) => ids.includes(id) || id === catId))
  }

  const sort = params.sort || 'followers'
  switch (sort) {
    case 'rating':
      result.sort((a, B) => B.rating - a.rating)
      break
    case 'recent':
      result.sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt))
      break
    default:
      result.sort((a, b) => b.followers - a.followers)
  }

  return result.map(enrichBusiness)
}

function enrichBusiness(business) {
  const storeProducts = products.filter((p) => p.businessId === business.id && p.status === 'active')
  const branches = getBranchesForBusiness(business.id)
  const offers = getOffersForBusiness(business.id)
  return {
    ...business,
    branches,
    branchesCount: branches.length,
    offers,
    offersCount: offers.length,
    featuredOffer: getFeaturedOffer(business.id),
    productsCount: storeProducts.length,
    isFollowing: followingBusinessIds.includes(business.id),
  }
}

function matchUrl(url, pattern) {
  const regex = new RegExp(`^${pattern.replace(/:\w+/g, '([^/]+)')}$`)
  return url.match(regex)
}

export async function handleMockRequest(config) {
  await delay(300 + Math.random() * 300)

  const method = (config.method || 'get').toLowerCase()
  const url = (config.url || '').replace(/^\//, '')
  const params = config.params || {}
  const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {}

  // Auth
  if (url === 'auth/login' && method === 'post') {
    const user = users.find((u) => u.email === body.email && u.password === body.password)
    if (!user) return { success: false, message: 'Invalid email or password', status: 401 }
    const { password, ...safeUser } = user
    return {
      success: true,
      data: {
        user: safeUser,
        accessToken: 'mock_access_token_' + user.id,
        refreshToken: 'mock_refresh_token_' + user.id,
      },
    }
  }

  if (url === 'auth/register' && method === 'post') {
    const newUser = {
      id: users.length + 1,
      name: body.name,
      email: body.email,
      password: body.password,
      avatar: body.avatar || DEFAULT_AVATAR,
      cover: DEFAULT_COVER,
      bio: '',
      accountType: 'individual',
      businessId: null,
      verified: false,
      rating: 0,
      followers: 0,
      following: 0,
      location: { country: 'ae', city: 'Dubai', area: 'Downtown' },
      joinedAt: new Date().toISOString().split('T')[0],
    }
    users.push(newUser)
    const { password, ...safeUser } = newUser
    return {
      success: true,
      data: {
        user: safeUser,
        accessToken: 'mock_access_token_' + newUser.id,
        refreshToken: 'mock_refresh_token_' + newUser.id,
      },
    }
  }

  if (url === 'auth/refresh' && method === 'post') {
    return {
      success: true,
      data: {
        accessToken: 'mock_access_token_refreshed',
        refreshToken: body.refreshToken,
      },
    }
  }

  if (url === 'auth/forgot-password' && method === 'post') {
    return { success: true, message: 'Password reset link sent to your email' }
  }

  if (url === 'auth/me' && method === 'get') {
    const { password, ...safeUser } = users[0]
    return { success: true, data: safeUser }
  }

  // Categories
  if (url === 'categories' && method === 'get') {
    return { success: true, data: categoryTree, tree: categoryTree }
  }

  // Stories
  if (url === 'stories' && method === 'get') {
    return { success: true, data: stories }
  }

  if (url === 'ads/home' && method === 'get') {
    return { success: true, data: homeAds }
  }

  // Products list
  if (url === 'products' && method === 'get') {
    const filtered = filterProducts(params)
    const result = paginate(filtered, Number(params.page) || 1, Number(params.pageSize) || 12)
    return { success: true, ...result }
  }

  // Create product
  if (url === 'products' && method === 'post') {
    const seller = users[0]
    const picked = findCategoryById(body.categoryId) || findCategoryById(categoryTree[0]?.id)
    const path = picked ? findCategoryPath(picked.id) || [picked] : []
    const newProduct = {
      id: products.length + 1,
      ...body,
      category: picked?.i18nKey || '',
      categorySlug: picked?.slug,
      categoryId: picked?.id,
      rootCategoryId: picked ? getRootCategoryId(picked.id) : null,
      parentCategoryId: path.length > 1 ? path[path.length - 2].id : null,
      categoryPath: path.map((n) => n.id),
      currency: 'AED',
      images: body.images || [DEFAULT_PRODUCT_IMAGE],
      sellerId: seller.id,
      sellerType: 'individual',
      businessId: null,
      seller: { id: seller.id, name: seller.name, avatar: seller.avatar, verified: seller.verified, rating: seller.rating, isBusiness: false },
      views: 0,
      likes: 0,
      commentsCount: 0,
      rating: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
    }
    products.unshift(newProduct)
    return { success: true, data: newProduct }
  }

  // Product by id
  let match = matchUrl(url, 'products/:id')
  if (match && method === 'get') {
    const product = products.find((p) => p.id === Number(match[1]))
    if (!product) return { success: false, message: 'Product not found', status: 404 }
    product.views += 1
    return { success: true, data: { ...product, isLiked: likedProductIds.includes(product.id), isSaved: savedProductIds.includes(product.id) } }
  }

  // Like product
  match = matchUrl(url, 'products/:id/like')
  if (match && method === 'post') {
    const id = Number(match[1])
    const idx = likedProductIds.indexOf(id)
    if (idx === -1) {
      likedProductIds.push(id)
      const p = products.find((pr) => pr.id === id)
      if (p) p.likes += 1
      return { success: true, data: { liked: true } }
    }
    likedProductIds.splice(idx, 1)
    const p = products.find((pr) => pr.id === id)
    if (p) p.likes -= 1
    return { success: true, data: { liked: false } }
  }

  // Save product
  match = matchUrl(url, 'products/:id/save')
  if (match && method === 'post') {
    const id = Number(match[1])
    const idx = savedProductIds.indexOf(id)
    if (idx === -1) {
      savedProductIds.push(id)
      return { success: true, data: { saved: true } }
    }
    savedProductIds.splice(idx, 1)
    return { success: true, data: { saved: false } }
  }

  // Comments
  match = matchUrl(url, 'products/:id/comments')
  if (match && method === 'get') {
    const id = Number(match[1])
    return { success: true, data: comments[id] || [] }
  }
  if (match && method === 'post') {
    const id = Number(match[1])
    if (!comments[id]) comments[id] = []
    const newComment = {
      id: Date.now(),
      userId: 1,
      userName: users[0].name,
      avatar: users[0].avatar,
      text: body.text,
      createdAt: new Date().toISOString(),
    }
    comments[id].push(newComment)
    const p = products.find((pr) => pr.id === id)
    if (p) p.commentsCount += 1
    return { success: true, data: newComment }
  }

  // Trending / recommended / most viewed
  if (url === 'products/trending' && method === 'get') {
    const data = [...products].filter((p) => p.status === 'active').sort((a, b) => b.likes - a.likes).slice(0, 8)
    return { success: true, data }
  }
  if (url === 'products/recommended' && method === 'get') {
    const data = [...products].filter((p) => p.status === 'active').sort(() => Math.random() - 0.5).slice(0, 8)
    return { success: true, data }
  }
  if (url === 'products/most-viewed' && method === 'get') {
    const data = [...products].filter((p) => p.status === 'active').sort((a, b) => b.views - a.views).slice(0, 8)
    return { success: true, data }
  }
  if (url === 'products/saved' && method === 'get') {
    const data = products.filter((p) => savedProductIds.includes(p.id))
    return { success: true, data }
  }

  // Feed timeline
  if (url === 'feed' && method === 'get') {
    const filtered = filterProducts(params)
    return paginate(filtered, Number(params.page) || 1, Number(params.pageSize) || 10)
  }

  // Auctions
  if (url === 'auctions' && method === 'get') {
    let result = [...auctions]
    if (params.status) result = result.filter((a) => a.status === params.status)
    return { success: true, data: result }
  }

  match = matchUrl(url, 'auctions/:id')
  if (match && method === 'get') {
    const auction = auctions.find((a) => a.id === Number(match[1]))
    if (!auction) return { success: false, message: 'Auction not found', status: 404 }
    return { success: true, data: auction }
  }

  match = matchUrl(url, 'auctions/:id/bid')
  if (match && method === 'post') {
    const auction = auctions.find((a) => a.id === Number(match[1]))
    if (!auction) return { success: false, message: 'Auction not found', status: 404 }
    if (auction.status === 'ended') return { success: false, message: 'Auction has ended', status: 400 }
    const amount = Number(body.amount)
    if (amount <= auction.currentBid) {
      return { success: false, message: 'Bid must be higher than current bid', status: 400 }
    }
    auction.currentBid = amount
    auction.biddersCount += 1
    auction.bids.unshift({
      id: Date.now(),
      userId: 1,
      userName: users[0].name,
      amount,
      createdAt: new Date().toISOString(),
    })
    return { success: true, data: auction }
  }

  // Users
  if (url === 'users' && method === 'get') {
    const safe = users.map(({ password, ...u }) => u)
    return { success: true, data: safe }
  }

  match = matchUrl(url, 'users/:id')
  if (match && method === 'get') {
    const user = users.find((u) => u.id === Number(match[1]))
    if (!user) return { success: false, message: 'User not found', status: 404 }
    const { password, ...safeUser } = user
    const userProducts = products.filter((p) => p.sellerId === user.id)
    const linkedBusiness = user.businessId
      ? enrichBusiness(businesses.find((b) => b.id === user.businessId))
      : null
    return {
      success: true,
      data: {
        ...safeUser,
        business: linkedBusiness,
        isFollowing: followingUserIds.includes(user.id),
        publishedProducts: userProducts.filter((p) => p.status === 'active'),
        soldProducts: userProducts.filter((p) => p.status === 'sold'),
        savedProducts: products.filter((p) => savedProductIds.includes(p.id)),
      },
    }
  }

  match = matchUrl(url, 'users/:id/follow')
  if (match && method === 'post') {
    const id = Number(match[1])
    const idx = followingUserIds.indexOf(id)
    const user = users.find((u) => u.id === id)
    if (idx === -1) {
      followingUserIds.push(id)
      if (user) user.followers += 1
      return { success: true, data: { following: true } }
    }
    followingUserIds.splice(idx, 1)
    if (user) user.followers -= 1
    return { success: true, data: { following: false } }
  }

  // Businesses / Stores
  if (url === 'businesses' && method === 'get') {
    const filtered = filterBusinesses(params)
    const result = paginate(filtered, Number(params.page) || 1, Number(params.pageSize) || 12)
    return { success: true, ...result }
  }

  if (url === 'businesses/featured' && method === 'get') {
    const data = filterBusinesses({ featured: true })
    return { success: true, data }
  }

  match = matchUrl(url, 'businesses/:slugOrId')
  if (match && method === 'get') {
    const key = match[1]
    const business = businesses.find((b) => b.slug === key || b.id === Number(key))
    if (!business) return { success: false, message: 'Store not found', status: 404 }
    const enriched = enrichBusiness(business)
    const storeProducts = products.filter((p) => p.businessId === business.id && p.status === 'active')
    const owner = users.find((u) => u.id === business.ownerUserId)
    const { password, ...safeOwner } = owner || {}
    return {
      success: true,
      data: {
        ...enriched,
        owner: safeOwner || null,
        products: storeProducts,
        soldProducts: products.filter((p) => p.businessId === business.id && p.status === 'sold'),
      },
    }
  }

  match = matchUrl(url, 'businesses/:id/follow')
  if (match && method === 'post') {
    const id = Number(match[1])
    const idx = followingBusinessIds.indexOf(id)
    const business = businesses.find((b) => b.id === id)
    if (idx === -1) {
      followingBusinessIds.push(id)
      if (business) business.followers += 1
      return { success: true, data: { following: true } }
    }
    followingBusinessIds.splice(idx, 1)
    if (business) business.followers -= 1
    return { success: true, data: { following: false } }
  }

  // Notifications
  if (url === 'notifications' && method === 'get') {
    return { success: true, data: notifications }
  }
  if (url === 'notifications/read-all' && method === 'post') {
    notifications.forEach((n) => { n.read = true })
    return { success: true }
  }

  match = matchUrl(url, 'notifications/:id/read')
  if (match && method === 'post') {
    const n = notifications.find((not) => not.id === Number(match[1]))
    if (n) n.read = true
    return { success: true }
  }

  return { success: false, message: `Mock endpoint not found: ${method.toUpperCase()} /${url}`, status: 404 }
}
