<template>
  <article class="offer-card" :class="{ 'offer-card--featured': offer.featured }">
    <div class="offer-card__media">
      <img :src="offer.image" :alt="translateOffer(offer.titleKey)" />
      <span class="offer-card__discount">-{{ offer.discountPercent }}%</span>
      <span class="offer-card__badge" :class="`offer-card__badge--${offer.badge}`">
        {{ badgeLabel(offer.badge) }}
      </span>
    </div>

    <div class="offer-card__body">
      <h3 class="offer-card__title fw-bold">{{ translateOffer(offer.titleKey) }}</h3>
      <p class="offer-card__desc small text-muted">{{ translateOffer(offer.descKey) }}</p>

      <div class="offer-card__pricing d-flex align-items-baseline gap-2 mb-2">
        <span class="offer-card__sale">{{ formatOfferPrice(offer.salePrice, offer.currency) }}</span>
        <span class="offer-card__original text-muted text-decoration-line-through small">
          {{ formatOfferPrice(offer.originalPrice, offer.currency) }}
        </span>
      </div>

      <div class="offer-card__footer d-flex align-items-center justify-content-between">
        <span class="offer-card__expires small">
          <i class="bi bi-clock" /> {{ expiresLabel(offer.validUntil) }}
        </span>
        <button type="button" class="btn btn-sm btn-primary" @click="$emit('claim', offer)">
          {{ $t('businesses.claimOffer') }}
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({
  offer: { type: Object, required: true },
})

defineEmits(['claim'])

const { t, te } = useI18n()

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

function formatOfferPrice(amount, currency) {
  return `${Number(amount).toLocaleString()} ${currency}`
}

function expiresLabel(validUntil) {
  const diff = new Date(validUntil).getTime() - Date.now()
  const days = Math.ceil(diff / 86400000)
  if (days <= 0) return t('businesses.offerExpired')
  if (days === 1) return t('businesses.offerEndsToday')
  return t('businesses.offerEndsIn', { count: days })
}
</script>

<style scoped lang="scss">
.offer-card {
  border: 1px solid var(--es-border);
  border-radius: 16px;
  overflow: hidden;
  background: var(--es-surface);
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 28px rgba(15, 23, 42, 0.1);
  }

  &--featured {
    border-color: rgba(239, 68, 68, 0.35);
  }
}

.offer-card__media {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--es-surface-2);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.offer-card__discount {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: #ef4444;
  color: #fff;
  font-weight: 800;
  font-size: 0.9rem;
  padding: 0.3rem 0.65rem;
  border-radius: 8px;
}

html[dir='rtl'] .offer-card__discount {
  left: auto;
  right: 0.75rem;
}

.offer-card__badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  color: #fff;

  &--flash { background: #ef4444; }
  &--weekly { background: #6366f1; }
  &--exclusive { background: #8b5cf6; }
  &--bundle { background: #f59e0b; }
  &--clearance { background: #64748b; }
}

html[dir='rtl'] .offer-card__badge {
  right: auto;
  left: 0.75rem;
}

.offer-card__body {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.offer-card__title {
  font-size: 1rem;
  line-height: 1.35;
  margin-bottom: 0.35rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.offer-card__desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.offer-card__sale {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--es-primary);
}

.offer-card__footer {
  margin-top: auto;
  padding-top: 0.5rem;
}

.offer-card__expires {
  color: var(--es-text-muted);
}
</style>
