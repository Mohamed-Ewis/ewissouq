<template>
  <div class="dropdown">
    <button
      type="button"
      class="btn nav-icon-btn position-relative"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      :aria-label="$t('notifications.ariaLabel')"
    >
      <i class="bi bi-bell" />
      <span v-if="unreadCount" class="badge-dot" />
    </button>

    <div class="dropdown-menu dropdown-menu-end notification-dropdown shadow">
      <div class="notification-dropdown__header">
        <span class="fw-bold">{{ $t('notifications.title') }}</span>
        <button
          v-if="unreadCount"
          type="button"
          class="btn btn-link btn-sm p-0 text-primary"
          @click.stop="markAllRead"
        >
          {{ $t('notifications.markAllRead') }}
        </button>
      </div>

      <div v-if="notificationsStore.loading" class="notification-dropdown__body text-center py-3">
        <div class="spinner-border spinner-border-sm text-primary" role="status" />
      </div>

      <div v-else-if="!recentItems.length" class="notification-dropdown__body text-center py-4 text-muted small">
        <i class="bi bi-bell-slash d-block fs-4 mb-2 opacity-50" />
        {{ $t('notifications.emptyDropdown') }}
      </div>

      <div v-else class="notification-dropdown__body">
        <NuxtLinkLocale
          v-for="notif in recentItems"
          :key="notif.id"
          :to="notif.link"
          class="notification-dropdown__item"
          :class="{ unread: !notif.read }"
          @click="markRead(notif.id)"
        >
          <span class="notif-icon" :class="notif.type">
            <i :class="iconFor(notif.type)" />
          </span>
          <span class="notif-content">
            <span class="notif-message" :class="{ 'fw-semibold': !notif.read }">{{ notif.message }}</span>
            <span class="notif-time">{{ timeAgo(notif.createdAt) }}</span>
          </span>
          <span v-if="!notif.read" class="unread-dot" />
        </NuxtLinkLocale>
      </div>

      <div class="notification-dropdown__footer">
        <NuxtLinkLocale to="/notifications" class="show-all-link">
          {{ $t('notifications.showAll') }}
          <i class="bi bi-arrow-right" />
        </NuxtLinkLocale>
      </div>
    </div>
  </div>
</template>

<script setup>
const notificationsStore = useNotificationsStore()
const { timeAgo } = useFormatters()

const unreadCount = computed(() => notificationsStore.unreadCount)
const recentItems = computed(() => notificationsStore.items.slice(0, 5))

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

onMounted(() => {
  if (!notificationsStore.items.length) {
    notificationsStore.fetchNotifications()
  }
})
</script>

<style scoped lang="scss">
.nav-icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--es-surface-2);
  border: 1px solid var(--es-border);
  color: var(--es-text);
}

.badge-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  background: $danger;
  border-radius: 50%;
  border: 2px solid var(--es-surface);
}

.notification-dropdown {
  width: min(360px, calc(100vw - 2rem));
  padding: 0;
  border: 1px solid var(--es-border);
  border-radius: $border-radius-lg;
  overflow: hidden;
}

.notification-dropdown__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--es-border);
  background: var(--es-surface);
}

.notification-dropdown__body {
  max-height: 320px;
  overflow-y: auto;
}

.notification-dropdown__item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: var(--es-text);
  border-bottom: 1px solid var(--es-border);
  transition: background $transition;

  &:hover {
    background: var(--es-surface-2);
  }

  &.unread {
    background: rgba(99, 102, 241, 0.04);
  }

  &:last-child {
    border-bottom: none;
  }
}

.notif-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.85rem;

  &.like { background: rgba(239, 68, 68, 0.1); color: $danger; }
  &.follow { background: rgba(99, 102, 241, 0.1); color: var(--es-primary); }
  &.bid { background: rgba(245, 158, 11, 0.1); color: $warning; }
  &.comment { background: rgba(6, 182, 212, 0.1); color: $accent; }
  &.sale { background: rgba(16, 185, 129, 0.1); color: $success; }
}

.notif-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.notif-message {
  font-size: 0.8rem;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notif-time {
  font-size: 0.7rem;
  color: var(--es-text-muted);
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--es-primary);
  flex-shrink: 0;
  margin-top: 6px;
}

.notification-dropdown__footer {
  border-top: 1px solid var(--es-border);
  background: var(--es-surface);
}

.show-all-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.85rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--es-primary);
  text-decoration: none;
  transition: background $transition;

  &:hover {
    background: var(--es-surface-2);
    color: var(--es-primary-dark);
  }
}
</style>
