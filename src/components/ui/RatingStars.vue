<template>
  <div class="rating-stars d-inline-flex align-items-center gap-1">
    <i
      v-for="i in 5"
      :key="i"
      class="bi"
      :class="i <= Math.round(rating) ? 'bi-star-fill text-warning' : 'bi-star text-muted'"
      style="font-size: 0.85rem"
    />
    <span v-if="showValue" class="small text-muted ms-1">{{ rating.toFixed(1) }}</span>
  </div>
</template>

<script setup>
defineProps({
  rating: { type: Number, default: 0 },
  showValue: { type: Boolean, default: true },
})
</script>
