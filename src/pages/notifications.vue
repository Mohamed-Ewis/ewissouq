<template>
  <div class="notifications-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold mb-1">{{ $t('notifications.title') }}</h2>
        <p class="text-muted mb-0">{{ $t('notifications.unread', { count: unreadCount }) }}</p>
      </div>
      <button v-if="unreadCount" class="btn btn-sm btn-outline-primary" @click="markAllRead">
        {{ $t('notifications.markAllRead') }}
      </button>
    </div>

    <div v-if="notificationsStore.loading" class="py-4">
      <UiSkeletonLoader v-for="i in 5" :key="i" type="list" />
    </div>

    <div v-else-if="notificationsStore.items.length" class="notification-list">
      <NuxtLinkLocale
        v-for="notif in notificationsStore.items"
        :key="notif.id"
        :to="notif.link"
        class="notification-item card p-3 mb-2 text-decoration-none d-flex gap-3 align-items-start"
        :class="{ unread: !notif.read }"
        @click="markRead(notif.id)"
      >
        <div class="notif-icon" :class="notif.type">
          <i :class="iconFor(notif.type)" />
        </div>
        <div class="flex-grow-1">
          <p class="mb-1 small" :class="{ 'fw-semibold': !notif.read }">{{ notif.message }}</p>
          <span class="text-muted" style="font-size: 0.75rem">{{ timeAgo(notif.createdAt) }}</span>
        </div>
        <span v-if="!notif.read" class="unread-dot" />
      </NuxtLinkLocale>
    </div>

    <UiEmptyState v-else icon="bi bi-bell" :title="$t('notifications.empty')" :description="$t('notifications.emptyDesc')" />
  </div>
</template>

<script setup>
const notificationsStore = useNotificationsStore()
const { timeAgo } = useFormatters()

const unreadCount = computed(() => notificationsStore.unreadCount)

const icons = {
  like: 'bi bi-heart-fill',
  follow: 'bi bi-person-plus-fill',
  bid: 'bi bi-hammer',
  comment: 'bi bi-chat-fill',
  sale: 'bi bi-bag-check-fill',
}

function iconFor(type) {
  return icons[type] || 'bi bi-bell-fill'
}

function markRead(id) {
  notificationsStore.markRead(id)
}

function markAllRead() {
  notificationsStore.markAllRead()
}

onMounted(() => notificationsStore.fetchNotifications())
</script>

<style scoped lang="scss">
.notification-item {
  color: var(--es-text);
  transition: all $transition;
  &.unread { border-left: 3px solid var(--es-primary); }
  &:hover { background: var(--es-surface-2); }
}

.notif-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.like { background: rgba(239, 68, 68, 0.1); color: $danger; }
  &.follow { background: rgba(99, 102, 241, 0.1); color: var(--es-primary); }
  &.bid { background: rgba(245, 158, 11, 0.1); color: $warning; }
  &.comment { background: rgba(6, 182, 212, 0.1); color: $accent; }
  &.sale { background: rgba(16, 185, 129, 0.1); color: $success; }
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--es-primary);
  flex-shrink: 0;
  margin-top: 6px;
}
</style>
