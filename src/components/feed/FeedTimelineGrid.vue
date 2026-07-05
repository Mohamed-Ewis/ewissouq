<template>
  <div class="bento-grid">
    <FeedPost
      v-for="(post, index) in posts"
      :key="post.id"
      :product="post"
      :variant="getSlot(index).variant"
      :span-class="getSlot(index).span"
    />
  </div>
</template>

<script setup>
defineProps({
  posts: { type: Array, default: () => [] },
})

/** 10-tile bento module — mirrors reference UX mix of squares, wides & talls */
const BENTO_PATTERN = [
  { variant: 'hero', span: 'bento-span-2x2' },
  { variant: 'tall', span: 'bento-span-1x2' },
  { variant: 'compact', span: 'bento-span-1x1' },
  { variant: 'compact', span: 'bento-span-1x1' },
  { variant: 'wide', span: 'bento-span-2x1' },
  { variant: 'standard', span: 'bento-span-1x1' },
  { variant: 'tall', span: 'bento-span-1x2' },
  { variant: 'standard', span: 'bento-span-1x1' },
  { variant: 'wide', span: 'bento-span-2x1' },
  { variant: 'standard', span: 'bento-span-1x1' },
]

function getSlot(index) {
  return BENTO_PATTERN[index % BENTO_PATTERN.length]
}
</script>

<style scoped lang="scss">
.bento-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;

  @media (min-width: 576px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: minmax(180px, auto);
    grid-auto-flow: dense;
    gap: 0.875rem;
  }

  @media (min-width: 992px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-auto-rows: minmax(200px, auto);
    gap: 1rem;
  }

  // Span utilities applied to FeedPost root via :deep
  :deep(.bento-span-2x2) {
    @media (min-width: 576px) {
      grid-column: span 2;
      grid-row: span 2;
    }
  }

  :deep(.bento-span-2x1) {
    @media (min-width: 576px) {
      grid-column: span 2;
    }
  }

  :deep(.bento-span-1x2) {
    @media (min-width: 576px) {
      grid-row: span 2;
    }
  }
}
</style>
