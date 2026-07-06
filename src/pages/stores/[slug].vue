<template>
  <div v-if="loading" class="py-5">
    <UiSkeletonLoader height="280px" class="mb-4" />
    <UiSkeletonLoader type="card" />
  </div>

  <UiErrorState v-else-if="error" :message="error" @retry="loadStore" />

  <div v-else-if="store" class="store-page">
    <Breadcrumb
      :items="[
        { label: $t('nav.home'), to: '/' },
        { label: $t('businesses.offersIndex.title'), to: '/stores' },
        { label: translateBusiness(store) },
      ]"
    />

    <BusinessHeader
      :business="store"
      :is-following="isFollowing"
      @follow="toggleFollow"
      @view-branches="activeTab = 'branches'"
    />

    <div class="store-tabs card mb-4">
      <ul class="nav nav-tabs border-0 px-3 flex-nowrap overflow-auto">
        <li v-for="tab in tabs" :key="tab.key" class="nav-item">
          <button class="nav-link" :class="{ active: activeTab === tab.key }" @click="activeTab = tab.key">
            <i :class="tab.icon" class="me-1" />{{ tab.label }}
            <span v-if="tab.count != null" class="badge ms-1" :class="activeTab === tab.key ? 'bg-primary' : 'bg-light text-dark'">
              {{ tab.count }}
            </span>
          </button>
        </li>
      </ul>
    </div>

    <!-- عروض -->
    <div v-if="activeTab === 'offers'">
      <BusinessOffersHero v-if="store.featuredOffer" :offer="store.featuredOffer" />

      <div v-if="store.offers && store.offers.length" class="row g-3">
        <div v-for="offer in store.offers" :key="offer.id" class="col-md-6 col-lg-4">
          <BusinessOfferCard :offer="enrichedOffer(offer)" />
        </div>
      </div>

      <UiEmptyState
        v-else
        icon="bi bi-tag"
        :title="$t('businesses.noOffers')"
        :description="$t('businesses.noOffersDesc')"
      />
    </div>

    <!-- فروع -->
    <div v-else-if="activeTab === 'branches'">
      <div class="branches-intro card p-3 p-md-4 mb-4">
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <h4 class="fw-bold mb-1">
              <i class="bi bi-geo-alt-fill text-primary me-2" />{{ $t('businesses.branchesTitle') }}
            </h4>
            <p class="text-muted mb-0 small">{{ $t('businesses.branchesSubtitle', { name: translateBusiness(store) }) }}</p>
          </div>
          <div class="branches-count-pill">
            <strong>{{ store.branchesCount || 0 }}</strong>
            <span>{{ $t('businesses.totalBranches') }}</span>
          </div>
        </div>
      </div>
      <BranchLocator :branches="store.branches || []" />
    </div>

    <!-- عن المتجر -->
    <div v-else class="card p-4">
      <h5 class="fw-bold mb-3">{{ $t('businesses.about') }}</h5>
      <p class="text-muted">{{ translateBusiness(store.descriptionKey) }}</p>

      <div class="row g-3 mt-2">
        <div v-if="store.phone" class="col-md-6">
          <div class="info-item">
            <i class="bi bi-telephone text-primary" />
            <div>
              <div class="small text-muted">{{ $t('businesses.phone') }}</div>
              <a :href="`tel:${store.phone}`">{{ store.phone }}</a>
            </div>
          </div>
        </div>
        <div v-if="store.email" class="col-md-6">
          <div class="info-item">
            <i class="bi bi-envelope text-primary" />
            <div>
              <div class="small text-muted">{{ $t('businesses.email') }}</div>
              <a :href="`mailto:${store.email}`">{{ store.email }}</a>
            </div>
          </div>
        </div>
        <div v-if="store.website" class="col-md-6">
          <div class="info-item">
            <i class="bi bi-globe text-primary" />
            <div>
              <div class="small text-muted">{{ $t('businesses.website') }}</div>
              <a :href="store.website" target="_blank" rel="noopener">{{ store.website }}</a>
            </div>
          </div>
        </div>
        <div v-if="store.workingHours" class="col-md-6">
          <div class="info-item">
            <i class="bi bi-clock text-primary" />
            <div>
              <div class="small text-muted">{{ $t('businesses.hours') }}</div>
              <span>{{ store.workingHours.open }} — {{ store.workingHours.close }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getBusiness, followBusiness } from '@/api/businesses'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
const route = useRoute()
const { translateBusiness } = useBusinessName()

const store = ref(null)
const loading = ref(true)
const error = ref('')
const activeTab = ref('offers')
const isFollowing = ref(false)

const tabs = computed(() => {
  const s = store.value
  if (!s) return []
  return [
    { key: 'offers', label: t('businesses.tabs.offers'), icon: 'bi bi-tag-fill', count: s.offersCount || 0 },
    { key: 'branches', label: t('businesses.tabs.branches'), icon: 'bi bi-geo-alt', count: s.branchesCount || 0 },
    { key: 'about', label: t('businesses.tabs.about'), icon: 'bi bi-info-circle', count: null },
  ]
})

async function loadStore() {
  loading.value = true
  error.value = ''
  try {
    const res = await getBusiness(route.params.slug)
    store.value = res.data || res
    isFollowing.value = store.value.isFollowing || false
    activeTab.value = 'offers'
  } catch (err) {
    error.value = err.message || t('businesses.notFound')
  } finally {
    loading.value = false
  }
}

function enrichedOffer(offer) {
  if (!store.value) return offer
  return {
    ...offer,
    business: {
      id: store.value.id,
      slug: store.value.slug,
      nameKey: store.value.nameKey,
      logo: store.value.logo,
    },
  }
}

async function toggleFollow() {
  const res = await followBusiness(store.value.id)
  isFollowing.value = res.data?.following ?? !isFollowing.value
}

onMounted(loadStore)
</script>

<style scoped lang="scss">
.store-tabs {
  border: 1px solid var(--es-border);
  border-radius: 12px;
  overflow: hidden;

  .nav-link {
    color: var(--es-text-muted);
    border: none;
    border-bottom: 2px solid transparent;
    font-weight: 500;
    white-space: nowrap;

    &.active {
      color: var(--es-primary);
      border-bottom-color: var(--es-primary);
      background: none;
    }
  }
}

.branches-count-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: var(--es-gradient);
  color: #fff;
  border-radius: 14px;
  min-width: 100px;

  strong {
    font-size: 1.75rem;
    line-height: 1;
  }

  span {
    font-size: 0.75rem;
    opacity: 0.9;
  }
}

.info-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;

  i {
    font-size: 1.25rem;
    margin-top: 0.15rem;
  }

  a {
    color: var(--es-text);
    text-decoration: none;

    &:hover {
      color: var(--es-primary);
    }
  }
}
</style>

