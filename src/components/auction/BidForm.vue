<template>
  <div class="bid-form">
    <div class="input-group">
      <span class="input-group-text">{{ $t('currency.code') }}</span>
      <input
        v-model.number="bidAmount"
        type="number"
        class="form-control"
        :min="minBid"
        :placeholder="t('auctions.minPlaceholder', { amount: minBid.toLocaleString() })"
      />
      <button class="btn btn-primary" :disabled="loading || !isValid" @click="submitBid">
        <span v-if="loading" class="spinner-border spinner-border-sm" />
        <span v-else>{{ $t('auctions.placeBid') }}</span>
      </button>
    </div>
    <small v-if="error" class="text-danger mt-1 d-block">{{ error }}</small>
    <small class="text-muted mt-1 d-block">
      {{ $t('auctions.minBid', { amount: formatPrice(minBid) }) }}
    </small>
  </div>
</template>

<script setup>
const props = defineProps({
  auction: { type: Object, required: true },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['bid'])

const { t } = useI18n()
const { formatPrice } = useFormatters()

const bidAmount = ref(null)
const error = ref('')

const minBid = computed(() => props.auction.currentBid + (props.auction.bidIncrement || 50))
const isValid = computed(() => bidAmount.value && bidAmount.value >= minBid.value)

function submitBid() {
  error.value = ''
  if (!isValid.value) {
    error.value = t('auctions.bidTooLow', { amount: formatPrice(minBid.value) })
    return
  }
  emit('bid', bidAmount.value)
}
</script>
