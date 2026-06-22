<template>
  <div class="layout-default d-flex flex-column min-vh-100">
    <AppHeader />
    <main class="main-content flex-grow-1 py-4">
      <div class="container-fluid px-3 px-lg-4">
        <slot />
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped lang="scss">
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}
</style>
