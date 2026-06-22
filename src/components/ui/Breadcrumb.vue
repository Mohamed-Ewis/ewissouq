<template>
  <nav class="es-breadcrumb" :aria-label="ariaLabel || $t('common.breadcrumb')">
    <ol class="es-breadcrumb__list">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="es-breadcrumb__item"
        :class="{ 'is-active': isActive(item, index) }"
      >
        <i
          v-if="index > 0"
          class="es-breadcrumb__separator bi bi-chevron-right"
          aria-hidden="true"
        />

        <NuxtLinkLocale
          v-if="item.to && !isActive(item, index)"
          :to="item.to"
          class="es-breadcrumb__link"
        >
          <i v-if="item.icon" :class="[item.icon, 'es-breadcrumb__icon']" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </NuxtLinkLocale>

        <span v-else class="es-breadcrumb__current" :title="item.label">
          <i v-if="item.icon" :class="[item.icon, 'es-breadcrumb__icon']" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
    validator: (items) => items.every((item) => item && typeof item.label === 'string'),
  },
  ariaLabel: { type: String, default: '' },
})

function isActive(item, index) {
  return index === props.items.length - 1 || !item.to
}
</script>

<style scoped lang="scss">
.es-breadcrumb {
  margin-bottom: 1.25rem;
}

.es-breadcrumb__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0;
  list-style: none;
  margin: 0;
  padding: 0.65rem 1rem;
  background: var(--es-surface);
  border: 1px solid var(--es-border);
  border-radius: $border-radius-lg;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.es-breadcrumb__item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
  font-size: 0.875rem;
  line-height: 1.4;

  &.is-active {
    flex: 1 1 auto;
    min-width: 0;
  }
}

.es-breadcrumb__separator {
  color: var(--es-text-muted);
  font-size: 0.65rem;
  opacity: 0.7;
  flex-shrink: 0;
}

.es-breadcrumb__link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--es-text-muted);
  text-decoration: none;
  font-weight: 500;
  white-space: nowrap;
  transition: color $transition;

  &:hover {
    color: var(--es-primary);
  }
}

.es-breadcrumb__current {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
  color: var(--es-text);
  font-weight: 600;
  max-width: 100%;

  span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.es-breadcrumb__icon {
  font-size: 0.8rem;
  flex-shrink: 0;
}

html[dir='rtl'] {
  .es-breadcrumb__separator {
    transform: scaleX(-1);
  }
}
</style>
