<template>
  <div class="countdown-timer d-flex gap-2" :class="{ urgent: isUrgent }">
    <div v-for="(unit, key) in display" :key="key" class="time-unit text-center">
      <span class="time-value">{{ unit.value }}</span>
      <span class="time-label">{{ unit.label }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  endTime: { type: String, required: true },
})

const { t } = useI18n()

const remaining = ref(0)
let timer = null

const display = computed(() => {
  const ms = Math.max(0, remaining.value)
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return [
    { key: 'hrs', value: String(h).padStart(2, '0'), label: t('time.hrs') },
    { key: 'min', value: String(m).padStart(2, '0'), label: t('time.min') },
    { key: 'sec', value: String(s).padStart(2, '0'), label: t('time.sec') },
  ]
})

const isUrgent = computed(() => remaining.value < 3600000)

function tick() {
  remaining.value = new Date(props.endTime).getTime() - Date.now()
}

onMounted(() => {
  tick()
  timer = setInterval(tick, 1000)
})

onUnmounted(() => clearInterval(timer))
</script>

<style scoped lang="scss">
.countdown-timer {
  &.urgent .time-value { color: $danger; }
}

.time-unit {
  background: var(--es-surface-2);
  border-radius: 8px;
  padding: 0.35rem 0.5rem;
  min-width: 48px;
}

.time-value {
  display: block;
  font-weight: 700;
  font-size: 1rem;
  color: var(--es-primary);
  font-variant-numeric: tabular-nums;
}

.time-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  color: var(--es-text-muted);
}
</style>
