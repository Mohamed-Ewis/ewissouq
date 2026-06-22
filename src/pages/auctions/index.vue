<template>
  <div class="auctions-page">
    <div class="page-header d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold mb-1"><i class="bi bi-hammer me-2 text-primary" />{{ $t('auctions.title') }}</h2>
        <p class="text-muted mb-0">{{ $t('auctions.subtitle') }}</p>
      </div>
    </div>

    <ul class="nav nav-pills mb-4 gap-2">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: tab === 'active' }" @click="tab = 'active'">{{ $t('auctions.active') }}</button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: tab === 'ended' }" @click="tab = 'ended'">{{ $t('auctions.ended') }}</button>
      </li>
    </ul>

    <div v-if="auctionsStore.loading" class="row g-3">
      <div v-for="i in 4" :key="i" class="col-md-6 col-lg-4">
        <UiSkeletonLoader type="card" />
      </div>
    </div>

    <div v-else-if="filteredAuctions.length" class="row g-3">
      <div v-for="auction in filteredAuctions" :key="auction.id" class="col-md-6 col-lg-4">
        <AuctionCard :auction="auction" />
      </div>
    </div>

    <UiEmptyState
      v-else
      icon="bi bi-hammer"
      :title="$t('auctions.noAuctions')"
      :description="tab === 'active' ? $t('auctions.noActive') : $t('auctions.noEnded')"
    />
  </div>
</template>

<script setup>
const auctionsStore = useAuctionsStore()
const tab = ref('active')

const filteredAuctions = computed(() =>
  tab.value === 'active' ? auctionsStore.activeAuctions : auctionsStore.endedAuctions,
)

onMounted(() => auctionsStore.fetchAuctions())
</script>

<style scoped lang="scss">
.nav-pills .nav-link {
  border-radius: $border-radius;
  color: var(--es-text-muted);
  &.active { background: var(--es-gradient); }
}
</style>
