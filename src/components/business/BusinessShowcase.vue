<template>
  <section v-if="businesses.length" class="business-showcase mb-4">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h5 class="fw-bold mb-0">
        <i class="bi bi-building me-2 text-primary" />{{ $t('businesses.featuredTitle') }}
      </h5>
      <NuxtLinkLocale to="/stores" class="btn btn-sm btn-outline-primary">
        {{ $t('common.viewAll') }} <i class="bi bi-arrow-left-short ms-1 rtl-flip" />
      </NuxtLinkLocale>
    </div>

    <div class="business-showcase__scroll">
      <NuxtLinkLocale
        v-for="biz in businesses"
        :key="biz.id"
        :to="`/stores/${biz.slug}`"
        class="business-showcase__item text-decoration-none"
        :class="`business-showcase__item--${biz.tier}`"
      >
        <img :src="biz.cover" class="business-showcase__bg" :alt="translateBusiness(biz)" />
        <div class="business-showcase__overlay">
          <img :src="biz.logo" class="business-showcase__logo" :alt="translateBusiness(biz)" />
          <div class="business-showcase__info">
            <BusinessBadge v-if="biz.tier !== 'basic'" :tier="biz.tier" />
            <h6 class="business-showcase__name mb-0">{{ translateBusiness(biz) }}</h6>
            <span class="business-showcase__meta">{{ biz.productsCount }} {{ $t('businesses.products') }}</span>
          </div>
        </div>
      </NuxtLinkLocale>
    </div>
  </section>
</template>

<script setup>
defineProps({
  businesses: { type: Array, default: () => [] },
})

const { translateBusiness } = useBusinessName()
</script>

<style scoped lang="scss">
.business-showcase__scroll {
  display: flex;
  gap: 0.875rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    height: 4px;
  }
}

.business-showcase__item {
  flex: 0 0 200px;
  height: 140px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  scroll-snap-align: start;
  transition: transform 0.25s ease;

  @media (min-width: 768px) {
    flex: 0 0 240px;
    height: 160px;
  }

  &:hover {
    transform: scale(1.03);
  }

  &--premium {
    flex: 0 0 260px;

    @media (min-width: 768px) {
      flex: 0 0 300px;
      height: 170px;
    }
  }
}

.business-showcase__bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.business-showcase__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0.875rem;
  background: linear-gradient(180deg, transparent 20%, rgba(15, 23, 42, 0.85) 100%);
  color: #fff;
}

.business-showcase__logo {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
}

.business-showcase__name {
  font-size: 0.9rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.business-showcase__meta {
  font-size: 0.75rem;
  opacity: 0.85;
}

.rtl-flip {
  html[dir='rtl'] & {
    display: inline-block;
    transform: scaleX(-1);
  }
}
</style>
