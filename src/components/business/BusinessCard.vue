<template>
  <article class="business-card card h-100" :class="`business-card--${business.tier}`">
    <NuxtLinkLocale :to="`/stores/${business.slug}`" class="business-card__link text-decoration-none">
      <div class="business-card__cover">
        <img :src="business.cover" :alt="translateBusiness(business)" />
        <div class="business-card__cover-overlay" />
        <img :src="business.logo" class="business-card__logo" :alt="translateBusiness(business)" />
        <BusinessBadge v-if="business.tier !== 'basic'" :tier="business.tier" class="business-card__tier" />
      </div>

      <div class="card-body p-3">
        <h3 class="business-card__name fw-bold mb-1">{{ translateBusiness(business) }}</h3>
        <p class="business-card__desc text-muted small mb-2">{{ translateBusiness(business.descriptionKey) }}</p>

        <div class="d-flex align-items-center justify-content-between gap-2">
          <div class="business-card__stats d-flex gap-3 small text-muted">
            <span><i class="bi bi-star-fill text-warning" /> {{ business.rating }}</span>
            <span><i class="bi bi-box-seam" /> {{ business.productsCount || 0 }}</span>
            <span><i class="bi bi-people" /> {{ formatCount(business.followers) }}</span>
          </div>
          <span v-if="business.verified" class="text-primary" :title="$t('businesses.verified')">
            <i class="bi bi-patch-check-fill" />
          </span>
        </div>

        <div v-if="business.location" class="business-card__location small text-muted mt-2">
          <i class="bi bi-geo-alt" />
          {{ business.location.city }}
          <span v-if="business.branchesCount > 1">
            · {{ $t('businesses.branchesCount', { count: business.branchesCount }) }}
          </span>
        </div>
      </div>
    </NuxtLinkLocale>
  </article>
</template>

<script setup>
defineProps({
  business: { type: Object, required: true },
})

const { translateBusiness } = useBusinessName()

function formatCount(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n
}
</script>

<style scoped lang="scss">
.business-card {
  border: 1px solid var(--es-border);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
  }

  &--premium {
    border-color: rgba(245, 158, 11, 0.35);
  }
}

.business-card__link {
  display: block;
  color: inherit;
}

.business-card__cover {
  position: relative;
  height: 120px;
  overflow: hidden;
  background: var(--es-surface-2);

  > img:first-child {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.business-card__cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 20%, rgba(15, 23, 42, 0.55) 100%);
}

.business-card__logo {
  position: absolute;
  bottom: -24px;
  left: 1rem;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  object-fit: cover;
  border: 3px solid var(--es-surface);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: #fff;
}

html[dir='rtl'] .business-card__logo {
  left: auto;
  right: 1rem;
}

.business-card__tier {
  position: absolute;
  top: 0.65rem;
  right: 0.65rem;
}

html[dir='rtl'] .business-card__tier {
  right: auto;
  left: 0.65rem;
}

.business-card__name {
  font-size: 1rem;
  margin-top: 1.5rem;
  color: var(--es-text);
}

.business-card__desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}
</style>
