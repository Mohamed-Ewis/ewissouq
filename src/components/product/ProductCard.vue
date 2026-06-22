<template>
  <NuxtLinkLocale :to="`/marketplace/${product.id}`" class="product-card card h-100 text-decoration-none animate-fade-in">
    <div class="card-img-wrapper position-relative">
      <img :src="product.images[0]" :alt="product.title" class="card-img-top" loading="lazy" />
      <span v-if="product.video" class="video-badge">
        <i class="bi bi-play-fill" />
      </span>
      <span class="condition-badge" :class="product.condition">{{ translateCondition(product.condition) }}</span>
      <button
        class="save-btn"
        @click.prevent="handleSave"
      >
        <i :class="isSaved ? 'bi bi-bookmark-fill' : 'bi bi-bookmark'" />
      </button>
    </div>
    <div class="card-body">
      <div class="d-flex align-items-center gap-2 mb-2">
        <img :src="product.seller.avatar" class="seller-avatar" :alt="product.seller.name" />
        <div class="flex-grow-1 min-w-0">
          <div class="d-flex align-items-center gap-1">
            <span class="small fw-medium text-truncate">{{ product.seller.name }}</span>
            <VerificationBadge :verified="product.seller.verified" />
          </div>
          <span class="text-muted" style="font-size: 0.75rem">
            <i class="bi bi-geo-alt" /> {{ product.location?.city }}
          </span>
        </div>
      </div>
      <h6 class="card-title text-truncate-2 mb-2">{{ product.title }}</h6>
      <div class="d-flex justify-content-between align-items-center">
        <span class="price fw-bold">{{ formatPrice(product.price) }}</span>
        <div class="stats d-flex gap-2 text-muted small">
          <span><i class="bi bi-eye" /> {{ formatCount(product.views) }}</span>
          <span><i class="bi bi-heart" /> {{ formatCount(product.likes) }}</span>
        </div>
      </div>
    </div>
  </NuxtLinkLocale>
</template>

<script setup>
const props = defineProps({
  product: { type: Object, required: true },
})

const productsStore = useProductsStore()
const { formatPrice } = useFormatters()
const { translateCondition } = useCategoryName()
const isSaved = ref(false)

function formatCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n
}

async function handleSave() {
  await productsStore.toggleSave(props.product.id)
  isSaved.value = !isSaved.value
}
</script>

<style scoped lang="scss">
.product-card {
  @include card-hover;
  color: var(--es-text);
  overflow: hidden;
}

.card-img-wrapper {
  overflow: hidden;
  aspect-ratio: 4/3;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img { transform: scale(1.05); }
}

.video-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.condition-badge {
  position: absolute;
  bottom: 10px;
  left: 10px;
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  text-transform: capitalize;
  font-weight: 600;
  background: var(--es-surface);
  color: var(--es-text);

  &.new { color: $success; }
  &.used { color: $warning; }
}

.save-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: var(--es-surface);
  color: var(--es-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all $transition;

  &:hover { background: var(--es-primary); color: #fff; }
}

.seller-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.price {
  color: var(--es-primary);
  font-size: 1.1rem;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
