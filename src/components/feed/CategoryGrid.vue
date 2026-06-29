<template>
  <section class="categories-section mb-4" :class="`categories-section--${variant}`">
    <div class="categories-section__head d-flex align-items-center justify-content-between mb-3">
      <h5 class="fw-bold mb-0">
        <i class="bi bi-grid me-2 text-primary" />{{ $t('categories.title') }}
      </h5>
      <NuxtLinkLocale v-if="showSeeAll" to="/search" class="categories-section__see-all">
        {{ $t('categories.seeAll') }}
        <i class="bi bi-arrow-right" />
      </NuxtLinkLocale>
    </div>
    <div class="categories-grid">
      <NuxtLinkLocale
        v-for="cat in categories"
        :key="cat.id"
        :to="`/search?category=${cat.id}`"
        class="category-card text-decoration-none"
      >
        <div class="cat-icon">
          <i :class="cat.icon || 'bi bi-tag'" />
        </div>
        <span class="cat-name">{{ translateCategory(cat) }}</span>
        <span v-if="cat.count" class="cat-count">{{ $t('common.items', { count: cat.count }) }}</span>
      </NuxtLinkLocale>
    </div>
  </section>
</template>

<script setup>
defineProps({
  categories: { type: Array, default: () => [] },
  variant: { type: String, default: 'sidebar' },
  showSeeAll: { type: Boolean, default: true },
})

const { translateCategory } = useCategoryName()
</script>

<style scoped lang="scss">
.categories-section__see-all {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--es-primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.categories-grid {
  display: grid;
  gap: 0.5rem;
}

.categories-section--sidebar .categories-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.categories-section--default .categories-grid,
.categories-section--home .categories-grid {
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  }
}

.categories-section--home .categories-grid {
  @media (min-width: 992px) {
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }
}

.category-card {
  @include card-base;
  @include card-hover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 0.35rem;
  padding: 0.75rem 0.5rem;
  min-height: 108px;
  height: 100%;
  color: var(--es-text);
  text-align: center;
  overflow: hidden;
}

.cat-icon {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 12px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--es-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
}

.cat-name {
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.3;
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  hyphens: auto;
}

.cat-count {
  font-size: 0.65rem;
  color: var(--es-text-muted);
  margin-top: auto;
  white-space: nowrap;
}
</style>
