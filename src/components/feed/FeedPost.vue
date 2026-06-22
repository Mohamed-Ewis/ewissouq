<template>
  <article class="feed-post card animate-fade-in" :class="`feed-post--${variant}`">
    <div class="feed-post__inner" :class="{ 'feed-post__inner--wide': variant === 'wide' }">
      <div class="feed-post__header card-header bg-transparent border-0 d-flex align-items-center gap-3 pt-3 px-3">
        <NuxtLinkLocale :to="`/profile/${product.seller.id}`">
          <img :src="product.seller.avatar" class="post-avatar" :alt="product.seller.name" />
        </NuxtLinkLocale>
        <div class="flex-grow-1 min-w-0">
          <div class="d-flex align-items-center gap-1">
            <NuxtLinkLocale :to="`/profile/${product.seller.id}`" class="fw-semibold text-decoration-none post-author text-truncate">
              {{ product.seller.name }}
            </NuxtLinkLocale>
            <VerificationBadge :verified="product.seller.verified" />
          </div>
          <div v-if="variant !== 'compact'" class="text-muted small text-truncate">
            <i class="bi bi-geo-alt" /> {{ product.location?.city }} · {{ timeAgo(product.createdAt) }}
          </div>
        </div>
        <span v-if="variant !== 'compact'" class="badge bg-light text-dark flex-shrink-0">{{ product.category }}</span>
      </div>

      <NuxtLinkLocale :to="`/marketplace/${product.id}`" class="feed-post__media text-decoration-none">
        <div v-if="product.video" class="video-container">
          <video :src="product.video" muted loop playsinline class="w-100" />
          <div class="play-overlay"><i class="bi bi-play-circle-fill" /></div>
        </div>
        <div v-else class="post-image">
          <img :src="product.images[0]" :alt="product.title" />
        </div>
      </NuxtLinkLocale>

      <div class="card-body px-3 pb-3 feed-post__body">
        <NuxtLinkLocale :to="`/marketplace/${product.id}`" class="text-decoration-none">
          <h6 class="fw-semibold mb-1 post-title">{{ product.title }}</h6>
          <p class="price-tag mb-2">{{ formatPrice(product.price) }}</p>
        </NuxtLinkLocale>

        <div class="d-flex align-items-center justify-content-between">
          <div class="action-bar d-flex gap-1">
            <button class="action-btn" :class="{ active: liked }" @click="toggleLike">
              <i :class="liked ? 'bi bi-heart-fill' : 'bi bi-heart'" />
              <span>{{ product.likes }}</span>
            </button>
            <button class="action-btn" @click="showComments = !showComments">
              <i class="bi bi-chat" />
              <span v-if="variant !== 'compact'">{{ product.commentsCount }}</span>
            </button>
            <button v-if="variant !== 'compact'" class="action-btn" @click="share">
              <i class="bi bi-share" />
            </button>
            <button class="action-btn" :class="{ active: saved }" @click="toggleSave">
              <i :class="saved ? 'bi bi-bookmark-fill' : 'bi bi-bookmark'" />
            </button>
          </div>
          <span v-if="variant !== 'compact'" class="text-muted small"><i class="bi bi-eye" /> {{ product.views }}</span>
        </div>

        <div v-if="showComments && variant !== 'compact'" class="comments-section mt-3 pt-3 border-top">
          <CommentList :product-id="product.id" />
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  product: { type: Object, required: true },
  variant: {
    type: String,
    default: 'standard',
    validator: (v) => ['standard', 'wide', 'tall', 'compact'].includes(v),
  },
})

const productsStore = useProductsStore()
const { formatPrice, timeAgo } = useFormatters()
const liked = ref(false)
const saved = ref(false)
const showComments = ref(false)

async function toggleLike() {
  await productsStore.toggleLike(props.product.id)
  liked.value = !liked.value
}

async function toggleSave() {
  await productsStore.toggleSave(props.product.id)
  saved.value = !saved.value
}

function share() {
  if (navigator.share) {
    navigator.share({ title: props.product.title, url: window.location.origin + `/marketplace/${props.product.id}` })
  }
}
</script>

<style scoped lang="scss">
.feed-post {
  overflow: hidden;
  margin-bottom: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.feed-post__inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.feed-post__inner--wide {
  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;

    .feed-post__header {
      width: 100%;
      order: 1;
    }

    .feed-post__media {
      width: 52%;
      order: 2;
      flex: 1 1 auto;
      min-height: 200px;
    }

    .feed-post__body {
      width: 48%;
      order: 3;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
}

.feed-post__media {
  display: block;
  flex-shrink: 0;
}

.feed-post__body {
  flex: 1;
}

// Shuffle grid placement (md+)
@media (min-width: 768px) {
  .feed-post--wide {
    grid-column: 1 / -1;
  }

  .feed-post--tall {
    grid-row: span 2;
  }
}

// Variant: wide — cinematic banner
.feed-post--wide {
  .post-image,
  .video-container {
    aspect-ratio: 21 / 9;
    min-height: 180px;
  }

  @media (min-width: 768px) {
    .post-image,
    .video-container {
      aspect-ratio: auto;
      height: 100%;
      min-height: 220px;
    }
  }
}

// Variant: tall — portrait emphasis
.feed-post--tall {
  .post-image,
  .video-container {
    aspect-ratio: 3 / 4;
    flex: 1;
    min-height: 240px;
  }

  .feed-post__inner {
    height: 100%;
  }
}

// Variant: compact — smaller tile
.feed-post--compact {
  .post-avatar {
    width: 32px;
    height: 32px;
  }

  .feed-post__header {
    padding-top: 0.65rem !important;
    padding-bottom: 0 !important;
  }

  .post-image,
  .video-container {
    aspect-ratio: 4 / 3;
  }

  .post-title {
    font-size: 0.9rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .price-tag {
    font-size: 1rem;
    margin-bottom: 0.5rem !important;
  }

  .action-btn {
    padding: 0.3rem 0.55rem;
    font-size: 0.8rem;
  }
}

.post-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.post-author { color: var(--es-text); }

.post-image,
.video-container {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--es-surface-2);

  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.video-container { position: relative; }

.play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: rgba(255, 255, 255, 0.8);
  pointer-events: none;
}

.post-title { color: var(--es-text); }

.price-tag {
  color: var(--es-primary);
  font-weight: 700;
  font-size: 1.15rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem;
  border: none;
  background: var(--es-surface-2);
  border-radius: 20px;
  color: var(--es-text-muted);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all $transition;

  &:hover,
  &.active {
    background: rgba(99, 102, 241, 0.1);
    color: var(--es-primary);
  }
}
</style>
