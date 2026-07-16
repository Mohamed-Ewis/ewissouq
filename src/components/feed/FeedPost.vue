<template>
  <article
    ref="cardRef"
    class="feed-card"
    :class="[
      `feed-card--${listingType}`,
      { 'feed-card--inview': inView, 'feed-card--beckon': canBeckon },
    ]"
    :style="cardStyle"
  >
    <NuxtLinkLocale :to="detailLink" class="feed-card__link">
      <div class="feed-card__media">
        <img class="feed-card__photo" :src="mediaSrc" :alt="displayTitle" />
        <div class="feed-card__media-shade" />

        <span class="feed-card__type" :class="`feed-card__type--${listingType}`">
          <span v-if="listingType === 'auction'" class="feed-card__live-dot" />
          {{ typeLabel }}
        </span>

        <span v-if="listingType === 'offer' && product.discountPercent" class="feed-card__discount">
          -{{ product.discountPercent }}%
        </span>

        <FeedSouqi
          v-if="canBeckon"
          :avatar="sellerAvatar"
          :label="beckonText"
          :variant="listingType"
          :active="inView"
          :duration="beckonDuration"
          :delay="beckonDelay"
        />
        <div class="feed-card__shine" />
      </div>

      <div class="feed-card__body">
        <h3 class="feed-card__title">{{ displayTitle }}</h3>
        <div class="feed-card__meta">
          <span class="feed-card__seller text-truncate">
            <span class="feed-card__avatar-wrap">
              <img v-if="sellerAvatar" :src="sellerAvatar" alt="" />
            </span>
            {{ sellerLabel }}
          </span>
          <span class="feed-card__price">{{ priceLabel }}</span>
        </div>
      </div>
    </NuxtLinkLocale>

    <div v-if="listingType === 'classified'" class="feed-card__actions">
      <button type="button" class="feed-action" :class="{ active: liked }" @click="toggleLike">
        <i :class="liked ? 'bi bi-heart-fill' : 'bi bi-heart'" />
      </button>
      <button type="button" class="feed-action" :class="{ active: saved }" @click="toggleSave">
        <i :class="saved ? 'bi bi-bookmark-fill' : 'bi bi-bookmark'" />
      </button>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  product: { type: Object, required: true },
  index: { type: Number, default: 0 },
})

const productsStore = useProductsStore()
const { t, te } = useI18n()
const { formatPrice } = useFormatters()
const { translateBusiness } = useBusinessName()
const { requireAuth } = useRequireAuth()
const liked = ref(false)
const saved = ref(false)
const cardRef = ref(null)
const inView = ref(false)

const listingType = computed(() => props.product.listingType || 'classified')

const detailLink = computed(() => {
  if (props.product.href) return props.product.href
  if (listingType.value === 'auction') return `/auctions/${props.product.id}`
  if (listingType.value === 'offer') return `/offers/${props.product.id}`
  return `/marketplace/${props.product.id}`
})

const mediaSrc = computed(() => {
  if (props.product.image) return props.product.image
  return props.product.images?.[0] || ''
})

const displayTitle = computed(() => {
  const key = props.product.titleKey
  if (key && te(key)) return t(key)
  return props.product.title || ''
})

const typeLabel = computed(() => {
  const map = {
    classified: 'home.chips.classified',
    auction: 'home.chips.auction',
    offer: 'home.chips.offer',
  }
  return t(map[listingType.value] || map.classified)
})

const sellerLabel = computed(() => {
  if (listingType.value === 'offer' || props.product.sellerType === 'business') {
    return translateBusiness(props.product.seller?.nameKey || props.product.business || props.product.seller)
  }
  return props.product.seller?.name || ''
})

const sellerAvatar = computed(() => props.product.seller?.avatar || props.product.business?.logo || '')
const canBeckon = computed(() => !!sellerAvatar.value)

const beckonText = computed(() => {
  if (listingType.value === 'auction') return t('home.beckon.auction')
  if (listingType.value === 'offer') return t('home.beckon.offer')
  return t('home.beckon.ad')
})

const beckonDelay = computed(() => {
  const i = props.index
  const delay = ((i * 1.85) % 8) + (i % 4) * 0.65
  return `${delay.toFixed(2)}s`
})

const beckonDuration = computed(() => {
  const i = props.index
  const duration = 5.4 + (i % 4) * 0.9
  const pause = 3.8 + (i % 5) * 1.05
  return `${(duration + pause).toFixed(2)}s`
})

const cardStyle = computed(() => ({
  '--shine-delay': `${((props.index * 2.3) % 5).toFixed(2)}s`,
  '--enter-delay': `${((props.index % 6) * 0.08).toFixed(2)}s`,
}))

const priceLabel = computed(() => {
  if (listingType.value === 'auction') {
    return formatPrice(props.product.currentBid || props.product.price)
  }
  if (listingType.value === 'offer') {
    const amount = props.product.salePrice || props.product.price
    const currency = props.product.currency
    if (currency) return `${Number(amount).toLocaleString()} ${currency}`
    return formatPrice(amount)
  }
  return formatPrice(props.product.price)
})

let io

onMounted(() => {
  if (!import.meta.client || !cardRef.value) return
  io = new IntersectionObserver(
    ([entry]) => {
      inView.value = entry.isIntersecting
    },
    { threshold: 0.32 },
  )
  io.observe(cardRef.value)
})

onBeforeUnmount(() => {
  io?.disconnect()
})

async function toggleLike(e) {
  e?.preventDefault?.()
  e?.stopPropagation?.()
  if (!requireAuth()) return
  await productsStore.toggleLike(props.product.id)
  liked.value = !liked.value
}

async function toggleSave(e) {
  e?.preventDefault?.()
  e?.stopPropagation?.()
  if (!requireAuth()) return
  await productsStore.toggleSave(props.product.id)
  saved.value = !saved.value
}
</script>

<style scoped lang="scss">
.feed-card {
  --shine-delay: 0s;
  --enter-delay: 0s;

  position: relative;
  border: 1px solid var(--es-border);
  border-radius: 16px;
  overflow: visible;
  background: var(--es-surface);
  height: 100%;
  opacity: 0;
  transform: translateY(14px);
  animation: card-enter 0.55s ease forwards;
  animation-delay: var(--enter-delay);
  transition: box-shadow 0.3s ease, transform 0.3s ease;

  &--inview .feed-card__shine {
    animation-play-state: running;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 36px rgba(15, 23, 42, 0.12);

    .feed-card__photo {
      transform: scale(1.05);
    }

    .feed-card__actions {
      opacity: 1;
    }

    .feed-card__price {
      transform: scale(1.06);
    }
  }

  &--auction {
    border-color: rgba(245, 158, 11, 0.35);
  }

  &--offer {
    border-color: rgba(239, 68, 68, 0.28);
  }
}

@keyframes card-enter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feed-card__link {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: inherit;
  text-decoration: none;
  border-radius: 16px;
  overflow: hidden;
  background: var(--es-surface);
}

.feed-card__media {
  position: relative;
  aspect-ratio: 16 / 11;
  background: var(--es-surface-2);
  overflow: hidden;
}

.feed-card__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.7s ease;
}

.feed-card__media-shade {
  position: absolute;
  inset: auto 0 0;
  height: 45%;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.5), transparent);
  pointer-events: none;
}

.feed-card__shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255, 255, 255, 0.28) 50%,
    transparent 60%
  );
  transform: translateX(-120%);
  animation: shine-sweep 6.5s ease-in-out infinite;
  animation-delay: var(--shine-delay);
  animation-play-state: paused;
  pointer-events: none;
}

@keyframes shine-sweep {
  0%,
  70% {
    transform: translateX(-120%);
  }
  85% {
    transform: translateX(120%);
  }
  100% {
    transform: translateX(120%);
  }
}

.feed-card__type {
  position: absolute;
  top: 0.65rem;
  inset-inline-start: 0.65rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  color: #fff;
  background: #64748b;
  z-index: 2;
  backdrop-filter: blur(4px);

  &--auction {
    background: rgba(245, 158, 11, 0.95);
  }
  &--offer {
    background: rgba(239, 68, 68, 0.95);
  }
  &--classified {
    background: rgba(99, 102, 241, 0.95);
  }
}

.feed-card__live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #fff;
  animation: live-pulse 1.4s ease-out infinite;
}

@keyframes live-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.65);
  }
  70% {
    box-shadow: 0 0 0 8px transparent;
  }
  100% {
    box-shadow: 0 0 0 0 transparent;
  }
}

.feed-card__discount {
  position: absolute;
  top: 0.65rem;
  inset-inline-end: 0.65rem;
  background: #ef4444;
  color: #fff;
  font-weight: 800;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  z-index: 2;
}

.feed-card__body {
  padding: 0.9rem 1rem 1.05rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  flex: 1;
}

.feed-card__title {
  font-size: 0.98rem;
  font-weight: 700;
  line-height: 1.35;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.feed-card__meta {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.feed-card__seller {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-width: 0;
  font-size: 0.78rem;
  color: var(--es-text-muted);
}

.feed-card__avatar-wrap {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 1.5px solid var(--es-border);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.feed-card__price {
  font-weight: 800;
  color: var(--es-primary);
  font-size: 0.98rem;
  white-space: nowrap;
  transition: transform 0.25s ease;
}

.feed-card__actions {
  position: absolute;
  top: 0.55rem;
  inset-inline-end: 0.55rem;
  display: flex;
  gap: 0.35rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 4;

  @media (hover: none) {
    opacity: 1;
  }
}

.feed-action {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.94);
  color: #334155;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);

  &.active {
    color: #ef4444;
  }
}

@media (prefers-reduced-motion: reduce) {
  .feed-card,
  .feed-card__shine,
  .feed-card__live-dot,
  .feed-card__photo {
    animation: none !important;
    transition: none !important;
  }

  .feed-card {
    opacity: 1;
    transform: none;
  }
}
</style>
