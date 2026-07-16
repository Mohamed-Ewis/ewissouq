<template>
  <!-- Souqi: original EwiSSouq marketplace sprite (photo-head + tiny suited body) -->
  <div
    class="souqi"
    :class="[`souqi--${variant}`, { 'souqi--active': active }]"
    :style="spriteStyle"
    aria-hidden="true"
  >
    <div class="souqi__portal">
      <span class="souqi__portal-ring" />
      <span class="souqi__portal-ring souqi__portal-ring--2" />
      <img class="souqi__portal-face" :src="avatar" alt="" />
    </div>

    <div class="souqi__actor">
      <div class="souqi__bubble">{{ label }}</div>

      <div class="souqi__stage">
        <div class="souqi__arm souqi__arm--wave">
          <span class="souqi__hand" />
        </div>

        <div class="souqi__torso">
          <span class="souqi__scarf" />
          <span class="souqi__badge"><i :class="badgeIcon" /></span>
        </div>

        <div class="souqi__arm souqi__arm--idle" />

        <div class="souqi__legs">
          <span class="souqi__leg" />
          <span class="souqi__leg" />
        </div>

        <span class="souqi__shadow" />
      </div>

      <div class="souqi__head">
        <img :src="avatar" alt="" />
        <span class="souqi__ear souqi__ear--l" />
        <span class="souqi__ear souqi__ear--r" />
        <span class="souqi__spark" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  avatar: { type: String, required: true },
  label: { type: String, default: '' },
  variant: {
    type: String,
    default: 'classified',
    validator: (v) => ['classified', 'auction', 'offer'].includes(v),
  },
  active: { type: Boolean, default: false },
  delay: { type: String, default: '0s' },
  duration: { type: String, default: '7.5s' },
})

const badgeIcon = computed(() => {
  if (props.variant === 'auction') return 'bi bi-hammer'
  if (props.variant === 'offer') return 'bi bi-percent'
  return 'bi bi-shop'
})

const spriteStyle = computed(() => ({
  '--delay': props.delay,
  '--cycle': props.duration,
}))
</script>

<style scoped lang="scss">
.souqi {
  --skin: #efc2a4;
  --suit: #6366f1;
  --suit-deep: #4f46e5;
  --accent: #fbbf24;
  --delay: 0s;
  --cycle: 7.5s;

  position: absolute;
  bottom: 0.35rem;
  inset-inline-start: 0.5rem;
  width: 76px;
  height: 96px;
  z-index: 3;
  pointer-events: none;

  &--auction {
    --suit: #f59e0b;
    --suit-deep: #d97706;
    --accent: #fde68a;
  }

  &--offer {
    --suit: #ef4444;
    --suit-deep: #dc2626;
    --accent: #fecaca;
  }
}

.souqi__portal {
  position: absolute;
  left: 50%;
  bottom: 4px;
  width: 34px;
  height: 34px;
  margin-left: -17px;
  z-index: 1;
}

.souqi__portal-face {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.28);
  display: block;
}

.souqi__portal-ring {
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  opacity: 0;

  .souqi--active & {
    animation: portal-ping var(--cycle) ease-out infinite;
    animation-delay: var(--delay);
  }

  &--2 {
    inset: -10px;
    border-color: color-mix(in srgb, var(--suit) 55%, white);
    animation-delay: calc(var(--delay) + 0.4s);
  }
}

@keyframes portal-ping {
  0%,
  12% {
    opacity: 0;
    transform: scale(0.65);
  }
  18% {
    opacity: 0.85;
    transform: scale(1);
  }
  38% {
    opacity: 0;
    transform: scale(1.65);
  }
  100% {
    opacity: 0;
  }
}

.souqi__actor {
  position: absolute;
  left: 50%;
  bottom: 6px;
  width: 68px;
  margin-left: -34px;
  transform: translateY(30px) scale(0.15);
  opacity: 0;
  transform-origin: 50% 100%;
  z-index: 2;

  .souqi--active & {
    animation: souqi-rise var(--cycle) cubic-bezier(0.22, 1.35, 0.36, 1) infinite;
    animation-delay: var(--delay);
  }
}

@keyframes souqi-rise {
  0%,
  9% {
    opacity: 0;
    transform: translateY(30px) scale(0.15) rotate(-10deg);
  }
  17% {
    opacity: 1;
    transform: translateY(-8px) scale(1) rotate(0);
  }
  23% {
    transform: translateY(-18px) scale(1.08) rotate(4deg);
  }
  30% {
    transform: translateY(-12px) scale(1) rotate(-3deg);
  }
  46% {
    opacity: 1;
    transform: translateY(-14px) scale(1) rotate(2deg);
  }
  56%,
  100% {
    opacity: 0;
    transform: translateY(30px) scale(0.15) rotate(-10deg);
  }
}

.souqi__head {
  position: absolute;
  left: 50%;
  top: -4px;
  width: 46px;
  height: 46px;
  margin-left: -23px;
  z-index: 5;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    border: 3px solid #fff;
    box-shadow:
      0 8px 18px rgba(0, 0, 0, 0.3),
      0 0 0 3px color-mix(in srgb, var(--suit) 35%, transparent);
    display: block;
    background: #ddd;
  }
}

.souqi__ear {
  position: absolute;
  top: 15px;
  width: 11px;
  height: 13px;
  background: #fff;
  border-radius: 50%;
  box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--suit) 30%, transparent);

  &--l {
    left: -4px;
  }
  &--r {
    right: -4px;
  }
}

.souqi__spark {
  position: absolute;
  top: -5px;
  inset-inline-end: -3px;
  width: 11px;
  height: 11px;
  background: var(--accent);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  opacity: 0;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));

  .souqi--active & {
    animation: sparkle var(--cycle) ease-in-out infinite;
    animation-delay: var(--delay);
  }
}

@keyframes sparkle {
  0%,
  15%,
  52%,
  100% {
    opacity: 0;
    transform: scale(0.3) rotate(0);
  }
  22%,
  38% {
    opacity: 1;
    transform: scale(1.15) rotate(28deg);
  }
}

.souqi__stage {
  position: relative;
  margin-top: 36px;
  height: 44px;
}

.souqi__torso {
  position: absolute;
  left: 50%;
  top: 0;
  width: 30px;
  height: 28px;
  margin-left: -15px;
  background: linear-gradient(155deg, var(--suit), var(--suit-deep));
  border-radius: 14px 14px 11px 11px;
  box-shadow: inset 0 -4px 0 rgba(0, 0, 0, 0.14);
  z-index: 2;
}

.souqi__scarf {
  position: absolute;
  top: -4px;
  left: 50%;
  width: 24px;
  height: 9px;
  margin-left: -12px;
  background: var(--accent);
  border-radius: 5px;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
}

.souqi__badge {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 15px;
  height: 15px;
  border-radius: 5px;
  background: #fff;
  color: var(--suit-deep);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.55rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
}

.souqi__arm {
  position: absolute;
  top: 3px;
  width: 9px;
  height: 19px;
  background: var(--suit);
  border-radius: 7px;
  z-index: 1;

  &--idle {
    inset-inline-start: 9px;
    transform: rotate(16deg);
  }

  &--wave {
    inset-inline-end: 5px;
    z-index: 4;
    transform-origin: 50% 8%;
    background: linear-gradient(var(--suit), var(--suit-deep));

    .souqi--active & {
      animation: wave-hello 0.42s ease-in-out infinite alternate;
      animation-delay: calc(var(--delay) + 0.15s);
    }
  }
}

.souqi__hand {
  position: absolute;
  bottom: -7px;
  left: 50%;
  width: 12px;
  height: 12px;
  margin-left: -6px;
  background: var(--skin);
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
}

@keyframes wave-hello {
  from {
    transform: rotate(-28deg);
  }
  to {
    transform: rotate(48deg);
  }
}

.souqi__legs {
  position: absolute;
  left: 50%;
  bottom: 0;
  display: flex;
  gap: 7px;
  margin-left: -11px;
  z-index: 1;
}

.souqi__leg {
  width: 8px;
  height: 13px;
  background: var(--suit-deep);
  border-radius: 0 0 6px 6px;

  .souqi--active & {
    animation: hop-leg var(--cycle) ease-in-out infinite;
    animation-delay: var(--delay);
  }

  &:nth-child(2) {
    animation-delay: calc(var(--delay) + 0.14s);
  }
}

@keyframes hop-leg {
  0%,
  17%,
  48%,
  100% {
    transform: translateY(0);
  }
  25%,
  33% {
    transform: translateY(-4px);
  }
}

.souqi__shadow {
  position: absolute;
  left: 50%;
  bottom: -3px;
  width: 36px;
  height: 7px;
  margin-left: -18px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 50%;
  filter: blur(2px);
  z-index: 0;

  .souqi--active & {
    animation: shadow-pulse var(--cycle) ease-in-out infinite;
    animation-delay: var(--delay);
  }
}

@keyframes shadow-pulse {
  0%,
  9%,
  56%,
  100% {
    opacity: 0;
    transform: scaleX(0.35);
  }
  18%,
  46% {
    opacity: 1;
    transform: scaleX(1);
  }
}

.souqi__bubble {
  position: absolute;
  bottom: calc(100% + 2px);
  left: 50%;
  transform: translateX(-50%) scale(0.45);
  white-space: nowrap;
  font-size: 0.64rem;
  font-weight: 800;
  color: #0f172a;
  background: #fff;
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.22);
  opacity: 0;
  z-index: 6;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border: 5px solid transparent;
    border-top-color: #fff;
  }

  .souqi--active & {
    animation: bubble-say var(--cycle) ease-in-out infinite;
    animation-delay: var(--delay);
  }
}

@keyframes bubble-say {
  0%,
  14% {
    opacity: 0;
    transform: translateX(-50%) translateY(8px) scale(0.4);
  }
  22%,
  44% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
  54%,
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(6px) scale(0.4);
  }
}

@media (prefers-reduced-motion: reduce) {
  .souqi__actor,
  .souqi__arm--wave,
  .souqi__bubble,
  .souqi__portal-ring,
  .souqi__spark,
  .souqi__leg,
  .souqi__shadow {
    animation: none !important;
  }

  .souqi__actor {
    opacity: 0;
  }
}
</style>
