<template>
  <section class="business-header">
    <div class="business-header__cover">
      <img :src="business.cover" :alt="translateBusiness(business)" />
      <div class="business-header__overlay" />
    </div>

    <div class="business-header__body container-fluid px-3 px-lg-4">
      <div class="business-header__main d-flex flex-wrap align-items-end gap-3">
        <img :src="business.logo" class="business-header__logo" :alt="translateBusiness(business)" />

        <div class="flex-grow-1 min-w-0">
          <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
            <h1 class="business-header__title fw-bold mb-0">{{ translateBusiness(business) }}</h1>
            <BusinessBadge v-if="business.tier" :tier="business.tier" />
            <span v-if="business.verified" class="badge bg-primary-subtle text-primary">
              <i class="bi bi-patch-check-fill me-1" />{{ $t('businesses.verified') }}
            </span>
          </div>
          <p class="text-muted mb-2">{{ translateBusiness(business.descriptionKey) }}</p>

          <div class="d-flex flex-wrap gap-3 small text-muted">
            <span><i class="bi bi-star-fill text-warning" /> {{ business.rating }} {{ $t('businesses.rating') }}</span>
            <span v-if="business.offersCount"><i class="bi bi-tag-fill text-danger" /> {{ business.offersCount }} {{ $t('businesses.offersCount') }}</span>
            <span><i class="bi bi-box-seam" /> {{ business.productsCount }} {{ $t('businesses.products') }}</span>
            <span><i class="bi bi-people" /> {{ formatCount(business.followers) }} {{ $t('businesses.followers') }}</span>
          </div>
        </div>

        <div class="business-header__actions d-flex gap-2 flex-shrink-0 flex-wrap">
          <button
            type="button"
            class="btn"
            :class="isFollowing ? 'btn-outline-primary' : 'btn-primary'"
            @click="$emit('follow')"
          >
            <i :class="isFollowing ? 'bi bi-check-lg' : 'bi bi-plus-lg'" class="me-1" />
            {{ isFollowing ? $t('businesses.following') : $t('businesses.follow') }}
          </button>
          <button
            v-if="branchCount > 0"
            type="button"
            class="btn btn-outline-primary"
            @click="$emit('view-branches')"
          >
            <i class="bi bi-geo-alt me-1" />
            {{ $t('businesses.viewBranches', { count: branchCount }) }}
          </button>
          <a v-if="business.phone" :href="`tel:${business.phone}`" class="btn btn-outline-secondary">
            <i class="bi bi-telephone" />
          </a>
          <a v-if="business.website" :href="business.website" target="_blank" rel="noopener" class="btn btn-outline-secondary">
            <i class="bi bi-globe" />
          </a>
        </div>
      </div>

      <button
        v-if="branchCount > 1"
        type="button"
        class="branch-banner mt-3 w-100"
        @click="$emit('view-branches')"
      >
        <div class="branch-banner__icon"><i class="bi bi-map" /></div>
        <div class="branch-banner__text text-start">
          <strong>{{ $t('businesses.branchBannerTitle', { count: branchCount }) }}</strong>
          <span class="d-block small opacity-75">{{ $t('businesses.branchBannerDesc') }}</span>
        </div>
        <i class="bi bi-chevron-left branch-banner__arrow rtl-flip" />
      </button>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  business: { type: Object, required: true },
  isFollowing: { type: Boolean, default: false },
})

defineEmits(['follow', 'view-branches'])

const { translateBusiness } = useBusinessName()

const branchCount = computed(() => props.business.branchesCount || (props.business.branches && props.business.branches.length) || 0)

function formatCount(n) {
  if (!n) return '0'
  return Number(n).toLocaleString()
}
</script>

<style scoped lang="scss">
.business-header {
  margin: -1rem -0.75rem 1.5rem;
  border-radius: 0 0 20px 20px;
  overflow: hidden;
  background: var(--es-surface);
  border-bottom: 1px solid var(--es-border);

  @media (min-width: 992px) {
    margin-left: -1.5rem;
    margin-right: -1.5rem;
  }
}

.business-header__cover {
  position: relative;
  height: 180px;

  @media (min-width: 768px) {
    height: 220px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.business-header__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 30%, rgba(15, 23, 42, 0.7) 100%);
}

.business-header__body {
  position: relative;
  padding-bottom: 1.25rem;
  margin-top: -2.5rem;
}

.business-header__logo {
  width: 88px;
  height: 88px;
  border-radius: 20px;
  object-fit: cover;
  border: 4px solid var(--es-surface);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  background: #fff;
  flex-shrink: 0;
}

.business-header__title {
  font-size: 1.5rem;
  color: var(--es-text);

  @media (min-width: 768px) {
    font-size: 1.75rem;
  }
}

.branch-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1.25rem;
  border: 1px solid var(--es-border);
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.06), rgba(168, 85, 247, 0.06));
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--es-text);

  &:hover {
    border-color: var(--es-primary);
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.08));
  }
}

.branch-banner__icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--es-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.branch-banner__text {
  flex: 1;
  min-width: 0;
}

.branch-banner__arrow {
  font-size: 1.25rem;
  color: var(--es-text-muted);
  flex-shrink: 0;
}

.rtl-flip {
  html[dir='rtl'] & {
    transform: scaleX(-1);
  }
}
</style>
