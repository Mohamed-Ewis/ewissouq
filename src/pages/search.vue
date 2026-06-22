<template>
  <div class="search-page">
    <div class="page-header mb-4">
      <h2 class="fw-bold mb-1">{{ $t('search.title') }}</h2>
      <p class="text-muted mb-0">{{ $t('search.subtitle') }}</p>
    </div>

    <div class="row g-4">
      <div class="col-lg-3">
        <SearchFilterSidebar
          :filters="filters"
          :categories="categories"
          :countries="countries"
          :city-options="cityOptions"
          :area-options="areaOptions"
          :conditions="conditions"
          :sort-options="sortOptions"
          :active-count="activeFilterCount"
          @apply="search"
          @reset="resetAndSearch"
        />
      </div>

      <div class="col-lg-9">
        <div class="mb-3">
          <input
            v-model="filters.q"
            type="search"
            class="form-control form-control-lg"
            :placeholder="$t('search.placeholderShort')"
            @keyup.enter="search"
          />
        </div>

        <div v-if="activeFilterCount" class="filter-chips d-flex flex-wrap gap-2 mb-3">
          <span class="badge bg-primary">{{ $t('search.activeFilters', { count: activeFilterCount }) }}</span>
        </div>

        <div v-if="loading" class="row g-3">
          <div v-for="i in 6" :key="i" class="col-md-4">
            <UiSkeletonLoader type="card" />
          </div>
        </div>

        <div v-else-if="results.length" class="row g-3">
          <div class="col-12 mb-2">
            <small class="text-muted">{{ $t('search.resultsCount', { count: results.length }) }}</small>
          </div>
          <div v-for="product in results" :key="product.id" class="col-6 col-md-4">
            <ProductCard :product="product" />
          </div>
        </div>

        <UiEmptyState
          v-else
          icon="bi bi-search"
          :title="$t('search.empty.title')"
          :description="$t('search.empty.description')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { getProducts } from '@/api/products'
import { getCategories } from '@/api/categories'

const route = useRoute()
const { filters, cityOptions, areaOptions, activeFilterCount, resetFilters, toParams, sortOptions, countries, conditions } = useProductFilters({
  q: route.query.q || '',
  category: route.query.category || '',
})

const categories = ref([])
const results = ref([])
const loading = ref(false)

async function search() {
  loading.value = true
  try {
    const res = await getProducts(toParams())
    results.value = res.data || []
    navigateTo({ query: toParams() }, { replace: true })
  } finally {
    loading.value = false
  }
}

function resetAndSearch() {
  resetFilters()
  search()
}

onMounted(async () => {
  const catRes = await getCategories()
  categories.value = catRes.data || catRes || []
  if (route.query.q || route.query.category) search()
  else search()
})
</script>
