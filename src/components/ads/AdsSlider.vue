<template>
  <section
    v-if="ads.length"
    class="ads-slider"
    :class="`ads-slider--${variant}`"
    @mouseenter="pause"
    @mouseleave="resume"
    @focusin="pause"
    @focusout="resume"
  >
    <div class="ads-slider__label">
      <span class="ads-slider__sponsored">{{ $t('ads.sponsored') }}</span>
    </div>

    <div class="ads-slider__viewport">
      <Transition name="ads-fade" mode="out-in">
        <NuxtLinkLocale
          :key="activeAd.id"
          :to="activeAd.link"
          class="ads-slider__slide"
          :class="`ads-slider__slide--${activeAd.theme}`"
        >
          <img :src="activeAd.image" :alt="translateAd(activeAd.titleKey)" class="ads-slider__image" />
          <div class="ads-slider__overlay">
            <span v-if="activeAd.sponsorKey" class="ads-slider__sponsor">
              {{ translateAd(activeAd.sponsorKey) }}
            </span>
            <h3 class="ads-slider__title">{{ translateAd(activeAd.titleKey) }}</h3>
            <p v-if="variant === 'banner'" class="ads-slider__subtitle">
              {{ translateAd(activeAd.subtitleKey) }}
            </p>
            <span class="ads-slider__cta">
              {{ translateAd(activeAd.ctaKey) }}
              <i class="bi bi-arrow-left-short rtl-flip" />
            </span>
          </div>
        </NuxtLinkLocale>
      </Transition>

      <template v-if="ads.length > 1">
        <button
          type="button"
          class="ads-slider__nav ads-slider__nav--prev"
          :aria-label="$t('ads.previous')"
          @click.prevent="prev"
        >
          <i class="bi bi-chevron-left rtl-flip" />
        </button>
        <button
          type="button"
          class="ads-slider__nav ads-slider__nav--next"
          :aria-label="$t('ads.next')"
          @click.prevent="next"
        >
          <i class="bi bi-chevron-right rtl-flip" />
        </button>
      </template>
    </div>

    <div v-if="ads.length > 1" class="ads-slider__dots" role="tablist">
      <button
        v-for="(ad, index) in ads"
        :key="ad.id"
        type="button"
        class="ads-slider__dot"
        :class="{ active: index === current }"
        :aria-label="$t('ads.goToSlide', { number: index + 1 })"
        :aria-selected="index === current"
        role="tab"
        @click="goTo(index)"
      />
    </div>
  </section>
</template>

<script setup>
import { useIntervalFn } from '@vueuse/core'

const props = defineProps({
  ads: { type: Array, default: () => [] },
  variant: {
    type: String,
    default: 'banner',
    validator: (v) => ['banner', 'sidebar'].includes(v),
  },
  interval: { type: Number, default: 3500 },
})

const { t, te } = useI18n()

const current = ref(0)

const activeAd = computed(() => props.ads[current.value] || props.ads[0])

function translateAd(key) {
  if (key && te(key)) return t(key)
  return key || ''
}

function next() {
  current.value = (current.value + 1) % props.ads.length
}

function prev() {
  current.value = (current.value - 1 + props.ads.length) % props.ads.length
}

function goTo(index) {
  current.value = index
}

const { pause, resume } = useIntervalFn(
  () => {
    if (props.ads.length > 1) next()
  },
  () => props.interval,
  { immediate: true },
)

watch(
  () => props.ads.length,
  () => {
    if (current.value >= props.ads.length) current.value = 0
  },
)
</script>

<style scoped lang="scss">
.ads-slider {
  position: relative;
  margin-bottom: 1rem;
}

.ads-slider__label {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.35rem;
}

.ads-slider__sponsored {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--es-text-muted);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  background: var(--es-surface-2);
}

.ads-slider__viewport {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: var(--es-surface-2);
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.08);
}

.ads-slider--banner .ads-slider__viewport {
  aspect-ratio: 21 / 8;

  @media (min-width: 768px) {
    aspect-ratio: 21 / 7;
  }
}

.ads-slider--sidebar .ads-slider__viewport {
  aspect-ratio: 1/1;
  min-height: 200px;
}

.ads-slider__slide {
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  min-height: inherit;
  text-decoration: none;
  color: #fff;
}

.ads-slider__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ads-slider__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1rem;
  background: linear-gradient(180deg, transparent 25%, rgba(15, 23, 42, 0.88) 100%);
}

.ads-slider--sidebar .ads-slider__overlay {
  padding: 0.875rem;
}

.ads-slider__sponsor {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  opacity: 0.85;
  margin-bottom: 0.25rem;
}

.ads-slider__title {
  font-size: 1.1rem;
  font-weight: 800;
  line-height: 1.25;
  margin: 0 0 0.35rem;

  .ads-slider--banner & {
    @media (min-width: 768px) {
      font-size: 1.35rem;
    }
  }
}

.ads-slider__subtitle {
  font-size: 0.85rem;
  opacity: 0.9;
  margin: 0 0 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ads-slider__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  align-self: flex-start;
  transition: background 0.2s ease;
}

.ads-slider__slide:hover .ads-slider__cta {
  background: rgba(255, 255, 255, 0.35);
}

.ads-slider__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: var(--es-text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.2s ease, background 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  .ads-slider__viewport:hover &,
  .ads-slider__viewport:focus-within & {
    opacity: 1;
  }

  &:hover {
    background: #fff;
    color: var(--es-primary);
  }

  &--prev {
    left: 0.5rem;
  }

  &--next {
    right: 0.5rem;
  }
}

html[dir='rtl'] {
  .ads-slider__nav--prev {
    left: auto;
    right: 0.5rem;
  }

  .ads-slider__nav--next {
    right: auto;
    left: 0.5rem;
  }
}

.ads-slider__dots {
  display: flex;
  justify-content: center;
  gap: 0.4rem;
  margin-top: 0.65rem;
}

.ads-slider__dot {
  width: 6px;
  height: 6px;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: var(--es-border);
  cursor: pointer;
  transition: width 0.25s ease, background 0.25s ease;

  &.active {
    width: 20px;
    background: var(--es-primary);
  }
}

.ads-fade-enter-active,
.ads-fade-leave-active {
  transition: opacity 0.35s ease;
}

.ads-fade-enter-from,
.ads-fade-leave-to {
  opacity: 0;
}

.rtl-flip {
  html[dir='rtl'] & {
    display: inline-block;
    transform: scaleX(-1);
  }
}
</style>
