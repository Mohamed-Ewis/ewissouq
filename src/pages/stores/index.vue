<template>
  <div class="offers-page">
    <div class="offers-hero mb-4">
      <div class="offers-hero__content">
        <h1 class="fw-bold mb-2">{{ $t('businesses.offersIndex.title') }}</h1>
        <p class="text-muted mb-3">{{ $t('businesses.offersIndex.subtitle') }}</p>
        <div class="row g-2">
          <div class="col-md-8">
            <input
              v-model="filters.q"
              type="search"
              class="form-control form-control-lg"
              :placeholder="$t('businesses.offersIndex.searchPlaceholder')"
              @keyup.enter="loadOffers"
            />
          </div>
          <div class="col-md-4">
            <select v-model="filters.sort" class="form-select form-select-lg" @change="loadOffers">
              <option value="ending">{{ $t('businesses.offersIndex.sortEnding') }}</option>
              <option value="discount">{{ $t('businesses.offersIndex.sortDiscount') }}</option>
              <option value="price_asc">{{ $t('businesses.offersIndex.sortPrice') }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex flex-wrap gap-2 mb-4">
      <button
        v-for="tab in badgeTabs"
        :key="tab.value"
        type="button"
        class="btn btn-sm"
        :class="filters.badge === tab.value ? 'btn-primary' : 'btn-outline-secondary'"
        @click="setBadge(tab.value)"
      >
        <i :class="tab.icon" class="me-1" />{{ tab.label }}
      </button>
    </div>

    <div v-if="loading" class="row g-3">
      <div v-for="i in 6" :key="i" class="col-md-6 col-lg-4">
        <UiSkeletonLoader type="card" />
      </div>
    </div>

    <div v-else-if="offers.length" class="row g-3">
      <div v-for="offer in offers" :key="offer.id" class="col-md-6 col-lg-4">
        <BusinessOfferCard :offer="offer" show-store />
      </div>
    </div>

    <UiEmptyState
      v-else
      icon="bi bi-tag"
      :title="$t('businesses.offersIndex.empty.title')"
      :description="$t('businesses.offersIndex.empty.description')"
    />

    <div v-if="hasMore" class="text-center mt-4">
      <button type="button" class="btn btn-outline-primary" :disabled="loadingMore" @click="loadMore">
        <span v-if="loadingMore" class="spinner-border spinner-border-sm me-1" />
        {{ $t('businesses.loadMore') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { getOffers } from '@/api/offers'

definePageMeta({ layout: 'default' })

const { t } = useI18n()

const offers = ref([])
const loading = ref(true)
const loadingMore = ref(false)
const page = ref(1)
const hasMore = ref(false)

const filters = reactive({
  q: '',
  badge: '',
  sort: 'ending',
})

const badgeTabs = computed(() => [
  { value: '', label: t('businesses.offersIndex.allOffers'), icon: 'bi bi-grid' },
  { value: 'flash', label: t('businesses.offerBadges.flash'), icon: 'bi bi-lightning-fill' },
  { value: 'weekly', label: t('businesses.offerBadges.weekly'), icon: 'bi bi-calendar-week' },
  { value: 'exclusive', label: t('businesses.offerBadges.exclusive'), icon: 'bi bi-star-fill' },
  { value: 'bundle', label: t('businesses.offerBadges.bundle'), icon: 'bi bi-box-seam' },
  { value: 'clearance', label: t('businesses.offerBadges.clearance'), icon: 'bi bi-percent' },
])

async function loadOffers(reset = true) {
  if (reset) {
    loading.value = true
    page.value = 1
  }
  try {
    const res = await getOffers({
      ...filters,
      page: page.value,
      pageSize: 12,
    })
    const items = res.data || []
    offers.value = reset ? items : [...offers.value, ...items]
    hasMore.value = res.meta?.hasMore ?? false
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

function setBadge(badge) {
  filters.badge = badge
  loadOffers()
}

async function loadMore() {
  loadingMore.value = true
  page.value += 1
  await loadOffers(false)
}

onMounted(() => loadOffers())
</script>

<style scoped lang="scss">
.offers-hero {
  padding: 2rem;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.06) 0%, rgba(99, 102, 241, 0.08) 100%);
  border: 1px solid var(--es-border);
}

.offers-hero__content h1 {
  font-size: 1.75rem;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
}
</style>
