<template>
  <div class="empty-state text-center py-5">
    <div class="empty-icon mb-3">
      <i :class="icon" />
    </div>
    <h5 class="fw-semibold mb-2">{{ displayTitle }}</h5>
    <p class="text-muted mb-4">{{ displayDescription }}</p>
    <slot name="action" />
  </div>
</template>

<script setup>
const props = defineProps({
  icon: { type: String, default: 'bi bi-inbox' },
  title: { type: String, default: undefined },
  description: { type: String, default: undefined },
})

const { t } = useI18n()

const displayTitle = computed(() => props.title ?? t('empty.title'))
const displayDescription = computed(() => props.description ?? t('empty.description'))
</script>

<style scoped lang="scss">
.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  border-radius: 50%;
  background: var(--es-surface-2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--es-text-muted);
}
</style>
