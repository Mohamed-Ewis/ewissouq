<template>
  <div v-if="pending" class="py-5">
    <UiSkeletonLoader height="400px" />
  </div>

  <UiErrorState
    v-else-if="error"
    :message="error?.message || $t('product.loadFailed')"
    @retry="refresh"
  />

  <div v-else-if="product" class="product-detail-page">
    <Breadcrumb :items="breadcrumbItems" />

    <div class="row g-4">
      <div class="col-lg-7">
        <div class="gallery card overflow-hidden">
          <div v-if="product.video && showVideo" class="ratio ratio-16x9">
            <video :src="product.video" controls class="w-100" />
          </div>
          <div v-else id="productCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
              <div
                v-for="(img, i) in product.images"
                :key="i"
                class="carousel-item"
                :class="{ active: i === 0 }"
              >
                <img :src="img" class="d-block w-100 gallery-img" :alt="product.title" />
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" />
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
              <span class="carousel-control-next-icon" />
            </button>
          </div>
          <div v-if="product.video" class="p-2 border-top">
            <button class="btn btn-sm btn-outline-primary" @click="showVideo = !showVideo">
              <i :class="showVideo ? 'bi bi-images' : 'bi bi-play-fill'" class="me-1" />
              {{ showVideo ? $t('product.viewPhotos') : $t('product.watchVideo') }}
            </button>
          </div>
        </div>
      </div>

      <div class="col-lg-5">
        <div class="card p-4">
          <div class="d-flex gap-2 mb-2">
            <span class="badge" :class="conditionClass">{{ translateCondition(product.condition) }}</span>
            <span class="badge bg-light text-dark">{{ product.category }}</span>
          </div>
          <h3 class="fw-bold mb-2">{{ product.title }}</h3>
          <p class="price display-6 fw-bold text-primary mb-3">{{ formatPrice(product.price) }}</p>

          <div class="d-flex gap-3 mb-3 text-muted small">
            <span><i class="bi bi-eye" /> {{ $t('product.views', { count: product.views }) }}</span>
            <span><i class="bi bi-heart" /> {{ $t('product.likes', { count: product.likes }) }}</span>
            <span><i class="bi bi-chat" /> {{ $t('product.commentsCount', { count: product.commentsCount }) }}</span>
          </div>

          <div class="location mb-4 p-3 rounded" style="background: var(--es-surface-2)">
            <i class="bi bi-geo-alt text-primary" />
            {{ product.location?.area }}, {{ product.location?.city }}
          </div>

          <div class="d-flex gap-2 mb-4">
            <button class="btn btn-primary flex-grow-1">
              <i class="bi bi-chat-dots me-1" /> {{ $t('product.contactSeller') }}
            </button>
            <button class="btn btn-outline-primary" :class="{ active: liked }" @click="toggleLike">
              <i :class="liked ? 'bi bi-heart-fill' : 'bi bi-heart'" />
            </button>
            <button class="btn btn-outline-primary" :class="{ active: saved }" @click="toggleSave">
              <i :class="saved ? 'bi bi-bookmark-fill' : 'bi bi-bookmark'" />
            </button>
            <button class="btn btn-outline-primary" @click="share">
              <i class="bi bi-share" />
            </button>
          </div>

          <div v-if="product.seller" class="seller-card p-3 rounded" style="background: var(--es-surface-2)">
            <NuxtLinkLocale :to="`/profile/${product.seller.id}`" class="text-decoration-none d-flex align-items-center gap-3">
              <img :src="product.seller.avatar" class="seller-avatar" :alt="product.seller.name" />
              <div>
                <div class="d-flex align-items-center gap-1">
                  <span class="fw-semibold">{{ product.seller.name }}</span>
                  <VerificationBadge :verified="product.seller.verified" />
                </div>
                <RatingStars :rating="product.seller.rating" />
              </div>
            </NuxtLinkLocale>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-lg-8">
        <div class="card p-4 mb-4">
          <h5 class="fw-bold mb-3">{{ $t('product.description') }}</h5>
          <p class="text-muted mb-0">{{ product.description }}</p>
        </div>
        <div class="card p-4">
          <h5 class="fw-bold mb-3">{{ $t('product.comments') }}</h5>
          <CommentList :product-id="Number(product.id)" />
        </div>
      </div>
    </div>
  </div>

  <UiEmptyState
    v-else
    icon="bi bi-shop"
    :title="$t('product.notFound')"
    :description="$t('product.notFoundDesc')"
  >
    <template #action>
      <NuxtLinkLocale to="/marketplace" class="btn btn-primary mt-2">{{ $t('product.backToMarketplace') }}</NuxtLinkLocale>
    </template>
  </UiEmptyState>
</template>

<script setup>
import { getProduct } from '@/api/products'
import { unwrapApiData } from '@/utils/api'

const route = useRoute()
const { t } = useI18n()
const productsStore = useProductsStore()
const { formatPrice } = useFormatters()
const { translateCondition } = useCategoryName()
const showVideo = ref(false)
const liked = ref(false)
const saved = ref(false)

const productId = computed(() => route.params.id)

const { data: product, pending, error, refresh } = await useAsyncData(
  () => `product-${productId.value}`,
  async () => {
    const res = await getProduct(productId.value)
    const item = unwrapApiData(res)
    if (!item) throw new Error(t('product.notFound'))
    return item
  },
  { watch: [productId] },
)

watch(product, (item) => {
  if (!item) return
  productsStore.currentProduct = item
  liked.value = item.isLiked || false
  saved.value = item.isSaved || false
}, { immediate: true })

const conditionClass = computed(() => ({
  new: 'bg-success',
  used: 'bg-warning text-dark',
  refurbished: 'bg-info text-dark',
}[product.value?.condition] || 'bg-secondary'))

const breadcrumbItems = computed(() => [
  { to: '/', label: t('nav.home'), icon: 'bi bi-house' },
  { to: '/marketplace', label: t('nav.marketplace') },
  { label: product.value?.title || '' },
])

async function toggleLike() {
  if (!product.value) return
  await productsStore.toggleLike(product.value.id)
  liked.value = !liked.value
}

async function toggleSave() {
  if (!product.value) return
  await productsStore.toggleSave(product.value.id)
  saved.value = !saved.value
}

function share() {
  if (!product.value || !navigator.share) return
  navigator.share({ title: product.value.title, url: window.location.href })
}
</script>

<style scoped lang="scss">
.gallery-img { max-height: 480px; object-fit: cover; }
.seller-avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
</style>
