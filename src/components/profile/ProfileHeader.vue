<template>
  <div class="profile-header">
    <div class="cover-photo">
      <img :src="user.cover" :alt="t('profile.coverAlt', { name: user.name })" />
      <div class="cover-overlay" />
    </div>

    <div class="profile-body">
      <div class="profile-top">
        <div class="avatar-wrap">
          <img :src="user.avatar" class="profile-avatar" :alt="user.name" />
        </div>

        <div class="profile-actions">
          <button
            v-if="!isOwnProfile"
            class="btn btn-sm"
            :class="isFollowing ? 'btn-outline-primary' : 'btn-primary'"
            @click="$emit('follow')"
          >
            <i :class="isFollowing ? 'bi bi-person-check' : 'bi bi-person-plus'" class="me-1" />
            {{ isFollowing ? $t('profile.following') : $t('profile.follow') }}
          </button>
          <button v-if="!isOwnProfile" class="btn btn-outline-primary btn-sm btn-icon" :aria-label="$t('profile.message')">
            <i class="bi bi-chat-dots" />
          </button>
          <NuxtLinkLocale v-if="isOwnProfile" to="/create-listing" class="btn btn-primary btn-sm">
            <i class="bi bi-plus-lg me-1" /> {{ $t('profile.newListing') }}
          </NuxtLinkLocale>
        </div>
      </div>

      <div class="profile-details">
        <div class="d-flex align-items-center flex-wrap gap-2 mb-2">
          <h4 class="profile-name fw-bold mb-0">{{ user.name }}</h4>
          <VerificationBadge :verified="user.verified" show-label />
          <span v-if="user.accountType === 'business'" class="badge bg-primary-subtle text-primary">
            <i class="bi bi-shop me-1" />{{ $t('businesses.businessAccount') }}
          </span>
        </div>

        <NuxtLinkLocale
          v-if="user.business"
          :to="`/stores/${user.business.slug}`"
          class="btn btn-sm btn-outline-primary mb-3"
        >
          <i class="bi bi-building me-1" />{{ $t('businesses.viewStore') }}
        </NuxtLinkLocale>

        <p v-if="user.bio" class="profile-bio text-muted mb-3">{{ user.bio }}</p>

        <div class="profile-meta d-flex flex-wrap align-items-center gap-3">
          <span v-if="user.location?.city" class="meta-item">
            <i class="bi bi-geo-alt" />
            {{ user.location.city }}{{ countryLabel ? `, ${countryLabel}` : '' }}
          </span>
          <span v-if="user.joinedAt" class="meta-item">
            <i class="bi bi-calendar3" />
            {{ $t('profile.joined', { date: formattedJoinDate }) }}
          </span>
          <RatingStars :rating="user.rating" />
        </div>
      </div>

      <div class="stats-bar">
        <div class="stat-item">
          <strong>{{ formatCount(user.followers) }}</strong>
          <span>{{ $t('profile.followers') }}</span>
        </div>
        <div class="stat-item">
          <strong>{{ formatCount(user.following) }}</strong>
          <span>{{ $t('profile.followingCount') }}</span>
        </div>
        <div class="stat-item">
          <strong>{{ formatCount(publishedCount) }}</strong>
          <span>{{ $t('profile.listings') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  user: { type: Object, required: true },
  isOwnProfile: { type: Boolean, default: false },
  isFollowing: { type: Boolean, default: false },
  publishedCount: { type: Number, default: 0 },
})

defineEmits(['follow'])

const { t } = useI18n()
const { countries } = useLocalizedOptions()

const countryLabel = computed(() => {
  const code = props.user.location?.country
  return countries.value.find((c) => c.value === code)?.label || code?.toUpperCase()
})

const formattedJoinDate = computed(() => {
  if (!props.user.joinedAt) return ''
  const date = new Date(props.user.joinedAt)
  if (Number.isNaN(date.getTime())) return props.user.joinedAt
  return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
})

function formatCount(value) {
  const n = Number(value) || 0
  return n.toLocaleString()
}
</script>

<style scoped lang="scss">
.profile-header {
  @include card-base;
  overflow: visible;
  margin-bottom: 1.5rem;
}

.cover-photo {
  position: relative;
  height: 180px;
  overflow: hidden;
  border-radius: $border-radius-lg $border-radius-lg 0 0;
  background: var(--es-gradient);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.25));
}

.profile-body {
  position: relative;
  background: var(--es-surface);
  border-radius: 0 0 $border-radius-lg $border-radius-lg;
  padding: 0 1.5rem 1.25rem;
}

.profile-top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-top: -52px;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
}

.avatar-wrap {
  flex-shrink: 0;
  padding-bottom: 2px;
}

.profile-avatar {
  width: 104px;
  height: 104px;
  border-radius: 50%;
  border: 4px solid var(--es-surface);
  object-fit: cover;
  box-shadow: $shadow-md;
  display: block;
  background: var(--es-surface);
}

.profile-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.25rem;
}

.btn-icon {
  width: 36px;
  height: 36px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: $border-radius;
}

.profile-details {
  padding-top: 0.25rem;
}

.profile-name {
  color: var(--es-text);
  font-size: 1.5rem;
  line-height: 1.2;
}

.profile-bio {
  font-size: 0.95rem;
  line-height: 1.5;
  max-width: 640px;
  margin-bottom: 0.75rem !important;
}

.profile-meta {
  font-size: 0.85rem;
  color: var(--es-text-muted);
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;

  i {
    color: var(--es-primary);
    font-size: 0.9rem;
  }
}

.stats-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--es-border);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  padding: 0.5rem 0.75rem;
  text-align: center;

  &:not(:last-child) {
    border-right: 1px solid var(--es-border);
  }

  strong {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--es-text);
    line-height: 1.2;
  }

  span {
    font-size: 0.75rem;
    color: var(--es-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
}

@media (max-width: 575.98px) {
  .profile-body {
    padding: 0 1rem 1rem;
  }

  .profile-top {
    flex-direction: column;
    align-items: flex-start;
    margin-top: -48px;
  }

  .profile-actions {
    width: 100%;
    padding-bottom: 0;
  }

  .profile-avatar {
    width: 88px;
    height: 88px;
  }

  .profile-name {
    font-size: 1.25rem;
  }
}
</style>
