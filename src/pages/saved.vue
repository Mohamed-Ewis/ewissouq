<template>
  <div class="saved-page">
    <div class="page-header mb-4">
      <h2 class="fw-bold mb-1"><i class="bi bi-bookmark me-2 text-primary" />{{ $t('saved.title') }}</h2>
      <p class="text-muted mb-0">{{ $t('saved.subtitle') }}</p>
    </div>

    <div v-if="loading" class="row g-3">
      <div v-for="i in 4" :key="i" class="col-6 col-md-3">
        <UiSkeletonLoader type="card" />
      </div>
    </div>

    <div v-else-if="saved.length" class="row g-3">
      <div v-for="product in saved" :key="product.id" class="col-6 col-md-4 col-lg-3">
        <ProductCard :product="product" />
      </div>
    </div>

    <UiEmptyState
      v-else
      icon="bi bi-bookmark"
      :title="$t('saved.empty')"
      :description="$t('saved.emptyDesc')"
    >
      <template #action>
        <NuxtLinkLocale to="/marketplace" class="btn btn-primary mt-2">{{ $t('saved.browse') }}</NuxtLinkLocale>
      </template>
    </UiEmptyState>
  </div>
</template>

<script setup>
const productsStore = useProductsStore()
const loading = ref(true)
const saved = computed(() => productsStore.saved)

onMounted(async () => {
  await productsStore.fetchSaved()
  loading.value = false
})
</script>
