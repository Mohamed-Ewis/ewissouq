<template>
  <div class="stories-bar mb-4">
    <div class="stories-scroll d-flex gap-3 overflow-auto pb-2">
      <button
        v-for="(story, index) in localStories"
        :key="story.id"
        type="button"
        class="story-item text-center flex-shrink-0"
        :class="{ viewed: story.viewed }"
        @click="openStory(index)"
      >
        <div class="story-ring">
          <img :src="story.avatar" :alt="story.userName" class="story-avatar" />
          <span v-if="hasVideo(story)" class="story-video-badge" aria-hidden="true">
            <i class="bi bi-play-fill" />
          </span>
        </div>
        <span class="story-name small">{{ firstName(story.userName) }}</span>
      </button>
    </div>

    <StoryViewer
      v-model="viewerOpen"
      :stories="localStories"
      :start-story-index="activeIndex"
      @viewed="onStoryViewed"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  stories: { type: Array, default: () => [] },
})

const localStories = ref([])
const viewerOpen = ref(false)
const activeIndex = ref(0)

watch(
  () => props.stories,
  (items) => {
    localStories.value = items.map((story) => ({ ...story }))
  },
  { immediate: true, deep: true },
)

function firstName(name) {
  return name?.split(' ')[0] || ''
}

function hasVideo(story) {
  return story.items?.some((item) => item.type === 'video')
}

function openStory(index) {
  activeIndex.value = index
  viewerOpen.value = true
}

function onStoryViewed(storyId) {
  const story = localStories.value.find((s) => s.id === storyId)
  if (story) story.viewed = true
}
</script>

<style scoped lang="scss">
.stories-scroll {
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.story-item {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  transition: transform $transition;

  &:hover {
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid var(--es-primary);
    outline-offset: 4px;
    border-radius: 12px;
  }
}

.story-ring {
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  padding: 3px;
  background: var(--es-gradient);
  margin: 0 auto 6px;
}

.story-item.viewed .story-ring {
  background: var(--es-border);
}

.story-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--es-surface);
}

.story-video-badge {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--es-primary);
  color: #fff;
  border: 2px solid var(--es-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  line-height: 1;
}

.story-name {
  display: block;
  max-width: 72px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--es-text-muted);
  font-weight: 500;
}
</style>
