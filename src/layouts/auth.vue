<template>
  <div class="layout-auth min-vh-100 d-flex">
    <div class="auth-brand d-none d-lg-flex col-lg-6 align-items-center justify-content-center p-5">
      <div class="text-center text-white">
        <div class="brand-icon-lg mb-4">E</div>
        <h2 class="fw-bold mb-3">{{ $t('auth.brandWelcome') }}</h2>
        <p class="opacity-75 fs-5">{{ $t('auth.brandTagline') }}</p>
        <div class="d-flex justify-content-center gap-4 mt-5">
          <div class="stat"><strong>50K+</strong><br><small>{{ $t('auth.statProducts') }}</small></div>
          <div class="stat"><strong>12K+</strong><br><small>{{ $t('auth.statSellers') }}</small></div>
          <div class="stat"><strong>4.9</strong><br><small>{{ $t('auth.statRating') }}</small></div>
        </div>
      </div>
    </div>
    <div class="auth-form col-12 col-lg-6 d-flex align-items-center justify-content-center p-4">
      <div class="w-100" style="max-width: 420px">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <NuxtLinkLocale to="/" class="text-decoration-none d-lg-none">
            <span class="fw-bold fs-4">EwiS<span class="text-gradient">Souq</span></span>
          </NuxtLinkLocale>
          <ThemeToggle />
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-brand {
  background: var(--es-gradient);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
}

.brand-icon-lg {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 auto;
  backdrop-filter: blur(10px);
}

.stat strong { font-size: 1.5rem; }

.auth-form {
  background: var(--es-bg);
}
</style>
