<template>
  <span v-if="verified" class="badge-verified d-inline-flex align-items-center gap-1">
    <i class="bi bi-patch-check-fill" />
    <span v-if="showLabel">{{ $t('user.verified') }}</span>
  </span>
</template>

<script setup>
defineProps({
  verified: { type: Boolean, default: false },
  showLabel: { type: Boolean, default: false },
})
</script>
