import { defineStore } from 'pinia'
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/api/notifications'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    items: [],
    loading: false,
  }),

  getters: {
    unreadCount: (state) => state.items.filter((n) => !n.read).length,
  },

  actions: {
    async fetchNotifications() {
      this.loading = true
      try {
        const res = await getNotifications()
        this.items = res.data || res || []
      } finally {
        this.loading = false
      }
    },

    async markRead(id) {
      await markNotificationRead(id)
      const item = this.items.find((n) => n.id === id)
      if (item) item.read = true
    },

    async markAllRead() {
      await markAllNotificationsRead()
      this.items.forEach((n) => { n.read = true })
    },
  },
})
