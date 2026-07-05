<template>
  <article class="bento-card animate-fade-in" :class="[`bento-card--${variant}`, spanClass]">
    <NuxtLinkLocale :to="`/marketplace/${product.id}`" class="bento-card__link">
      <div class="bento-card__media">
        <video
          v-if="product.video"
          :src="product.video"
          muted
          loop
          playsinline
        />
        <img v-else :src="product.images[0]" :alt="product.title" />
      </div>

      <div v-if="product.video" class="bento-card__play">
        <i class="bi bi-play-fill" />
      </div>

      <div class="bento-card__overlay">
        <div v-if="isBusinessListing" class="bento-card__store-row">
          <BusinessBadge :tier="businessTier" />
          <NuxtLinkLocale
            :to="storeLink"
            class="bento-card__store-link"
            @click.stop
          >
            <i class="bi bi-shop" /> {{ sellerLabel }}
          </NuxtLinkLocale>
        </div>
        <span v-else-if="variant !== 'compact'" class="bento-card__badge">
          {{ translateCategory(product.category) }}
        </span>

        <h3 class="bento-card__title">{{ product.title }}</h3>

        <div class="bento-card__footer">
          <div class="bento-card__seller">
            <img :src="product.seller.avatar" :alt="sellerLabel" />
            <div class="bento-card__seller-info">
              <NuxtLinkLocale
                v-if="isBusinessListing"
                :to="storeLink"
                class="bento-card__seller-name bento-card__seller-name--link"
                @click.stop
              >
                {{ sellerLabel }}
                <VerificationBadge :verified="product.seller.verified" />
              </NuxtLinkLocale>
              <span v-else class="bento-card__seller-name">
                {{ sellerLabel }}
                <VerificationBadge :verified="product.seller.verified" />
              </span>
              <span v-if="variant !== 'compact'" class="bento-card__meta">
                {{ locationLabel }} · {{ timeAgo(product.createdAt) }}
              </span>
            </div>
          </div>
          <span class="bento-card__price">{{ formatPrice(product.price) }}</span>
        </div>
      </div>
    </NuxtLinkLocale>

    <div class="bento-card__actions">
      <button
        type="button"
        class="bento-action"
        :class="{ active: liked }"
        :aria-label="'Like'"
        @click="toggleLike"
      >
        <i :class="liked ? 'bi bi-heart-fill' : 'bi bi-heart'" />
        <span v-if="variant !== 'compact'">{{ product.likes }}</span>
      </button>
      <button
        type="button"
        class="bento-action"
        :class="{ active: saved }"
        aria-label="Save"
        @click="toggleSave"
      >
        <i :class="saved ? 'bi bi-bookmark-fill' : 'bi bi-bookmark'" />
      </button>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  product: { type: Object, required: true },
  variant: {
    type: String,
    default: 'standard',
    validator: (v) => ['hero', 'wide', 'tall', 'standard', 'compact'].includes(v),
  },
  spanClass: { type: String, default: '' },
})

const productsStore = useProductsStore()
const { formatPrice, timeAgo } = useFormatters()
const { translateCategory } = useCategoryName()
const { translateBusiness } = useBusinessName()
const liked = ref(false)
const saved = ref(false)

const locationLabel = computed(() => props.product.location?.city || '')

const isBusinessListing = computed(
  () => props.product.sellerType === 'business' || props.product.seller?.isBusiness,
)

const storeLink = computed(() => {
  const slug = props.product.seller?.businessSlug || props.product.business?.slug
  return slug ? `/stores/${slug}` : `/profile/${props.product.sellerId}`
})

const sellerLabel = computed(() => {
  if (isBusinessListing.value) {
    return translateBusiness(props.product.seller?.nameKey || props.product.business)
  }
  return props.product.seller?.name || ''
})

const businessTier = computed(() => {
  const p = props.product
  return p.seller?.businessTier || (p.business && p.business.tier) || 'verified'
})

async function toggleLike(e) {
  e?.preventDefault?.()
  e?.stopPropagation?.()
  await productsStore.toggleLike(props.product.id)
  liked.value = !liked.value
}

async function toggleSave(e) {
  e?.preventDefault?.()
  e?.stopPropagation?.()
  await productsStore.toggleSave(props.product.id)
  saved.value = !saved.value
}
</script>

<style scoped lang="scss">
.bento-card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  min-height: 200px;
  height: 100%;
  background: var(--es-surface-2);
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.14);

    .bento-card__media img,
    .bento-card__media video {
      transform: scale(1.05);
    }
  }
}

.bento-card__link {
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  min-height: inherit;
  text-decoration: none;
  color: inherit;
}

.bento-card__media {
  position: absolute;
  inset: 0;

  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
}

.bento-card__play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  color: var(--es-primary);
  pointer-events: none;
  z-index: 2;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.bento-card__overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1rem;
  background: linear-gradient(
    180deg,
    transparent 30%,
    rgba(15, 23, 42, 0.45) 65%,
    rgba(15, 23, 42, 0.88) 100%
  );
  color: #fff;
}

.bento-card__store-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.bento-card__store-link {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  text-decoration: none;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(6px);

  &:hover {
    background: rgba(255, 255, 255, 0.28);
    color: #fff;
  }
}

.bento-card__seller-name--link {
  text-decoration: none;
  color: inherit;

  &:hover {
    text-decoration: underline;
  }
}

.bento-card__badge {
  align-self: flex-start;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  margin-bottom: 0.5rem;
}

.bento-card__title {
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.35;
  margin: 0 0 0.65rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.bento-card__footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem;
}

.bento-card__seller {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  flex: 1;

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255, 255, 255, 0.5);
    flex-shrink: 0;
  }
}

.bento-card__seller-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.bento-card__seller-name {
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.bento-card__meta {
  font-size: 0.7rem;
  opacity: 0.85;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bento-card__price {
  font-size: 1rem;
  font-weight: 800;
  white-space: nowrap;
  color: #c7d2fe;
  flex-shrink: 0;
}

.bento-card__actions {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 3;
  display: flex;
  gap: 0.35rem;
}

html[dir='rtl'] .bento-card__actions {
  right: auto;
  left: 0.75rem;
}

.bento-action {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.55rem;
  border: none;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  color: var(--es-text);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);

  &:hover,
  &.active {
    background: var(--es-primary);
    color: #fff;
  }
}

// ── Variant sizing (min-heights when not in grid span) ──
.bento-card--hero {
  min-height: 280px;

  .bento-card__title {
    font-size: 1.2rem;
    -webkit-line-clamp: 3;
  }

  .bento-card__price {
    font-size: 1.25rem;
  }
}

.bento-card--wide {
  min-height: 200px;
}

.bento-card--tall {
  min-height: 320px;
}

.bento-card--standard {
  min-height: 240px;
}

.bento-card--compact {
  min-height: 180px;

  .bento-card__overlay {
    padding: 0.75rem;
  }

  .bento-card__title {
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
    -webkit-line-clamp: 1;
  }

  .bento-card__seller img {
    width: 26px;
    height: 26px;
  }

  .bento-card__price {
    font-size: 0.9rem;
  }

  .bento-card__actions {
    top: 0.5rem;
    right: 0.5rem;
  }
}
</style>
