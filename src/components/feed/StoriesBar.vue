<template>
  <div class="stories-bar mb-4">
    <div class="stories-scroll d-flex gap-3 overflow-auto pb-2">
      <div
        v-for="story in stories"
        :key="story.id"
        class="story-item text-center flex-shrink-0"
        :class="{ viewed: story.viewed }"
      >
        <div class="story-ring">
          <img :src="story.avatar" :alt="story.userName" class="story-avatar" />
        </div>
        <span class="story-name small">{{ story.userName.split(' ')[0] }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stories: { type: Array, default: () => [] },
})
</script>

<style scoped lang="scss">
.stories-scroll {
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

.story-ring {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  padding: 3px;
  background: var(--es-gradient);
  margin: 0 auto 4px;
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

.story-name {
  display: block;
  max-width: 68px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--es-text-muted);
}
</style>
