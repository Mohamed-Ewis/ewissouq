<template>
  <div class="feed-shuffle-grid">
    <FeedPost
      v-for="(post, index) in posts"
      :key="post.id"
      :product="post"
      :variant="getVariant(index)"
    />
  </div>
</template>

<script setup>
defineProps({
  posts: { type: Array, default: () => [] },
})

const PATTERN = ['wide', 'tall', 'compact', 'compact', 'wide']

function getVariant(index) {
  return PATTERN[index % PATTERN.length]
}
</script>

<style scoped lang="scss">
.feed-shuffle-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-flow: dense;
    gap: 1.25rem;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
