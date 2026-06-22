import { defineStore } from 'pinia'
import { getAuctions, getAuction, placeBid } from '@/api/auctions'

export const useAuctionsStore = defineStore('auctions', {
  state: () => ({
    auctions: [],
    currentAuction: null,
    loading: false,
    error: null,
    bidding: false,
  }),

  getters: {
    activeAuctions: (state) => state.auctions.filter((a) => a.status === 'active'),
    endedAuctions: (state) => state.auctions.filter((a) => a.status === 'ended'),
  },

  actions: {
    async fetchAuctions(params = {}) {
      this.loading = true
      try {
        const res = await getAuctions(params)
        this.auctions = res.data || res || []
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async fetchAuction(id) {
      this.loading = true
      try {
        const res = await getAuction(id)
        this.currentAuction = res.data || res
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async bid(id, amount) {
      this.bidding = true
      try {
        const res = await placeBid(id, { amount })
        this.currentAuction = res.data || res
        return this.currentAuction
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.bidding = false
      }
    },
  },
})
