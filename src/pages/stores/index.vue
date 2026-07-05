<template>
  <div class="stores-page">
    <div class="stores-hero mb-4">
      <div class="stores-hero__content">
        <h1 class="fw-bold mb-2">{{ $t('businesses.title') }}</h1>
        <p class="text-muted mb-3">{{ $t('businesses.subtitle') }}</p>
        <div class="row g-2">
          <div class="col-md-8">
            <input
              v-model="filters.q"
              type="search"
              class="form-control form-control-lg"
              :placeholder="$t('businesses.searchPlaceholder')"
              @keyup.enter="loadStores"
            />
          </div>
          <div class="col-md-4">
            <select v-model="filters.tier" class="form-select form-select-lg" @change="loadStores">
              <option value="">{{ $t('businesses.allTiers') }}</option>
              <option value="premium">{{ $t('businesses.tiers.premium') }}</option>
              <option value="verified">{{ $t('businesses.tiers.verified') }}</option>
              <option value="basic">{{ $t('businesses.tiers.basic') }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex flex-wrap gap-2 mb-4">
      <button
        v-for="tab in tierTabs"
        :key="tab.value"
        type="button"
        class="btn btn-sm"
        :class="filters.tier === tab.value ? 'btn-primary' : 'btn-outline-secondary'"
        @click="setTier(tab.value)"
      >
        <i :class="tab.icon" class="me-1" />{{ tab.label }}
      </button>
    </div>

    <div v-if="loading" class="row g-3">
      <div v-for="i in 6" :key="i" class="col-md-6 col-lg-4">
        <UiSkeletonLoader type="card" />
      </div>
    </div>

    <div v-else-if="stores.length" class="row g-3">
      <div v-for="store in stores" :key="store.id" class="col-md-6 col-lg-4">
        <BusinessCard :business="store" />
      </div>
    </div>

    <UiEmptyState
      v-else
      icon="bi bi-building"
      :title="$t('businesses.empty.title')"
      :description="$t('businesses.empty.description')"
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
import { getBusinesses } from '@/api/businesses'

definePageMeta({ layout: 'default' })

const { t } = useI18n()

const stores = ref([])
const loading = ref(true)
const loadingMore = ref(false)
const page = ref(1)
const hasMore = ref(false)

const filters = reactive({
  q: '',
  tier: '',
  sort: 'followers',
})

const tierTabs = computed(() => [
  { value: '', label: t('businesses.allStores'), icon: 'bi bi-grid' },
  { value: 'premium', label: t('businesses.tiers.premium'), icon: 'bi bi-gem' },
  { value: 'verified', label: t('businesses.tiers.verified'), icon: 'bi bi-patch-check' },
  { value: 'basic', label: t('businesses.tiers.basic'), icon: 'bi bi-shop' },
])

async function loadStores(reset = true) {
  if (reset) {
    loading.value = true
    page.value = 1
  }
  try {
    const res = await getBusinesses({
      ...filters,
      page: page.value,
      pageSize: 12,
    })
    const items = res.data || []
    stores.value = reset ? items : [...stores.value, ...items]
    hasMore.value = res.meta?.hasMore ?? false
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

function setTier(tier) {
  filters.tier = tier
  loadStores()
}

async function loadMore() {
  loadingMore.value = true
  page.value += 1
  await loadStores(false)
}

onMounted(() => loadStores())
</script>

<style scoped lang="scss">
.stores-hero {
  padding: 2rem;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%);
  border: 1px solid var(--es-border);
}

.stores-hero__content h1 {
  font-size: 1.75rem;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
}
</style>
