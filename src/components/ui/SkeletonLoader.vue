<template>
  <div class="skeleton-loader">
    <div v-if="type === 'card'" class="skeleton-card">
      <div class="skeleton skeleton-img" />
      <div class="skeleton skeleton-line w-75 mt-3" />
      <div class="skeleton skeleton-line w-50 mt-2" />
      <div class="skeleton skeleton-line w-25 mt-2" />
    </div>
    <div v-else-if="type === 'list'" class="d-flex gap-3 mb-3">
      <div class="skeleton skeleton-avatar" />
      <div class="flex-grow-1">
        <div class="skeleton skeleton-line w-50" />
        <div class="skeleton skeleton-line w-75 mt-2" />
      </div>
    </div>
    <div v-else class="skeleton skeleton-block" :style="{ height: height }" />
  </div>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'block' },
  height: { type: String, default: '120px' },
})
</script>

<style scoped lang="scss">
.skeleton-img { height: 180px; border-radius: 12px; }
.skeleton-line { height: 14px; border-radius: 6px; }
.skeleton-avatar { width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0; }
.skeleton-block { border-radius: 12px; }
</style>
