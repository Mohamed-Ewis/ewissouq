<template>
  <button
    class="btn btn-sm theme-toggle"
    :title="isDark ? $t('theme.light') : $t('theme.dark')"
    @click="toggleTheme"
  >
    <i :class="isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill'" />
  </button>
</template>

<script setup>
const { isDark, toggleTheme } = useTheme()
</script>

<style scoped lang="scss">
.theme-toggle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--es-surface-2);
  border: 1px solid var(--es-border);
  color: var(--es-text);
  transition: all $transition;

  &:hover {
    background: var(--es-primary);
    color: #fff;
    border-color: var(--es-primary);
  }
}
</style>
