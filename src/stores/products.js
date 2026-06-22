import { defineStore } from 'pinia'
import {
  getProducts,
  getProduct,
  getFeed,
  getTrendingProducts,
  getRecommendedProducts,
  getMostViewedProducts,
  getSavedProducts,
  likeProduct,
  saveProduct,
  createProduct,
} from '@/api/products'
import { PAGE_SIZE } from '@/utils/constants'
import { unwrapApiData } from '@/utils/api'

export const useProductsStore = defineStore('products', {
  state: () => ({
    feed: [],
    products: [],
    trending: [],
    recommended: [],
    mostViewed: [],
    saved: [],
    currentProduct: null,
    filters: {},
    loading: false,
    feedLoading: false,
    error: null,
    feedPage: 1,
    feedHasMore: true,
    productsMeta: null,
  }),

  actions: {
    async fetchFeed(append = false) {
      if (!append) {
        this.feedPage = 1
        this.feedHasMore = true
      }
      if (!this.feedHasMore) return
      this.feedLoading = true
      try {
        const res = await getFeed({ page: this.feedPage, pageSize: PAGE_SIZE })
        const items = res.data || []
        this.feed = append ? [...this.feed, ...items] : items
        this.feedHasMore = res.meta?.hasMore ?? false
        if (this.feedHasMore) this.feedPage += 1
      } catch (err) {
        this.error = err.message
      } finally {
        this.feedLoading = false
      }
    },

    async fetchProducts(params = {}) {
      this.loading = true
      this.filters = { ...this.filters, ...params }
      try {
        const res = await getProducts({ ...this.filters, pageSize: PAGE_SIZE })
        this.products = res.data || []
        this.productsMeta = res.meta
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async fetchProduct(id) {
      this.loading = true
      this.error = null
      try {
        const res = await getProduct(id)
        this.currentProduct = unwrapApiData(res)
        if (!this.currentProduct) {
          throw new Error('Product not found')
        }
      } catch (err) {
        this.error = err.message || 'Failed to load product'
        this.currentProduct = null
      } finally {
        this.loading = false
      }
    },

    async fetchHomeSections() {
      try {
        const [trending, recommended, mostViewed] = await Promise.all([
          getTrendingProducts(),
          getRecommendedProducts(),
          getMostViewedProducts(),
        ])
        this.trending = trending.data || trending || []
        this.recommended = recommended.data || recommended || []
        this.mostViewed = mostViewed.data || mostViewed || []
      } catch (err) {
        this.error = err.message
      }
    },

    async fetchSaved() {
      try {
        const res = await getSavedProducts()
        this.saved = res.data || res || []
      } catch (err) {
        this.error = err.message
      }
    },

    async toggleLike(id) {
      await likeProduct(id)
      if (this.currentProduct?.id === id) {
        this.currentProduct.isLiked = !this.currentProduct.isLiked
        this.currentProduct.likes += this.currentProduct.isLiked ? 1 : -1
      }
    },

    async toggleSave(id) {
      await saveProduct(id)
      if (this.currentProduct?.id === id) {
        this.currentProduct.isSaved = !this.currentProduct.isSaved
      }
    },

    async createListing(data) {
      const res = await createProduct(data)
      return res.data || res
    },
  },
})
