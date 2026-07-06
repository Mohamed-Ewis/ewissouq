<template>
  <section v-if="offer" class="offer-hero mb-4">
    <NuxtLinkLocale :to="`/offers/${offer.id}`" class="offer-hero__inner text-decoration-none">
      <img :src="offer.image" class="offer-hero__bg" :alt="translateOffer(offer.titleKey)" />
      <div class="offer-hero__overlay">
        <div class="offer-hero__content">
          <span class="offer-hero__tag">{{ $t('businesses.featuredOffer') }}</span>
          <h2 class="offer-hero__title fw-bold">{{ translateOffer(offer.titleKey) }}</h2>
          <p class="offer-hero__desc">{{ translateOffer(offer.descKey) }}</p>
          <div class="d-flex flex-wrap align-items-center gap-3">
            <span class="offer-hero__discount">-{{ offer.discountPercent }}%</span>
            <div>
              <div class="offer-hero__price">{{ formatPrice(offer.salePrice, offer.currency) }}</div>
              <div class="offer-hero__was text-decoration-line-through opacity-75">
                {{ formatPrice(offer.originalPrice, offer.currency) }}
              </div>
            </div>
            <span class="btn btn-light btn-lg fw-semibold">
              {{ $t('businesses.offersIndex.viewDetails') }} <i class="bi bi-arrow-left-short rtl-flip ms-1" />
            </span>
          </div>
        </div>
      </div>
    </NuxtLinkLocale>
  </section>
</template>

<script setup>
defineProps({
  offer: { type: Object, default: null },
})

const { t, te } = useI18n()

function translateOffer(key) {
  if (key && te(key)) return t(key)
  return key || ''
}

function formatPrice(amount, currency) {
  return `${Number(amount).toLocaleString()} ${currency}`
}
</script>

<style scoped lang="scss">
.offer-hero__inner {
  position: relative;
  display: block;
  border-radius: 20px;
  overflow: hidden;
  min-height: 220px;
  color: #fff;

  @media (min-width: 768px) {
    min-height: 280px;
  }
}

.offer-hero__bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  inset: 0;
}

.offer-hero__overlay {
  position: relative;
  min-height: inherit;
  background: linear-gradient(105deg, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.5) 55%, transparent 100%);
  display: flex;
  align-items: center;
  padding: 2rem;
  color: #fff;
}

html[dir='rtl'] .offer-hero__overlay {
  background: linear-gradient(-105deg, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.5) 55%, transparent 100%);
}

.offer-hero__content {
  max-width: 520px;
}

.offer-hero__tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: #ef4444;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  margin-bottom: 0.75rem;
}

.offer-hero__title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
}

.offer-hero__desc {
  opacity: 0.9;
  margin-bottom: 1.25rem;
  font-size: 0.95rem;
}

.offer-hero__discount {
  font-size: 2rem;
  font-weight: 900;
  color: #fca5a5;
}

.offer-hero__price {
  font-size: 1.5rem;
  font-weight: 800;
}

.offer-hero__was {
  font-size: 0.9rem;
}

.rtl-flip {
  html[dir='rtl'] & {
    display: inline-block;
    transform: scaleX(-1);
  }
}
</style>
