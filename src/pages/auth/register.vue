<template>
  <div class="auth-page">
    <NuxtLinkLocale to="/" class="auth-back-link text-muted small text-decoration-none d-inline-flex align-items-center mb-3">
      <i class="bi bi-arrow-left me-1" /> {{ $t('auth.backToHome') }}
    </NuxtLinkLocale>

    <h3 class="fw-bold mb-1">{{ $t('auth.registerTitle') }}</h3>
    <p class="text-muted mb-4">{{ $t('auth.registerSubtitle') }}</p>

    <form @submit.prevent="handleRegister">
      <div class="text-center mb-4">
        <div class="avatar-upload position-relative d-inline-block">
          <img :src="avatarPreview" class="upload-preview" :alt="$t('auth.avatarAlt')" />
          <label class="upload-btn">
            <i class="bi bi-camera" />
            <input type="file" accept="image/*" class="d-none" @change="onAvatarChange" />
          </label>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">{{ $t('form.fullName') }}</label>
        <input v-model="form.name" type="text" class="form-control" :placeholder="$t('form.fullNamePlaceholder')" required />
      </div>
      <div class="mb-3">
        <label class="form-label">{{ $t('form.email') }}</label>
        <input v-model="form.email" type="email" class="form-control" :placeholder="$t('form.emailPlaceholder')" required />
      </div>
      <div class="mb-3">
        <label class="form-label">{{ $t('form.password') }}</label>
        <input v-model="form.password" type="password" class="form-control" :placeholder="$t('form.passwordMin')" required minlength="8" />
      </div>
      <div class="mb-4">
        <label class="form-label">{{ $t('form.confirmPassword') }}</label>
        <input v-model="form.confirmPassword" type="password" class="form-control" :placeholder="$t('form.passwordPlaceholder')" required />
      </div>

      <div v-if="error" class="alert alert-danger small">{{ error }}</div>

      <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm me-1" />
        {{ $t('auth.createAccount') }}
      </button>
    </form>

    <p class="text-center text-muted small mb-0">
      {{ $t('auth.hasAccount') }}
      <NuxtLinkLocale to="/auth/login" class="text-primary fw-semibold">{{ $t('auth.signIn') }}</NuxtLinkLocale>
    </p>
  </div>
</template>

<script setup>
import { DEFAULT_AVATAR } from '@/utils/demoImages'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const authStore = useAuthStore()
const form = reactive({ name: '', email: '', password: '', confirmPassword: '', avatar: null })
const avatarPreview = ref(DEFAULT_AVATAR)
const loading = ref(false)
const error = ref('')

function onAvatarChange(e) {
  const file = e.target.files[0]
  if (file) {
    form.avatar = URL.createObjectURL(file)
    avatarPreview.value = form.avatar
  }
}

const { to: localizedNavigate } = useLocalizedNavigate()

async function handleRegister() {
  error.value = ''
  if (form.password !== form.confirmPassword) {
    error.value = t('auth.passwordMismatch')
    return
  }
  loading.value = true
  try {
    await authStore.register({
      name: form.name,
      email: form.email,
      password: form.password,
      avatar: avatarPreview.value,
    })
    await localizedNavigate('/', { replace: true })
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

.upload-preview {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--es-primary);
}

.upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--es-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
