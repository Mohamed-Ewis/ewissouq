<template>
  <section class="section-block mb-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="fw-bold mb-0">
        <i :class="icon" class="me-2 text-primary" />{{ title }}
      </h5>
      <NuxtLinkLocale v-if="viewAllLink" :to="viewAllLink" class="small text-primary text-decoration-none">
        {{ $t('common.viewAll') }} <i class="bi bi-arrow-right" />
      </NuxtLinkLocale>
    </div>
    <div class="row g-3">
      <div v-for="product in products" :key="product.id" class="col-6 col-md-3">
        <ProductCard :product="product" />
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  icon: { type: String, default: 'bi bi-fire' },
  products: { type: Array, default: () => [] },
  viewAllLink: { type: String, default: '' },
})
</script>
