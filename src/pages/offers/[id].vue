<template>
  <div v-if="loading" class="py-5">
    <UiSkeletonLoader height="320px" class="mb-4" />
    <UiSkeletonLoader type="card" />
  </div>

  <UiErrorState v-else-if="error" :message="error" @retry="loadOffer" />

  <div v-else-if="offer" class="offer-detail-page">
    <Breadcrumb
      :items="[
        { label: $t('nav.home'), to: '/' },
        { label: $t('businesses.offersIndex.title'), to: '/stores' },
        { label: translateOffer(offer.titleKey) },
      ]"
    />

    <div class="row g-4 mb-5">
      <div class="col-lg-7">
        <div class="offer-detail__media card overflow-hidden">
          <img :src="offer.image" :alt="translateOffer(offer.titleKey)" />
          <span class="offer-detail__discount">-{{ offer.discountPercent }}%</span>
          <span class="offer-detail__badge" :class="`offer-detail__badge--${offer.badge}`">
            {{ badgeLabel(offer.badge) }}
          </span>
        </div>
      </div>

      <div class="col-lg-5">
        <div class="offer-detail__info">
          <span v-if="offer.featured" class="offer-detail__featured">
            <i class="bi bi-star-fill me-1" />{{ $t('businesses.featuredOffer') }}
          </span>
          <h1 class="fw-bold mb-2">{{ translateOffer(offer.titleKey) }}</h1>
          <p class="text-muted mb-3">{{ translateOffer(offer.descKey) }}</p>

          <div class="offer-detail__pricing mb-3">
            <span class="offer-detail__sale">{{ formatPrice(offer.salePrice, offer.currency) }}</span>
            <span class="offer-detail__original text-muted text-decoration-line-through">
              {{ formatPrice(offer.originalPrice, offer.currency) }}
            </span>
          </div>

          <div class="offer-detail__expires mb-4">
            <i class="bi bi-clock me-1" />
            {{ expiresLabel(offer.validUntil) }}
          </div>

          <button type="button" class="btn btn-primary btn-lg w-100 mb-3" :disabled="claiming" @click="onClaim">
            <span v-if="claiming" class="spinner-border spinner-border-sm me-1" />
            {{ claimed ? $t('businesses.claimSuccessShort') : $t('businesses.claimOffer') }}
          </button>
          <div v-if="claimed" class="alert alert-success small mb-4">
            {{ $t('businesses.claimSuccess') }}
            <NuxtLinkLocale
              v-if="offer.business"
              :to="`/stores/${offer.business.slug}`"
              class="alert-link"
            >
              {{ $t('businesses.viewStore') }}
            </NuxtLinkLocale>
          </div>

          <NuxtLinkLocale
            v-if="offer.business"
            :to="`/stores/${offer.business.slug}`"
            class="store-mini card p-3 text-decoration-none"
          >
            <div class="d-flex align-items-center gap-3">
              <img :src="offer.business.logo" :alt="translateBusiness(offer.business)" class="store-mini__logo" />
              <div class="flex-grow-1 min-w-0">
                <div class="fw-semibold text-truncate">{{ translateBusiness(offer.business) }}</div>
                <div class="small text-muted">
                  <i class="bi bi-star-fill text-warning me-1" />{{ offer.business.rating }}
                  · {{ offer.business.followers }} {{ $t('businesses.followers') }}
                </div>
              </div>
              <span class="btn btn-sm btn-outline-primary flex-shrink-0">
                {{ $t('businesses.viewStore') }} <i class="bi bi-arrow-left-short rtl-flip" />
              </span>
            </div>
          </NuxtLinkLocale>
        </div>
      </div>
    </div>

    <section v-if="relatedOffers.length" class="mb-4">
      <h3 class="fw-bold mb-3">{{ $t('businesses.offersIndex.moreFromStore') }}</h3>
      <div class="row g-3">
        <div v-for="item in relatedOffers" :key="item.id" class="col-md-6 col-lg-4">
          <BusinessOfferCard :offer="item" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { getOffer } from '@/api/offers'

definePageMeta({ layout: 'default' })

const { t, te } = useI18n()
const route = useRoute()
const { translateBusiness } = useBusinessName()

const offer = ref(null)
const relatedOffers = ref([])
const loading = ref(true)
const error = ref('')
const claiming = ref(false)
const claimed = ref(false)
const { requireAuth } = useRequireAuth()

function translateOffer(key) {
  if (key && te(key)) return t(key)
  return key || ''
}

function badgeLabel(badge) {
  const map = {
    flash: 'businesses.offerBadges.flash',
    weekly: 'businesses.offerBadges.weekly',
    exclusive: 'businesses.offerBadges.exclusive',
    bundle: 'businesses.offerBadges.bundle',
    clearance: 'businesses.offerBadges.clearance',
  }
  return map[badge] ? t(map[badge]) : badge
}

function formatPrice(amount, currency) {
  return `${Number(amount).toLocaleString()} ${currency}`
}

function expiresLabel(validUntil) {
  const diff = new Date(validUntil).getTime() - Date.now()
  const days = Math.ceil(diff / 86400000)
  if (days <= 0) return t('businesses.offerExpired')
  if (days === 1) return t('businesses.offerEndsToday')
  return t('businesses.offerEndsIn', { count: days })
}

async function loadOffer() {
  loading.value = true
  error.value = ''
  try {
    const res = await getOffer(route.params.id)
    const data = res.data || res
    offer.value = data
    relatedOffers.value = data.relatedOffers || []
  } catch (err) {
    error.value = err.message || t('businesses.offersIndex.notFound')
  } finally {
    loading.value = false
  }
}

async function onClaim() {
  if (!requireAuth()) return
  claiming.value = true
  try {
    await new Promise((r) => setTimeout(r, 400))
    claimed.value = true
  } finally {
    claiming.value = false
  }
}

onMounted(loadOffer)
</script>

<style scoped lang="scss">
.offer-detail__media {
  position: relative;
  border: 1px solid var(--es-border);
  border-radius: 16px;

  img {
    width: 100%;
    aspect-ratio: 16 / 10;
    object-fit: cover;
    display: block;
  }
}

.offer-detail__discount {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: #ef4444;
  color: #fff;
  font-weight: 800;
  font-size: 1rem;
  padding: 0.4rem 0.75rem;
  border-radius: 10px;
}

html[dir='rtl'] .offer-detail__discount {
  left: auto;
  right: 1rem;
}

.offer-detail__badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  color: #fff;

  &--flash { background: #ef4444; }
  &--weekly { background: #6366f1; }
  &--exclusive { background: #8b5cf6; }
  &--bundle { background: #f59e0b; }
  &--clearance { background: #64748b; }
}

html[dir='rtl'] .offer-detail__badge {
  right: auto;
  left: 1rem;
}

.offer-detail__featured {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #ef4444;
  margin-bottom: 0.5rem;
}

.offer-detail__sale {
  font-size: 2rem;
  font-weight: 800;
  color: var(--es-primary);
  margin-inline-end: 0.75rem;
}

.offer-detail__original {
  font-size: 1.1rem;
}

.offer-detail__expires {
  color: var(--es-text-muted);
  font-size: 0.95rem;
}

.store-mini {
  border: 1px solid var(--es-border);
  color: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: var(--es-primary);
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.12);
  }
}

.store-mini__logo {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
}

.rtl-flip {
  html[dir='rtl'] & {
    display: inline-block;
    transform: scaleX(-1);
  }
}
</style>
