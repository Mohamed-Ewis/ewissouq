<template>
  <div v-if="auctionsStore.loading" class="py-5">
    <UiSkeletonLoader height="400px" />
  </div>

  <div v-else-if="auction" class="auction-detail-page">
    <Breadcrumb :items="breadcrumbItems" />

    <div class="row g-4">
      <div class="col-lg-7">
        <div class="card overflow-hidden">
          <img :src="auction.images[0]" class="w-100 detail-img" :alt="auction.title" />
        </div>
        <div class="card p-4 mt-4">
          <h5 class="fw-bold mb-3">{{ $t('product.description') }}</h5>
          <p class="text-muted">{{ auction.description }}</p>
        </div>
      </div>

      <div class="col-lg-5">
        <div class="card p-4 sticky-top" style="top: 100px">
          <span class="badge mb-2" :class="auction.status === 'active' ? 'bg-success' : 'bg-secondary'">
            {{ statusLabel }}
          </span>
          <h3 class="fw-bold mb-3">{{ auction.title }}</h3>

          <div class="bid-info p-3 rounded mb-3" style="background: var(--es-surface-2)">
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">{{ $t('auctions.currentBid') }}</span>
              <span class="fw-bold fs-4 text-primary">{{ formatPrice(auction.currentBid) }}</span>
            </div>
            <div class="d-flex justify-content-between small text-muted">
              <span>{{ $t('auctions.starting', { amount: formatPrice(auction.startingBid) }) }}</span>
              <span><i class="bi bi-people" /> {{ $t('auctions.biddersCount', { count: auction.biddersCount }) }}</span>
            </div>
          </div>

          <div v-if="auction.status === 'active'" class="mb-4">
            <label class="form-label small fw-semibold">{{ $t('auctions.timeRemaining') }}</label>
            <CountdownTimer :end-time="auction.endTime" />
          </div>

          <BidForm
            v-if="auction.status === 'active'"
            :auction="auction"
            :loading="auctionsStore.bidding"
            @bid="placeBid"
          />

          <div v-if="bidError" class="alert alert-danger mt-3 small">{{ bidError }}</div>
          <div v-if="bidSuccess" class="alert alert-success mt-3 small">{{ $t('auctions.bidSuccess') }}</div>

          <hr class="my-4" />

          <h6 class="fw-bold mb-3">{{ $t('auctions.bidHistory') }}</h6>
          <div v-if="auction.bids?.length" class="bid-history">
            <div v-for="bid in auction.bids" :key="bid.id" class="d-flex justify-content-between py-2 border-bottom">
              <span class="small">{{ bid.userName }}</span>
              <span class="small fw-bold text-primary">{{ formatPrice(bid.amount) }}</span>
            </div>
          </div>
          <p v-else class="text-muted small">{{ $t('auctions.noBids') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { t } = useI18n()
const { formatPrice } = useFormatters()
const auctionsStore = useAuctionsStore()
const bidError = ref('')
const bidSuccess = ref(false)

const auction = computed(() => auctionsStore.currentAuction)

const statusLabel = computed(() =>
  auction.value?.status === 'active' ? t('auctions.statusActive') : t('auctions.statusEnded'),
)

const breadcrumbItems = computed(() => [
  { to: '/', label: t('nav.home'), icon: 'bi bi-house' },
  { to: '/auctions', label: t('nav.auctions') },
  { label: auction.value?.title || '' },
])

async function placeBid(amount) {
  bidError.value = ''
  bidSuccess.value = false
  try {
    await auctionsStore.bid(route.params.id, amount)
    bidSuccess.value = true
  } catch (err) {
    bidError.value = err.message
  }
}

onMounted(() => auctionsStore.fetchAuction(route.params.id))
</script>

<style scoped lang="scss">
.detail-img { max-height: 480px; object-fit: cover; }
</style>
