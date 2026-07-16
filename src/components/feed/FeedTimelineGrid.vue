<template>
  <div class="feed-grid">
    <FeedPost
      v-for="(post, index) in posts"
      :key="post.feedId || `${post.listingType || 'classified'}-${post.id}`"
      :product="post"
      :index="index"
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
  gap: 1rem;

  @media (min-width: 576px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.15rem;
  }
}
</style>
