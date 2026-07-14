<template>
  <div class="auth-page">
    <NuxtLinkLocale to="/" class="auth-back-link text-muted small text-decoration-none d-inline-flex align-items-center mb-3">
      <i class="bi bi-arrow-left me-1" /> {{ $t('auth.backToHome') }}
    </NuxtLinkLocale>

    <h3 class="fw-bold mb-1">{{ $t('auth.welcomeBack') }}</h3>
    <p class="text-muted mb-4">{{ $t('auth.loginSubtitle') }}</p>

    <form @submit.prevent="handleLogin">
      <div class="mb-3">
        <label class="form-label">{{ $t('form.email') }}</label>
        <input v-model="form.email" type="email" class="form-control" :placeholder="$t('form.emailPlaceholder')" required />
      </div>
      <div class="mb-3">
        <label class="form-label">{{ $t('form.password') }}</label>
        <input v-model="form.password" type="password" class="form-control" :placeholder="$t('form.passwordPlaceholder')" required />
      </div>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="form-check">
          <input id="remember" v-model="form.remember" class="form-check-input" type="checkbox" />
          <label class="form-check-label small" for="remember">{{ $t('auth.rememberMe') }}</label>
        </div>
        <NuxtLinkLocale to="/auth/forgot-password" class="small text-primary">{{ $t('auth.forgotPassword') }}</NuxtLinkLocale>
      </div>

      <div v-if="error" class="alert alert-danger small">{{ error }}</div>

      <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm me-1" />
        {{ $t('auth.signIn') }}
      </button>
    </form>

    <div class="divider text-center my-4">
      <span class="text-muted small px-3" style="background: var(--es-bg)">{{ $t('auth.orContinueWith') }}</span>
    </div>

    <div class="row g-2 mb-4">
      <div class="col-6">
        <button class="btn btn-outline-secondary w-100 social-btn" disabled>
          <i class="bi bi-google me-1" /> {{ $t('social.google') }}
        </button>
      </div>
      <div class="col-6">
        <button class="btn btn-outline-secondary w-100 social-btn" disabled>
          <i class="bi bi-facebook me-1" /> {{ $t('social.facebook') }}
        </button>
      </div>
    </div>

    <p class="text-center text-muted small mb-0">
      {{ $t('auth.noAccount') }}
      <NuxtLinkLocale to="/auth/register" class="text-primary fw-semibold">{{ $t('auth.signUp') }}</NuxtLinkLocale>
    </p>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'auth' })

const authStore = useAuthStore()
const route = useRoute()
const form = reactive({ email: 'ahmed@example.com', password: 'password123', remember: false })
const loading = ref(false)
const error = ref('')

const { afterAuthPath } = useRequireAuth()

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    await authStore.login(form)
    await navigateTo(afterAuthPath('/'), { replace: true })
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.auth-back-link:hover {
  color: var(--es-primary) !important;
}

.divider {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--es-border);
    z-index: 0;
  }
  span { position: relative; z-index: 1; }
}

.social-btn { font-size: 0.9rem; }
</style>
