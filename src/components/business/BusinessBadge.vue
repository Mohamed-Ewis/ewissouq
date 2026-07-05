<template>
  <span class="business-badge" :class="`business-badge--${tier}`">
    <i :class="tierIcon(tier)" />
    <span>{{ tierLabel(tier) }}</span>
  </span>
</template>

<script setup>
defineProps({
  tier: { type: String, default: 'basic' },
})

const { tierLabel, tierIcon } = useBusinessName()
</script>

<style scoped lang="scss">
.business-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  white-space: nowrap;

  &--basic {
    background: rgba(255, 255, 255, 0.22);
    color: #fff;
  }

  &--verified {
    background: rgba(59, 130, 246, 0.85);
    color: #fff;
  }

  &--premium {
    background: linear-gradient(135deg, #f59e0b, #ef4444);
    color: #fff;
  }
}
</style>
