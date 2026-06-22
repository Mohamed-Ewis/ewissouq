<template>
  <div class="dropdown lang-switcher">
    <button
      type="button"
      class="btn lang-btn"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      :aria-label="t('nav.menu')"
    >
      <i class="bi bi-globe2" />
      <span class="lang-code d-none d-sm-inline">{{ currentLocale?.code?.toUpperCase() }}</span>
    </button>
    <ul class="dropdown-menu dropdown-menu-end shadow">
      <li v-for="loc in locales" :key="loc.code">
        <button
          type="button"
          class="dropdown-item d-flex align-items-center justify-content-between"
          :class="{ active: locale === loc.code }"
          @click="switchLocale(loc.code)"
        >
          <span>{{ loc.name }}</span>
          <i v-if="locale === loc.code" class="bi bi-check2 text-primary" />
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
const { locale, locales, setLocale, t } = useI18n()

const currentLocale = computed(() => locales.value.find((l) => l.code === locale.value))

async function switchLocale(code) {
  await setLocale(code)
}
</script>

<style scoped lang="scss">
.lang-btn {
  width: auto;
  min-width: 40px;
  height: 40px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0 0.65rem;
  background: var(--es-surface-2);
  border: 1px solid var(--es-border);
  color: var(--es-text);
  font-size: 0.8rem;
  font-weight: 600;
  transition: all $transition;

  &:hover {
    background: var(--es-primary);
    color: #fff;
    border-color: var(--es-primary);
  }
}

.lang-code {
  font-size: 0.75rem;
  letter-spacing: 0.03em;
}

.dropdown-item.active {
  background: rgba(99, 102, 241, 0.08);
  color: var(--es-primary);
}
</style>
