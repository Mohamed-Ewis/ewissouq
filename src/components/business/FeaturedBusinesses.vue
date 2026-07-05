<template>
  <div class="featured-businesses">
    <div v-for="biz in businesses" :key="biz.id" class="featured-business mb-2">
      <NuxtLinkLocale :to="`/stores/${biz.slug}`" class="text-decoration-none d-flex gap-2 align-items-center">
        <img :src="biz.logo" class="featured-business__logo" :alt="translateBusiness(biz)" />
        <div class="min-w-0 flex-grow-1">
          <div class="small fw-semibold text-truncate">{{ translateBusiness(biz) }}</div>
          <div class="d-flex align-items-center gap-2">
            <span class="small text-warning"><i class="bi bi-star-fill" /> {{ biz.rating }}</span>
            <BusinessBadge v-if="biz.tier === 'premium'" :tier="biz.tier" />
          </div>
        </div>
        <i class="bi bi-chevron-left text-muted rtl-flip" />
      </NuxtLinkLocale>
    </div>
  </div>
</template>

<script setup>
defineProps({
  businesses: { type: Array, default: () => [] },
})

const { translateBusiness } = useBusinessName()
</script>

<style scoped lang="scss">
.featured-business {
  padding: 0.5rem;
  border-radius: 10px;
  transition: background 0.2s ease;

  &:hover {
    background: var(--es-surface-2);
  }
}

.featured-business__logo {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid var(--es-border);
}

.rtl-flip {
  html[dir='rtl'] & {
    transform: scaleX(-1);
  }
}
</style>
