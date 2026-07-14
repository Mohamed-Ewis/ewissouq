<template>
  <article class="feed-card animate-fade-in">
    <NuxtLinkLocale :to="detailLink" class="feed-card__link">
      <div class="feed-card__media">
        <img :src="mediaSrc" :alt="displayTitle" />
        <span class="feed-card__type" :class="`feed-card__type--${listingType}`">
          {{ typeLabel }}
        </span>
        <span v-if="listingType === 'offer' && product.discountPercent" class="feed-card__discount">
          -{{ product.discountPercent }}%
        </span>
      </div>

      <div class="feed-card__body">
        <h3 class="feed-card__title">{{ displayTitle }}</h3>
        <div class="feed-card__meta">
          <span class="feed-card__seller text-truncate">
            <img v-if="sellerAvatar" :src="sellerAvatar" alt="" />
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
})

const productsStore = useProductsStore()
const { t, te } = useI18n()
const { formatPrice } = useFormatters()
const { translateBusiness } = useBusinessName()
const { requireAuth } = useRequireAuth()
const liked = ref(false)
const saved = ref(false)

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
  position: relative;
  border: 1px solid var(--es-border);
  border-radius: 14px;
  overflow: hidden;
  background: var(--es-surface);
  height: 100%;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);

    .feed-card__actions {
      opacity: 1;
    }
  }
}

.feed-card__link {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: inherit;
  text-decoration: none;
}

.feed-card__media {
  position: relative;
  aspect-ratio: 16 / 11;
  background: var(--es-surface-2);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.feed-card__type {
  position: absolute;
  top: 0.65rem;
  inset-inline-start: 0.65rem;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  color: #fff;
  background: #64748b;

  &--auction { background: #f59e0b; }
  &--offer { background: #ef4444; }
  &--classified { background: #6366f1; }
}

.feed-card__discount {
  position: absolute;
  top: 0.65rem;
  inset-inline-end: 0.65rem;
  background: #ef4444;
  color: #fff;
  font-weight: 800;
  font-size: 0.75rem;
  padding: 0.2rem 0.45rem;
  border-radius: 6px;
}

.feed-card__body {
  padding: 0.85rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  flex: 1;
}

.feed-card__title {
  font-size: 0.95rem;
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
  gap: 0.4rem;
  min-width: 0;
  font-size: 0.78rem;
  color: var(--es-text-muted);

  img {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }
}

.feed-card__price {
  font-weight: 800;
  color: var(--es-primary);
  font-size: 0.95rem;
  white-space: nowrap;
}

.feed-card__actions {
  position: absolute;
  top: 0.55rem;
  inset-inline-end: 0.55rem;
  display: flex;
  gap: 0.35rem;
  opacity: 0;
  transition: opacity 0.2s ease;

  @media (hover: none) {
    opacity: 1;
  }
}

.feed-action {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: #334155;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &.active {
    color: #ef4444;
  }
}
</style>
