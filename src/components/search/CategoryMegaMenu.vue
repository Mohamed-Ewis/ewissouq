<template>
  <section class="category-mega card mb-4">
    <div class="category-mega__tabs">
      <button
        v-for="root in tree"
        :key="root.id"
        type="button"
        class="category-mega__tab"
        :class="{ active: activeRootId === root.id }"
        @click="selectRoot(root.id)"
      >
        {{ translateCategory(root) }}
      </button>
    </div>

    <div v-if="activeRoot" class="category-mega__body">
      <div class="category-mega__col category-mega__col--subs">
        <button
          v-for="sub in activeRoot.children || []"
          :key="sub.id"
          type="button"
          class="category-mega__sub"
          :class="{ active: activeSubId === sub.id }"
          @click="selectSub(sub)"
        >
          <span class="category-mega__sub-label">{{ translateCategory(sub) }}</span>
          <i v-if="sub.children?.length" class="bi bi-chevron-left category-mega__chevron" />
        </button>
      </div>

      <div class="category-mega__col category-mega__col--items">
        <div class="category-mega__items-header">
          <h6 class="fw-bold mb-0">{{ activeSub ? translateCategory(activeSub) : translateCategory(activeRoot) }}</h6>
          <NuxtLinkLocale
            v-if="activeSub || activeRoot"
            :to="seeAllLink"
            class="category-mega__see-all"
          >
            {{ $t('categories.seeAll') }}
          </NuxtLinkLocale>
        </div>

        <div v-if="activeItems.length" class="category-mega__grid">
          <NuxtLinkLocale
            v-for="item in activeItems"
            :key="item.id"
            :to="`/search?category=${item.id}`"
            class="category-mega__link"
            @click="onSelect(item.id)"
          >
            {{ translateCategory(item) }}
            <i v-if="item.children?.length" class="bi bi-chevron-left category-mega__chevron-sm" />
          </NuxtLinkLocale>
        </div>

        <p v-else class="text-muted small mb-0 py-3">
          {{ $t('categories.browseRoot', { name: translateCategory(activeRoot) }) }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  tree: { type: Array, default: () => [] },
  modelValue: { type: [String, Number], default: '' },
})

const emit = defineEmits(['update:modelValue', 'select'])

const { translateCategory } = useCategoryName()

const activeRootId = ref(null)
const activeSubId = ref(null)

const activeRoot = computed(() => props.tree.find((c) => c.id === activeRootId.value))
const activeSub = computed(() => activeRoot.value?.children?.find((c) => c.id === activeSubId.value))

const activeItems = computed(() => {
  if (activeSub.value?.children?.length) return activeSub.value.children
  if (activeSub.value) return [activeSub.value]
  return activeRoot.value?.children || []
})

const seeAllLink = computed(() => {
  const id = activeSubId.value || activeRootId.value
  return id ? `/search?category=${id}` : '/search'
})

function selectRoot(id) {
  activeRootId.value = id
  const firstSub = props.tree.find((c) => c.id === id)?.children?.[0]
  activeSubId.value = firstSub?.id ?? null
}

function selectSub(sub) {
  activeSubId.value = sub.id
  if (!sub.children?.length) {
    onSelect(sub.id)
  }
}

function onSelect(id) {
  emit('update:modelValue', String(id))
  emit('select', id)
}

function syncFromModel() {
  if (!props.modelValue || !props.tree.length) {
    if (props.tree.length) selectRoot(props.tree[0].id)
    return
  }
  const id = Number(props.modelValue)
  for (const root of props.tree) {
    if (root.id === id) {
      activeRootId.value = root.id
      activeSubId.value = root.children?.[0]?.id ?? null
      return
    }
    for (const sub of root.children || []) {
      if (sub.id === id) {
        activeRootId.value = root.id
        activeSubId.value = sub.id
        return
      }
      for (const leaf of sub.children || []) {
        if (leaf.id === id) {
          activeRootId.value = root.id
          activeSubId.value = sub.id
          return
        }
      }
    }
  }
  selectRoot(props.tree[0].id)
}

watch(() => props.tree, syncFromModel, { immediate: true })
watch(() => props.modelValue, syncFromModel)
</script>

<style scoped lang="scss">
.category-mega {
  border: 1px solid var(--es-border);
  overflow: hidden;
}

.category-mega__tabs {
  display: flex;
  gap: 0;
  overflow-x: auto;
  border-bottom: 1px solid var(--es-border);
  background: var(--es-surface);
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.category-mega__tab {
  flex-shrink: 0;
  border: none;
  background: transparent;
  padding: 0.9rem 1.1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--es-text-muted);
  border-bottom: 3px solid transparent;
  transition: color $transition, border-color $transition;
  white-space: nowrap;

  &:hover {
    color: var(--es-primary);
  }

  &.active {
    color: var(--es-text);
    border-bottom-color: var(--es-text);
  }
}

.category-mega__body {
  display: grid;
  grid-template-columns: minmax(200px, 260px) 1fr;
  min-height: 280px;

  @media (max-width: 767.98px) {
    grid-template-columns: 1fr;
  }
}

.category-mega__col--subs {
  background: var(--es-surface-2);
  border-inline-end: 1px solid var(--es-border);
  padding: 0.5rem 0;
  overflow-y: auto;
  max-height: 360px;
}

.category-mega__sub {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
  border: none;
  background: transparent;
  text-align: start;
  padding: 0.7rem 1rem;
  font-size: 0.85rem;
  color: var(--es-text);
  transition: background $transition, color $transition;

  &:hover {
    background: rgba(99, 102, 241, 0.06);
  }

  &.active {
    background: var(--es-surface);
    color: var(--es-primary);
    font-weight: 600;
  }
}

.category-mega__sub-label {
  flex: 1;
  min-width: 0;
}

.category-mega__col--items {
  padding: 1rem 1.25rem;
  background: var(--es-surface);
}

.category-mega__items-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--es-border);
}

.category-mega__see-all {
  color: var(--es-primary);
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
}

.category-mega__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.35rem 1.5rem;

  @media (min-width: 992px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.category-mega__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.35rem;
  padding: 0.45rem 0;
  font-size: 0.85rem;
  color: var(--es-text);
  text-decoration: none;
  transition: color $transition;

  &:hover {
    color: var(--es-primary);
  }
}

.category-mega__chevron,
.category-mega__chevron-sm {
  font-size: 0.7rem;
  opacity: 0.5;
  flex-shrink: 0;
}

html[dir='ltr'] {
  .category-mega__chevron,
  .category-mega__chevron-sm {
    transform: scaleX(-1);
  }
}
</style>
