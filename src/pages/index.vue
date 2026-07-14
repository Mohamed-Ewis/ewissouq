<template>
  <div class="home-page">
    <div class="row g-4">
      <div class="col-lg-9">
        <StoriesBar v-if="stories.length" :stories="stories" />

        <div class="feed-timeline">
          <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
            <h5 class="fw-bold mb-0">
              <i class="bi bi-compass me-2 text-primary" />{{ $t('home.timeline') }}
            </h5>
            <div class="feed-chips">
              <button
                v-for="chip in chips"
                :key="chip.value"
                type="button"
                class="btn btn-sm"
                :class="feedType === chip.value ? 'btn-primary' : 'btn-outline-secondary'"
                @click="setFeedType(chip.value)"
              >
                <i :class="chip.icon" class="me-1" />{{ chip.label }}
              </button>
            </div>
          </div>

          <template v-if="productsStore.feedLoading && !productsStore.feed.length">
            <div class="feed-loading-grid">
              <UiSkeletonLoader v-for="i in 4" :key="i" type="card" class="feed-skel" />
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

      <div class="col-lg-3 d-none d-lg-block">
        <aside class="home-sidebar">
          <AdsSlider v-if="homeAds.length" :ads="homeAds" variant="sidebar" class="mb-4" />

          <div v-if="endingOffers.length" class="sidebar-card card p-3 mb-4">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h6 class="fw-bold mb-0">
                <i class="bi bi-tag text-danger" /> {{ $t('home.endingOffers') }}
              </h6>
              <NuxtLinkLocale to="/stores" class="small text-primary text-decoration-none">
                {{ $t('common.viewAll') }}
              </NuxtLinkLocale>
            </div>
            <div v-for="offer in endingOffers" :key="offer.id" class="mini-row mb-2">
              <NuxtLinkLocale :to="`/offers/${offer.id}`" class="text-decoration-none d-flex gap-2 align-items-center">
                <img :src="offer.image" class="mini-img" :alt="translateOffer(offer.titleKey)" />
                <div class="min-w-0">
                  <div class="small fw-medium text-truncate">{{ translateOffer(offer.titleKey) }}</div>
                  <div class="small text-danger fw-bold">-{{ offer.discountPercent }}%</div>
                </div>
              </NuxtLinkLocale>
            </div>
          </div>

          <div v-if="liveAuctions.length" class="sidebar-card card p-3 mb-4">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h6 class="fw-bold mb-0">
                <i class="bi bi-hammer text-primary" /> {{ $t('home.liveAuctions') }}
              </h6>
              <NuxtLinkLocale to="/auctions" class="small text-primary text-decoration-none">
                {{ $t('common.viewAll') }}
              </NuxtLinkLocale>
            </div>
            <div v-for="auction in liveAuctions.slice(0, 3)" :key="auction.id" class="mini-row mb-2">
              <NuxtLinkLocale :to="`/auctions/${auction.id}`" class="text-decoration-none d-flex gap-2 align-items-center">
                <img :src="auction.images[0]" class="mini-img" :alt="auction.title" />
                <div class="min-w-0">
                  <div class="small fw-medium text-truncate">{{ auction.title }}</div>
                  <div class="small text-primary fw-bold">{{ formatPrice(auction.currentBid) }}</div>
                </div>
              </NuxtLinkLocale>
            </div>
          </div>

          <CategoryGrid :categories="categoryTree" variant="sidebar" class="mb-4" />
        </aside>
      </div>
    </div>

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
import { getOffers } from '@/api/offers'
import { getHomeAds } from '@/api/ads'

const { t, te } = useI18n()
const { formatPrice } = useFormatters()
const productsStore = useProductsStore()
const categoryTree = ref([])
const stories = ref([])
const liveAuctions = ref([])
const endingOffers = ref([])
const homeAds = ref([])
const feedType = computed(() => productsStore.feedType || 'all')

const chips = computed(() => [
  { value: 'all', label: t('home.chips.all'), icon: 'bi bi-grid' },
  { value: 'classified', label: t('home.chips.classified'), icon: 'bi bi-tag' },
  { value: 'auction', label: t('home.chips.auction'), icon: 'bi bi-hammer' },
  { value: 'offer', label: t('home.chips.offer'), icon: 'bi bi-percent' },
])

const { target: loadMoreRef } = useInfiniteScroll(
  () => productsStore.fetchFeed(true),
  { canLoad: () => productsStore.feedHasMore && !productsStore.feedLoading },
)

function translateOffer(key) {
  if (key && te(key)) return t(key)
  return key || ''
}

async function setFeedType(type) {
  await productsStore.fetchFeed(false, type)
}

onMounted(async () => {
  await Promise.all([
    productsStore.fetchFeed(),
    productsStore.fetchHomeSections(),
    getCategories().then((r) => { categoryTree.value = r.data || r || [] }),
    getStories().then((r) => { stories.value = (r.data || r || []).slice(0, 5) }),
    getAuctions({ status: 'active' }).then((r) => { liveAuctions.value = r.data || r || [] }),
    getOffers({ sort: 'ending', pageSize: 4 }).then((r) => { endingOffers.value = (r.data || r || []).slice(0, 4) }),
    getHomeAds().then((r) => { homeAds.value = r.data || r || [] }),
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
}

.sidebar-card {
  border: 1px solid var(--es-border);
}

.feed-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.mini-img {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.feed-loading-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.85rem;

  @media (min-width: 576px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.feed-skel {
  min-height: 220px;
  border-radius: 14px;
}
</style>
