<template>
  <div class="error-state text-center py-5">
    <div class="error-icon mb-3">
      <i class="bi bi-exclamation-triangle" />
    </div>
    <h5 class="fw-semibold mb-2">{{ displayTitle }}</h5>
    <p class="text-muted mb-4">{{ displayMessage }}</p>
    <button v-if="retry" class="btn btn-primary" @click="$emit('retry')">
      <i class="bi bi-arrow-clockwise me-1" /> {{ $t('common.retry') }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: undefined },
  message: { type: String, default: undefined },
  retry: { type: Boolean, default: true },
})
defineEmits(['retry'])

const { t } = useI18n()

const displayTitle = computed(() => props.title ?? t('error.title'))
const displayMessage = computed(() => props.message ?? t('error.message'))
</script>

<style scoped lang="scss">
.error-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: $danger;
}
</style>
