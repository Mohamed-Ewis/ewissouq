<template>
  <div class="feed-grid">
    <FeedPost
      v-for="post in posts"
      :key="post.feedId || `${post.listingType || 'classified'}-${post.id}`"
      :product="post"
    />
  </div>
</template>

<script setup>
defineProps({
  posts: { type: Array, default: () => [] },
})
</script>

<style scoped lang="scss">
.feed-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.85rem;

  @media (min-width: 576px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
}
</style>
