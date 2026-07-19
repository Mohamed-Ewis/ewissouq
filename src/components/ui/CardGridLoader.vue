<template>
  <div class="card-grid-loader" :class="`card-grid-loader--${columns}`">
    <div
      v-for="i in count"
      :key="i"
      class="card-grid-loader__item"
      :style="{ '--enter-delay': `${((i - 1) % 6) * 0.07}s` }"
    >
      <div class="card-grid-loader__media shimmer" />
      <div class="card-grid-loader__body">
        <div class="card-grid-loader__line shimmer" style="width: 78%" />
        <div class="card-grid-loader__line shimmer card-grid-loader__line--sm" style="width: 52%" />
        <div class="card-grid-loader__meta">
          <span class="card-grid-loader__avatar shimmer" />
          <span class="card-grid-loader__line shimmer card-grid-loader__line--sm" style="width: 36%" />
          <span class="card-grid-loader__line shimmer card-grid-loader__line--price" style="width: 28%" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: { type: Number, default: 6 },
  /** Approximate grid density: 2 | 3 | 4 */
  columns: {
    type: [Number, String],
    default: 3,
    validator: (v) => [2, 3, 4, '2', '3', '4'].includes(v),
  },
})
</script>

<style scoped lang="scss">
.card-grid-loader {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 576px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &--3 {
    @media (min-width: 992px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  &--4 {
    @media (min-width: 768px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    @media (min-width: 1200px) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  &--2 {
    @media (min-width: 576px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}

.card-grid-loader__item {
  border: 1px solid var(--es-border);
  border-radius: 16px;
  overflow: hidden;
  background: var(--es-surface);
  opacity: 0;
  transform: translateY(12px);
  animation: skel-enter 0.5s ease forwards;
  animation-delay: var(--enter-delay, 0s);
}

@keyframes skel-enter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-grid-loader__media {
  aspect-ratio: 16 / 11;
  background: var(--es-surface-2);
}

.card-grid-loader__body {
  padding: 0.9rem 1rem 1.05rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.card-grid-loader__line {
  height: 12px;
  border-radius: 6px;
  background: var(--es-surface-2);

  &--sm {
    height: 10px;
  }

  &--price {
    margin-inline-start: auto;
    height: 14px;
  }
}

.card-grid-loader__meta {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 0.25rem;
}

.card-grid-loader__avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--es-surface-2);
}

.shimmer {
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.35) 50%,
      transparent 100%
    );
    transform: translateX(-100%);
    animation: shimmer-move 1.35s ease-in-out infinite;
  }
}

@keyframes shimmer-move {
  100% {
    transform: translateX(100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .card-grid-loader__item,
  .shimmer::after {
    animation: none !important;
  }

  .card-grid-loader__item {
    opacity: 1;
    transform: none;
  }
}
</style>
