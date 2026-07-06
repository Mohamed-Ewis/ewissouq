import { productImages } from '@/utils/demoImages'

/** @typedef {'flash' | 'weekly' | 'exclusive' | 'bundle' | 'clearance'} OfferBadge */

export const businessOffers = [
  // B.Tech
  { id: 1, businessId: 1, titleKey: 'businesses.offers.bTech.tv.title', descKey: 'businesses.offers.bTech.tv.desc', image: productImages[2], discountPercent: 30, originalPrice: 24999, salePrice: 17499, currency: 'EGP', badge: 'flash', validUntil: daysFromNow(2), featured: true },
  { id: 2, businessId: 1, titleKey: 'businesses.offers.bTech.phone.title', descKey: 'businesses.offers.bTech.phone.desc', image: productImages[0], discountPercent: 15, originalPrice: 45999, salePrice: 39099, currency: 'EGP', badge: 'exclusive', validUntil: daysFromNow(7), featured: false },
  { id: 3, businessId: 1, titleKey: 'businesses.offers.bTech.ac.title', descKey: 'businesses.offers.bTech.ac.desc', image: productImages[14], discountPercent: 20, originalPrice: 18999, salePrice: 15199, currency: 'EGP', badge: 'weekly', validUntil: daysFromNow(5), featured: false },
  { id: 4, businessId: 1, titleKey: 'businesses.offers.bTech.bundle.title', descKey: 'businesses.offers.bTech.bundle.desc', image: productImages[11], discountPercent: 25, originalPrice: 32000, salePrice: 24000, currency: 'EGP', badge: 'bundle', validUntil: daysFromNow(10), featured: false },

  // Carrefour
  { id: 5, businessId: 2, titleKey: 'businesses.offers.carrefour.grocery.title', descKey: 'businesses.offers.carrefour.grocery.desc', image: productImages[7], discountPercent: 40, originalPrice: 500, salePrice: 300, currency: 'EGP', badge: 'weekly', validUntil: daysFromNow(3), featured: true },
  { id: 6, businessId: 2, titleKey: 'businesses.offers.carrefour.electronics.title', descKey: 'businesses.offers.carrefour.electronics.desc', image: productImages[3], discountPercent: 35, originalPrice: 8999, salePrice: 5849, currency: 'EGP', badge: 'flash', validUntil: daysFromNow(1), featured: false },
  { id: 7, businessId: 2, titleKey: 'businesses.offers.carrefour.home.title', descKey: 'businesses.offers.carrefour.home.desc', image: productImages[10], discountPercent: 50, originalPrice: 2000, salePrice: 999, currency: 'EGP', badge: 'clearance', validUntil: daysFromNow(14), featured: false },

  // IKEA
  { id: 8, businessId: 3, titleKey: 'businesses.offers.ikea.summer.title', descKey: 'businesses.offers.ikea.summer.desc', image: productImages[11], discountPercent: 30, originalPrice: 12000, salePrice: 8400, currency: 'EGP', badge: 'weekly', validUntil: daysFromNow(21), featured: true },
  { id: 9, businessId: 3, titleKey: 'businesses.offers.ikea.bedroom.title', descKey: 'businesses.offers.ikea.bedroom.desc', image: productImages[8], discountPercent: 20, originalPrice: 18500, salePrice: 14800, currency: 'EGP', badge: 'exclusive', validUntil: daysFromNow(12), featured: false },

  // Virgin
  { id: 10, businessId: 4, titleKey: 'businesses.offers.virgin.gaming.title', descKey: 'businesses.offers.virgin.gaming.desc', image: productImages[4], discountPercent: 20, originalPrice: 1899, salePrice: 1519, currency: 'AED', badge: 'flash', validUntil: daysFromNow(4), featured: true },
  { id: 11, businessId: 4, titleKey: 'businesses.offers.virgin.audio.title', descKey: 'businesses.offers.virgin.audio.desc', image: productImages[3], discountPercent: 25, originalPrice: 1299, salePrice: 974, currency: 'AED', badge: 'exclusive', validUntil: daysFromNow(8), featured: false },

  // Mobile Shop
  { id: 12, businessId: 5, titleKey: 'businesses.offers.mobileShop.trade.title', descKey: 'businesses.offers.mobileShop.trade.desc', image: productImages[1], discountPercent: 10, originalPrice: 15000, salePrice: 13500, currency: 'EGP', badge: 'exclusive', validUntil: daysFromNow(30), featured: true },

  // El Araby
  { id: 13, businessId: 6, titleKey: 'businesses.offers.elAraby.fridge.title', descKey: 'businesses.offers.elAraby.fridge.desc', image: productImages[14], discountPercent: 18, originalPrice: 22000, salePrice: 18040, currency: 'EGP', badge: 'weekly', validUntil: daysFromNow(6), featured: true },

  // Home Centre
  { id: 14, businessId: 7, titleKey: 'businesses.offers.homeCentre.sofa.title', descKey: 'businesses.offers.homeCentre.sofa.desc', image: productImages[10], discountPercent: 35, originalPrice: 4999, salePrice: 3249, currency: 'AED', badge: 'clearance', validUntil: daysFromNow(9), featured: true },

  // Sharaf DG
  { id: 15, businessId: 8, titleKey: 'businesses.offers.sharafDg.laptop.title', descKey: 'businesses.offers.sharafDg.laptop.desc', image: productImages[2], discountPercent: 22, originalPrice: 4599, salePrice: 3587, currency: 'AED', badge: 'flash', validUntil: daysFromNow(2), featured: true },
  { id: 16, businessId: 8, titleKey: 'businesses.offers.sharafDg.tv.title', descKey: 'businesses.offers.sharafDg.tv.desc', image: productImages[5], discountPercent: 28, originalPrice: 3299, salePrice: 2375, currency: 'AED', badge: 'weekly', validUntil: daysFromNow(7), featured: false },
]

function daysFromNow(days) {
  return new Date(Date.now() + days * 86400000).toISOString()
}

export function getOffersForBusiness(businessId) {
  return businessOffers.filter((o) => o.businessId === businessId)
}

export function getOfferById(id) {
  return businessOffers.find((o) => o.id === Number(id))
}

export function getAllOffers() {
  return [...businessOffers]
}

export function getFeaturedOffer(businessId) {
  return businessOffers.find((o) => o.businessId === businessId && o.featured)
    || businessOffers.find((o) => o.businessId === businessId)
}
