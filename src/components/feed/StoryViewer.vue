<template>
  <Teleport to="body">
    <Transition name="story-fade">
      <div
        v-if="open"
        class="story-viewer"
        role="dialog"
        aria-modal="true"
        tabindex="0"
        ref="viewerRef"
        :aria-label="$t('stories.viewer')"
        @keydown.escape="close"
        @keydown.left="prevSlide"
        @keydown.right="nextSlide"
      >
        <div class="story-viewer__backdrop" @click="close" />

        <div class="story-viewer__frame">
          <div class="story-viewer__progress">
            <div
              v-for="(item, i) in currentStory?.items || []"
              :key="item.id"
              class="story-viewer__progress-track"
            >
              <div
                class="story-viewer__progress-fill"
                :class="{
                  done: i < slideIndex,
                  active: i === slideIndex,
                }"
                :style="i === slideIndex ? { width: `${progress}%` } : undefined"
              />
            </div>
          </div>

          <header class="story-viewer__header">
            <NuxtLinkLocale
              :to="`/profile/${currentStory?.userId}`"
              class="story-viewer__user text-decoration-none"
              @click="close"
            >
              <img :src="currentStory?.avatar" :alt="currentStory?.userName" class="story-viewer__avatar" />
              <div>
                <span class="story-viewer__name">{{ currentStory?.userName }}</span>
                <span class="story-viewer__time">{{ timeAgo(currentStory?.createdAt) }}</span>
              </div>
            </NuxtLinkLocale>
            <button type="button" class="story-viewer__close" :aria-label="$t('stories.close')" @click="close">
              <i class="bi bi-x-lg" />
            </button>
          </header>

          <div class="story-viewer__media">
            <img
              v-if="currentItem?.type === 'image'"
              :key="`img-${currentItem.id}`"
              :src="currentItem.url"
              :alt="currentStory?.userName"
              class="story-viewer__image"
            />
            <video
              v-else-if="currentItem?.type === 'video'"
              :key="`vid-${currentItem.id}`"
              ref="videoRef"
              :src="currentItem.url"
              class="story-viewer__video"
              playsinline
              muted
              autoplay
              @ended="onVideoEnded"
              @loadedmetadata="onVideoLoaded"
            />
          </div>

          <button type="button" class="story-viewer__tap story-viewer__tap--prev" :aria-label="$t('stories.previous')" @click="prevSlide" />
          <button type="button" class="story-viewer__tap story-viewer__tap--next" :aria-label="$t('stories.next')" @click="nextSlide" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  stories: { type: Array, default: () => [] },
  startStoryIndex: { type: Number, default: 0 },
})

const open = defineModel({ type: Boolean, default: false })

const emit = defineEmits(['viewed'])

const { timeAgo } = useFormatters()

const storyIndex = ref(0)
const slideIndex = ref(0)
const progress = ref(0)
const videoRef = ref(null)
const viewerRef = ref(null)

let timer = null
let raf = null
let slideStartedAt = 0
let slideDuration = 5000

const currentStory = computed(() => props.stories[storyIndex.value])
const currentItem = computed(() => currentStory.value?.items?.[slideIndex.value])

function clearTimers() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  if (raf) {
    cancelAnimationFrame(raf)
    raf = null
  }
}

function markViewed() {
  if (currentStory.value) {
    emit('viewed', currentStory.value.id)
  }
}

function close() {
  clearTimers()
  if (videoRef.value) {
    videoRef.value.pause()
  }
  open.value = false
}

function startProgress(duration) {
  clearTimers()
  slideDuration = duration
  slideStartedAt = performance.now()
  progress.value = 0

  const tick = (now) => {
    const elapsed = now - slideStartedAt
    progress.value = Math.min(100, (elapsed / slideDuration) * 100)
    if (elapsed >= slideDuration) {
      nextSlide()
      return
    }
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
}

function playCurrentSlide() {
  const item = currentItem.value
  if (!item) {
    close()
    return
  }

  markViewed()

  if (item.type === 'video') {
    progress.value = 0
    nextTick(() => {
      const video = videoRef.value
      if (video) {
        video.currentTime = 0
        video.play().catch(() => {
          startProgress(item.duration || 12000)
        })
      }
    })
  } else {
    startProgress(item.duration || 5000)
  }
}

function onVideoLoaded() {
  const video = videoRef.value
  if (!video || currentItem.value?.type !== 'video') return
  const duration = (video.duration && Number.isFinite(video.duration) ? video.duration * 1000 : currentItem.value.duration) || 12000
  startProgress(duration)
}

function onVideoEnded() {
  nextSlide()
}

function goToSlide(storyIdx, slideIdx) {
  if (storyIdx < 0 || storyIdx >= props.stories.length) {
    close()
    return
  }
  storyIndex.value = storyIdx
  slideIndex.value = slideIdx
  playCurrentSlide()
}

function nextSlide() {
  clearTimers()
  const items = currentStory.value?.items || []
  if (slideIndex.value < items.length - 1) {
    slideIndex.value += 1
    playCurrentSlide()
    return
  }
  if (storyIndex.value < props.stories.length - 1) {
    goToSlide(storyIndex.value + 1, 0)
    return
  }
  close()
}

function prevSlide() {
  clearTimers()
  if (slideIndex.value > 0) {
    slideIndex.value -= 1
    playCurrentSlide()
    return
  }
  if (storyIndex.value > 0) {
    const prevStory = props.stories[storyIndex.value - 1]
    goToSlide(storyIndex.value - 1, Math.max(0, (prevStory?.items?.length || 1) - 1))
  }
}

watch(open, (isOpen) => {
  if (isOpen) {
    storyIndex.value = props.startStoryIndex
    slideIndex.value = 0
    nextTick(() => {
      viewerRef.value?.focus()
      playCurrentSlide()
    })
  } else {
    clearTimers()
  }
})

onBeforeUnmount(clearTimers)
</script>

<style scoped lang="scss">
.story-viewer {
  position: fixed;
  inset: 0;
  z-index: 1060;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.story-viewer__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);
}

.story-viewer__frame {
  position: relative;
  width: min(420px, 100%);
  height: min(90vh, 760px);
  border-radius: $border-radius-lg;
  overflow: hidden;
  background: #000;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.45);
  z-index: 1;
}

.story-viewer__progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 3;
  display: flex;
  gap: 4px;
  padding: 0.75rem 0.75rem 0;
}

.story-viewer__progress-track {
  flex: 1;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.story-viewer__progress-fill {
  height: 100%;
  width: 0;
  background: #fff;
  border-radius: 2px;
  transition: width 0.05s linear;

  &.done {
    width: 100%;
  }

  &.active {
    width: 0;
  }
}

.story-viewer__header {
  position: absolute;
  top: 1.25rem;
  left: 0;
  right: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.75rem;
}

.story-viewer__user {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #fff;
  min-width: 0;
}

.story-viewer__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.8);
  flex-shrink: 0;
}

.story-viewer__name {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.2;
}

.story-viewer__time {
  display: block;
  font-size: 0.7rem;
  opacity: 0.8;
}

.story-viewer__close {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background $transition;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
}

.story-viewer__media {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #111;
}

.story-viewer__image,
.story-viewer__video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.story-viewer__tap {
  position: absolute;
  top: 4rem;
  bottom: 0;
  width: 35%;
  border: none;
  background: transparent;
  cursor: pointer;
  z-index: 2;

  &--prev { left: 0; }
  &--next { right: 0; }
}

.story-fade-enter-active,
.story-fade-leave-active {
  transition: opacity 0.25s ease;
}

.story-fade-enter-from,
.story-fade-leave-to {
  opacity: 0;
}
</style>
