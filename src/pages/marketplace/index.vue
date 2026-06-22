<template>
  <div class="marketplace-page">
    <div class="page-header mb-4">
      <h2 class="fw-bold mb-1">{{ $t('marketplace.title') }}</h2>
      <p class="text-muted mb-0">{{ $t('marketplace.subtitle') }}</p>
    </div>

    <div class="d-flex gap-2 mb-4 overflow-auto pb-1">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="btn btn-sm"
        :class="activeTab === tab.value ? 'btn-primary' : 'btn-outline-secondary'"
        @click="setTab(tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="productsStore.loading" class="row g-3">
      <div v-for="i in 8" :key="i" class="col-6 col-md-4 col-lg-3">
        <UiSkeletonLoader type="card" />
      </div>
    </div>

    <div v-else-if="productsStore.products.length" class="row g-3">
      <div v-for="product in productsStore.products" :key="product.id" class="col-6 col-md-4 col-lg-3">
        <ProductCard :product="product" />
      </div>
    </div>

    <UiEmptyState
      v-else
      icon="bi bi-shop"
      :title="$t('marketplace.noProducts')"
      :description="$t('marketplace.noProductsDesc')"
    />
  </div>
</template>

<script setup>
const { t } = useI18n()
const productsStore = useProductsStore()
const activeTab = ref('all')

const tabs = computed(() => [
  { value: 'all', label: t('marketplace.all') },
  { value: 'new', label: t('condition.new') },
  { value: 'used', label: t('condition.used') },
])

function setTab(value) {
  activeTab.value = value
  const params = value === 'all' ? {} : { condition: value }
  productsStore.fetchProducts(params)
}

onMounted(() => productsStore.fetchProducts())
</script>
