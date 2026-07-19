<template>
  <!--
    رسميا (Resmia): EwiSSouq's official feed sprite.
    One photo-head only — lies flat, stands up from that head, then dances.
  -->
  <div
    class="resmia"
    :class="[`resmia--${variant}`, { 'resmia--active': active }]"
    :style="spriteStyle"
    aria-hidden="true"
  >
    <div class="resmia__actor">
      <div class="resmia__bubble">{{ label }}</div>

      <!-- Body unfolds from under the head (starts collapsed / “lying”) -->
      <div class="resmia__figure">
        <div class="resmia__head">
          <img :src="avatar" alt="" />
          <span class="resmia__spark" />
        </div>

        <div class="resmia__body">
          <div class="resmia__arm resmia__arm--wave">
            <span class="resmia__hand" />
          </div>
          <div class="resmia__torso">
            <span class="resmia__scarf" />
            <span class="resmia__badge"><i :class="badgeIcon" /></span>
          </div>
          <div class="resmia__arm resmia__arm--idle" />
          <div class="resmia__legs">
            <span class="resmia__leg" />
            <span class="resmia__leg" />
          </div>
        </div>
      </div>

      <span class="resmia__shadow" />
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
  duration: { type: String, default: '8s' },
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
.resmia {
  --skin: #efc2a4;
  --suit: #6366f1;
  --suit-deep: #4f46e5;
  --accent: #fbbf24;
  --delay: 0s;
  --cycle: 8s;

  position: absolute;
  bottom: 0.45rem;
  inset-inline-start: 0.55rem;
  width: 78px;
  height: 100px;
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

.resmia__actor {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 72px;
  margin-left: -36px;
  opacity: 0;
  transform-origin: 50% 100%;
  z-index: 2;

  .resmia--active & {
    animation: resmia-presence var(--cycle) ease-in-out infinite;
    animation-delay: var(--delay);
  }
}

/* Whole actor: invisible → stand → dance → leave */
@keyframes resmia-presence {
  0%,
  8% {
    opacity: 0;
    transform: translateY(8px) scale(0.55);
  }
  14% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  52% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  60%,
  100% {
    opacity: 0;
    transform: translateY(10px) scale(0.5);
  }
}

.resmia__figure {
  position: relative;
  height: 86px;
  transform-origin: 50% 12%; /* pivot at head — body unfolds down like standing from lie */

  .resmia--active & {
    animation: resmia-standup var(--cycle) cubic-bezier(0.34, 1.45, 0.64, 1) infinite;
    animation-delay: var(--delay);
  }
}

/*
  Lying = body flattened under head (scaleY ~0).
  Standing = full body.
  Dance = gentle bounce + sway while upright.
*/
@keyframes resmia-standup {
  0%,
  8% {
    transform: rotate(-78deg) scaleY(0.15) scaleX(0.9);
  }
  16% {
    transform: rotate(-20deg) scaleY(0.7) scaleX(1);
  }
  22% {
    transform: rotate(0deg) scaleY(1) scaleX(1);
  }
  /* dance */
  28% {
    transform: rotate(-6deg) translateY(-3px) scaleY(1);
  }
  34% {
    transform: rotate(6deg) translateY(0) scaleY(0.96);
  }
  40% {
    transform: rotate(-5deg) translateY(-4px) scaleY(1.02);
  }
  46% {
    transform: rotate(4deg) translateY(0) scaleY(1);
  }
  52% {
    transform: rotate(0deg) scaleY(1);
  }
  /* lie back / tuck into head */
  58% {
    transform: rotate(-55deg) scaleY(0.25) scaleX(0.95);
  }
  62%,
  100% {
    transform: rotate(-78deg) scaleY(0.12) scaleX(0.9);
  }
}

.resmia__head {
  position: absolute;
  left: 50%;
  top: 0;
  width: 42px;
  height: 42px;
  margin-left: -21px;
  z-index: 5;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    border: 3px solid #fff;
    box-shadow:
      0 6px 14px rgba(0, 0, 0, 0.28),
      0 0 0 2px color-mix(in srgb, var(--suit) 40%, transparent);
    display: block;
    background: #ddd;
  }
}

.resmia__spark {
  position: absolute;
  top: -4px;
  inset-inline-end: -2px;
  width: 10px;
  height: 10px;
  background: var(--accent);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  opacity: 0;

  .resmia--active & {
    animation: sparkle var(--cycle) ease-in-out infinite;
    animation-delay: var(--delay);
  }
}

@keyframes sparkle {
  0%,
  20%,
  55%,
  100% {
    opacity: 0;
    transform: scale(0.3) rotate(0);
  }
  26%,
  42% {
    opacity: 1;
    transform: scale(1.1) rotate(20deg);
  }
}

.resmia__body {
  position: absolute;
  left: 50%;
  top: 36px;
  width: 56px;
  height: 48px;
  margin-left: -28px;
  transform-origin: 50% 0%;
}

.resmia__torso {
  position: absolute;
  left: 50%;
  top: 0;
  width: 28px;
  height: 26px;
  margin-left: -14px;
  background: linear-gradient(155deg, var(--suit), var(--suit-deep));
  border-radius: 13px 13px 10px 10px;
  box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.14);
  z-index: 2;
}

.resmia__scarf {
  position: absolute;
  top: -3px;
  left: 50%;
  width: 22px;
  height: 8px;
  margin-left: -11px;
  background: var(--accent);
  border-radius: 4px;
}

.resmia__badge {
  position: absolute;
  bottom: 3px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 14px;
  border-radius: 4px;
  background: #fff;
  color: var(--suit-deep);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.52rem;
}

.resmia__arm {
  position: absolute;
  top: 2px;
  width: 8px;
  height: 17px;
  background: var(--suit);
  border-radius: 6px;
  z-index: 1;

  &--idle {
    inset-inline-start: 8px;
    transform: rotate(14deg);
  }

  &--wave {
    inset-inline-end: 6px;
    z-index: 4;
    transform-origin: 50% 8%;
    background: linear-gradient(var(--suit), var(--suit-deep));

    .resmia--active & {
      animation: wave-dance 0.38s ease-in-out infinite alternate;
      animation-delay: calc(var(--delay) + 0.2s);
    }
  }
}

.resmia__hand {
  position: absolute;
  bottom: -6px;
  left: 50%;
  width: 11px;
  height: 11px;
  margin-left: -5.5px;
  background: var(--skin);
  border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

@keyframes wave-dance {
  from {
    transform: rotate(-32deg);
  }
  to {
    transform: rotate(52deg);
  }
}

.resmia__legs {
  position: absolute;
  left: 50%;
  bottom: 0;
  display: flex;
  gap: 6px;
  margin-left: -10px;
  z-index: 1;
}

.resmia__leg {
  width: 7px;
  height: 12px;
  background: var(--suit-deep);
  border-radius: 0 0 5px 5px;

  .resmia--active & {
    animation: foot-tap var(--cycle) ease-in-out infinite;
    animation-delay: var(--delay);
  }

  &:nth-child(2) {
    animation-delay: calc(var(--delay) + 0.12s);
  }
}

@keyframes foot-tap {
  0%,
  20%,
  55%,
  100% {
    transform: translateY(0);
  }
  26%,
  32%,
  38%,
  44% {
    transform: translateY(0);
  }
  28%,
  36%,
  42% {
    transform: translateY(-3px);
  }
}

.resmia__shadow {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 34px;
  height: 6px;
  margin-left: -17px;
  background: rgba(0, 0, 0, 0.22);
  border-radius: 50%;
  filter: blur(2px);
  z-index: 0;
  opacity: 0;

  .resmia--active & {
    animation: shadow-in var(--cycle) ease-in-out infinite;
    animation-delay: var(--delay);
  }
}

@keyframes shadow-in {
  0%,
  10%,
  58%,
  100% {
    opacity: 0;
    transform: scaleX(0.3);
  }
  20%,
  50% {
    opacity: 1;
    transform: scaleX(1);
  }
}

.resmia__bubble {
  position: absolute;
  bottom: calc(100% - 4px);
  left: 50%;
  transform: translateX(-50%) scale(0.4);
  white-space: nowrap;
  font-size: 0.62rem;
  font-weight: 800;
  color: #0f172a;
  background: #fff;
  padding: 0.28rem 0.55rem;
  border-radius: 999px;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.2);
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

  .resmia--active & {
    animation: bubble-say var(--cycle) ease-in-out infinite;
    animation-delay: var(--delay);
  }
}

@keyframes bubble-say {
  0%,
  18% {
    opacity: 0;
    transform: translateX(-50%) translateY(8px) scale(0.4);
  }
  24%,
  48% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
  56%,
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(6px) scale(0.4);
  }
}

@media (prefers-reduced-motion: reduce) {
  .resmia__actor,
  .resmia__figure,
  .resmia__arm--wave,
  .resmia__bubble,
  .resmia__spark,
  .resmia__leg,
  .resmia__shadow {
    animation: none !important;
  }

  .resmia__actor {
    opacity: 0;
  }
}
</style>
