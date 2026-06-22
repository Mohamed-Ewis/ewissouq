<template>
  <div class="auth-page">
    <NuxtLinkLocale to="/" class="auth-back-link text-muted small text-decoration-none d-inline-flex align-items-center mb-3">
      <i class="bi bi-arrow-left me-1" /> {{ $t('auth.backToHome') }}
    </NuxtLinkLocale>

    <h3 class="fw-bold mb-1">{{ $t('auth.forgotTitle') }}</h3>
    <p class="text-muted mb-4">{{ $t('auth.forgotSubtitle') }}</p>

    <form v-if="!sent" @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label class="form-label">{{ $t('form.email') }}</label>
        <input v-model="email" type="email" class="form-control" :placeholder="$t('form.emailPlaceholder')" required />
      </div>
      <div v-if="error" class="alert alert-danger small">{{ error }}</div>
      <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm me-1" />
        {{ $t('auth.sendResetLink') }}
      </button>
    </form>

    <div v-else class="text-center py-4">
      <div class="success-icon mb-3">
        <i class="bi bi-envelope-check" />
      </div>
      <h5 class="fw-semibold">{{ $t('auth.checkEmail') }}</h5>
      <p class="text-muted small">{{ $t('auth.resetSent', { email }) }}</p>
    </div>

    <p class="text-center mt-4 mb-0">
      <NuxtLinkLocale to="/auth/login" class="text-primary small"><i class="bi bi-arrow-left me-1" /> {{ $t('auth.backToLogin') }}</NuxtLinkLocale>
    </p>
  </div>
</template>

<script setup>
import { forgotPassword } from '@/api/auth'

definePageMeta({ layout: 'auth' })

const email = ref('')
const loading = ref(false)
const error = ref('')
const sent = ref(false)

async function handleSubmit() {
  loading.value = true
  error.value = ''
  try {
    await forgotPassword({ email: email.value })
    sent.value = true
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

.success-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.1);
  color: $success;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  margin: 0 auto;
}
</style>
