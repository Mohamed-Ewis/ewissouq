<template>
  <NuxtLinkLocale :to="`/auctions/${auction.id}`" class="auction-card card h-100 text-decoration-none animate-fade-in">
    <div class="auction-img position-relative">
      <img :src="auction.images[0]" :alt="auction.title" class="card-img-top" />
      <span class="auction-status" :class="auction.status">{{ statusLabel }}</span>
    </div>
    <div class="card-body">
      <h6 class="fw-semibold text-truncate mb-2">{{ auction.title }}</h6>
      <div class="d-flex justify-content-between mb-2">
        <div>
          <small class="text-muted d-block">{{ $t('auctions.currentBid') }}</small>
          <span class="fw-bold text-primary">{{ formatPrice(auction.currentBid) }}</span>
        </div>
        <div class="text-end">
          <small class="text-muted d-block">{{ $t('auctions.bidders') }}</small>
          <span class="fw-semibold"><i class="bi bi-people" /> {{ auction.biddersCount }}</span>
        </div>
      </div>
      <CountdownTimer v-if="auction.status === 'active'" :end-time="auction.endTime" />
      <span v-else class="badge bg-secondary">{{ $t('auctions.ended') }}</span>
    </div>
  </NuxtLinkLocale>
</template>

<script setup>
const props = defineProps({
  auction: { type: Object, required: true },
})

const { t } = useI18n()
const { formatPrice } = useFormatters()

const statusLabel = computed(() =>
  props.auction.status === 'active' ? t('auctions.statusActive') : t('auctions.statusEnded'),
)
</script>

<style scoped lang="scss">
.auction-card {
  @include card-hover;
  color: var(--es-text);
  overflow: hidden;
}

.auction-img {
  aspect-ratio: 16/10;
  overflow: hidden;

  img { width: 100%; height: 100%; object-fit: cover; }
}

.auction-status {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 0.7rem;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  text-transform: uppercase;
  font-weight: 700;

  &.active { background: $success; color: #fff; }
  &.ended { background: var(--es-text-muted); color: #fff; }
}
</style>
