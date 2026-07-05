<template>
  <div class="home-page">
    <div class="row g-4">
      <!-- Main feed — 9 columns -->
      <div class="col-lg-9">
        <StoriesBar v-if="stories.length" :stories="stories" />

        <BusinessShowcase v-if="featuredBusinesses.length" :businesses="featuredBusinesses" class="mb-4" />

        <div class="feed-timeline">
          <h5 class="fw-bold mb-3">
            <i class="bi bi-clock-history me-2 text-primary" />{{ $t('home.timeline') }}
          </h5>

          <template v-if="productsStore.feedLoading && !productsStore.feed.length">
            <div class="feed-shuffle-grid feed-shuffle-grid--loading">
              <UiSkeletonLoader v-for="i in 5" :key="i" type="card" :class="skeletonClass(i - 1)" />
            </div>
          </template>

          <FeedTimelineGrid v-else-if="productsStore.feed.length" :posts="productsStore.feed" />

          <div ref="loadMoreRef" class="text-center py-3">
            <div v-if="productsStore.feedLoading" class="spinner-border text-primary" role="status" />
            <p v-else-if="!productsStore.feedHasMore && productsStore.feed.length" class="text-muted small">
              {{ $t('home.endReached') }}
            </p>
          </div>

          <UiEmptyState
            v-if="!productsStore.feedLoading && !productsStore.feed.length"
            icon="bi bi-newspaper"
            :title="$t('home.noPosts')"
            :description="$t('home.noPostsDesc')"
          />
        </div>
      </div>

      <!-- Sidebar — 3 columns -->
      <div class="col-lg-3 d-none d-lg-block">
        <aside class="home-sidebar">
          <CategoryGrid :categories="categoryTree" variant="sidebar" class="mb-4" />

          <div class="sidebar-card card p-3 mb-4">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h6 class="fw-bold mb-0">
                <i class="bi bi-building text-primary" /> {{ $t('businesses.featuredTitle') }}
              </h6>
              <NuxtLinkLocale to="/stores" class="small text-primary text-decoration-none">
                {{ $t('common.viewAll') }}
              </NuxtLinkLocale>
            </div>
            <FeaturedBusinesses :businesses="featuredBusinesses" />
          </div>

          <div class="sidebar-card card p-3 mb-4">
            <h6 class="fw-bold mb-3">
              <i class="bi bi-hammer text-primary" /> {{ $t('home.liveAuctions') }}
            </h6>
            <div v-for="auction in liveAuctions.slice(0, 3)" :key="auction.id" class="mini-auction mb-2">
              <NuxtLinkLocale :to="`/auctions/${auction.id}`" class="text-decoration-none d-flex gap-2 align-items-center">
                <img :src="auction.images[0]" class="mini-img" :alt="auction.title" />
                <div class="min-w-0">
                  <div class="small fw-medium text-truncate">{{ auction.title }}</div>
                  <div class="small text-primary fw-bold">{{ formatPrice(auction.currentBid) }}</div>
                </div>
              </NuxtLinkLocale>
            </div>
          </div>

          <div class="sidebar-card card p-3 mb-4">
            <h6 class="fw-bold mb-3">
              <i class="bi bi-fire text-danger" /> {{ $t('home.trending') }}
            </h6>
            <div v-for="item in productsStore.trending.slice(0, 5)" :key="item.id" class="trending-item mb-2">
              <NuxtLinkLocale :to="`/marketplace/${item.id}`" class="text-decoration-none d-flex gap-2">
                <img :src="item.images[0]" class="trending-img" :alt="item.title" />
                <div class="min-w-0">
                  <div class="small fw-medium text-truncate">{{ item.title }}</div>
                  <div class="small text-primary">{{ formatPrice(item.price) }}</div>
                </div>
              </NuxtLinkLocale>
            </div>
          </div>

          <div class="sidebar-card card p-3">
            <h6 class="fw-bold mb-3">
              <i class="bi bi-eye text-info" /> {{ $t('home.mostViewed') }}
            </h6>
            <div v-for="item in productsStore.mostViewed.slice(0, 5)" :key="item.id" class="trending-item mb-2">
              <NuxtLinkLocale :to="`/marketplace/${item.id}`" class="text-decoration-none d-flex gap-2">
                <img :src="item.images[0]" class="trending-img" :alt="item.title" />
                <div class="min-w-0">
                  <div class="small fw-medium text-truncate">{{ item.title }}</div>
                  <div class="small text-muted"><i class="bi bi-eye" /> {{ item.views }}</div>
                </div>
              </NuxtLinkLocale>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- Mobile sections -->
    <div class="d-lg-none mt-4">
      <CategoryGrid v-if="categoryTree.length" :categories="categoryTree" class="mb-4" />
      <FeedProductSection
        :title="$t('home.trending')"
        icon="bi bi-fire"
        :products="productsStore.trending"
        view-all-link="/search?sort=likes"
      />
      <FeedProductSection
        :title="$t('home.recommended')"
        icon="bi bi-stars"
        :products="productsStore.recommended"
        view-all-link="/search"
      />
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })

import { getCategories, getStories } from '@/api/categories'
import { getAuctions } from '@/api/auctions'
import { getFeaturedBusinesses } from '@/api/businesses'

const { t } = useI18n()
const { formatPrice } = useFormatters()
const productsStore = useProductsStore()
const categoryTree = ref([])
const stories = ref([])
const liveAuctions = ref([])
const featuredBusinesses = ref([])


const { target: loadMoreRef } = useInfiniteScroll(
  () => productsStore.fetchFeed(true),
  { canLoad: () => productsStore.feedHasMore && !productsStore.feedLoading },
)

const BENTO_PATTERN = ['hero', 'tall', 'compact', 'compact', 'wide', 'standard', 'tall', 'standard', 'wide', 'standard']

function skeletonClass(index) {
  return `bento-skeleton--${BENTO_PATTERN[index % BENTO_PATTERN.length]}`
}

onMounted(async () => {
  await Promise.all([
    productsStore.fetchFeed(),
    productsStore.fetchHomeSections(),
    getCategories().then((r) => { categoryTree.value = r.data || r || [] }),
    getStories().then((r) => { stories.value = (r.data || r || []).slice(0, 5) }),
    getAuctions({ status: 'active' }).then((r) => { liveAuctions.value = r.data || r || [] }),
    getFeaturedBusinesses().then((r) => { featuredBusinesses.value = r.data || r || [] }),
  ])
})
</script>

<style scoped lang="scss">
$sidebar-sticky-top: 6.5rem;

.home-sidebar {
  position: sticky;
  top: $sidebar-sticky-top;
  max-height: calc(100vh - #{$sidebar-sticky-top} - 1.5rem);
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--es-border) transparent;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--es-border);
    border-radius: 4px;
  }
}

.sidebar-card {
  border: 1px solid var(--es-border);
}

.sidebar-link {
  color: var(--es-text-muted);
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all $transition;
  font-size: 0.9rem;

  &:hover {
    background: var(--es-surface-2);
    color: var(--es-primary);
  }
}

.mini-img,
.trending-img {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.feed-shuffle-grid--loading {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;

  @media (min-width: 576px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: minmax(180px, auto);
    grid-auto-flow: dense;
    gap: 0.875rem;
  }

  @media (min-width: 992px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-auto-rows: minmax(200px, auto);
    gap: 1rem;
  }

  :deep(.skeleton-card),
  :deep(.card) {
    border-radius: 20px;
    height: 100%;
    min-height: inherit;
  }

  .bento-skeleton--hero {
    min-height: 280px;

    @media (min-width: 576px) {
      grid-column: span 2;
      grid-row: span 2;
      min-height: 100%;
    }
  }

  .bento-skeleton--tall {
    min-height: 320px;

    @media (min-width: 576px) {
      grid-row: span 2;
      min-height: 100%;
    }
  }

  .bento-skeleton--wide {
    min-height: 200px;

    @media (min-width: 576px) {
      grid-column: span 2;
    }
  }

  .bento-skeleton--compact {
    min-height: 180px;
  }

  .bento-skeleton--standard {
    min-height: 240px;
  }
}
</style>
