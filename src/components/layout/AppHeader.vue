<template>

  <header class="app-header sticky-top">

    <nav class="navbar navbar-expand-lg">

      <div class="container-fluid px-3 px-lg-4">

        <NuxtLinkLocale to="/" class="navbar-brand d-flex align-items-center gap-2">

          <span class="brand-icon">E</span>

          <span class="brand-text fw-bold"><span class="text-gradient">Souq</span></span>

        </NuxtLinkLocale>



        <div class="search-bar d-none d-md-flex flex-grow-1 mx-4">

          <form class="w-100" @submit.prevent="goSearch">

            <div class="input-group">

              <span class="input-group-text bg-transparent border-end-0">

                <i class="bi bi-search text-muted" />

              </span>

              <input

                v-model="searchQuery"

                type="search"

                class="form-control border-start-0"

                :placeholder="$t('search.placeholder')"

              />

            </div>

          </form>

        </div>



        <div class="d-flex align-items-center gap-2">

          <ThemeToggle />

          <LanguageSwitcher />



          <NotificationDropdown />



          <NuxtLinkLocale to="/create-listing" class="btn btn-primary btn-sm d-none d-sm-flex">

            <i class="bi bi-plus-lg me-1" /> {{ $t('nav.sell') }}

          </NuxtLinkLocale>



          <template v-if="authStore.isLoggedIn">

            <div class="dropdown">

              <button class="btn nav-avatar-btn" data-bs-toggle="dropdown">

                <img

                  :src="authStore.user?.avatar || DEFAULT_AVATAR"

                  :alt="$t('nav.profile')"

                  class="avatar-sm"

                />

              </button>

              <ul class="dropdown-menu dropdown-menu-end shadow">

                <li>

                  <NuxtLinkLocale :to="`/profile/${authStore.user?.id || 1}`" class="dropdown-item">

                    <i class="bi bi-person me-2" /> {{ $t('nav.profile') }}

                  </NuxtLinkLocale>

                </li>

                <li>

                  <NuxtLinkLocale to="/messages" class="dropdown-item">

                    <i class="bi bi-chat-dots me-2" /> {{ $t('nav.messages') }}

                  </NuxtLinkLocale>

                </li>

                <li>

                  <NuxtLinkLocale to="/saved" class="dropdown-item">

                    <i class="bi bi-bookmark me-2" /> {{ $t('nav.saved') }}

                  </NuxtLinkLocale>

                </li>

                <li><hr class="dropdown-divider" /></li>

                <li>

                  <button class="dropdown-item text-danger" @click="authStore.logout()">

                    <i class="bi bi-box-arrow-right me-2" /> {{ $t('auth.logout') }}

                  </button>

                </li>

              </ul>

            </div>

          </template>

          <template v-else>

            <NuxtLinkLocale to="/auth/login" class="btn btn-outline-primary btn-sm d-none d-sm-flex">{{ $t('auth.login') }}</NuxtLinkLocale>

          </template>



          <button

            class="navbar-toggler border-0 d-lg-none"

            type="button"

            data-bs-toggle="offcanvas"

            data-bs-target="#mobileNav"

          >

            <i class="bi bi-list fs-4" />

          </button>

        </div>

      </div>

    </nav>



    <div class="nav-tabs-bar d-none d-lg-block">

      <div class="container-fluid px-4">

        <ul class="nav nav-pills gap-1">

          <li v-for="link in navLinks" :key="link.to" class="nav-item">
            <NuxtLinkLocale
              v-if="link.animated && liveAuctionsCount > 0"
              :to="link.to"
              class="nav-link nav-link--swap"
              active-class="active"
            >
              <i :class="link.icon" class="me-1" />
              <span class="nav-swap" aria-live="polite">
                <span class="nav-swap__track" :class="{ 'nav-swap__track--alt': showLiveAuctionsLabel }">
                  <span class="nav-swap__item">{{ link.label }}</span>
                  <span class="nav-swap__item nav-swap__item--live">
                    <span class="nav-swap__dot" />{{ liveAuctionsLabel }}
                  </span>
                </span>
              </span>
            </NuxtLinkLocale>
            <NuxtLinkLocale v-else :to="link.to" class="nav-link" active-class="active">
              <i :class="link.icon" class="me-1" />{{ link.label }}
            </NuxtLinkLocale>
          </li>

        </ul>

      </div>

    </div>



    <!-- Mobile offcanvas -->

    <div id="mobileNav" class="offcanvas offcanvas-end" tabindex="-1">

      <div class="offcanvas-header">

        <h5 class="offcanvas-title">{{ $t('nav.menu') }}</h5>

        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" />

      </div>

      <div class="offcanvas-body">

        <form class="mb-3" @submit.prevent="goSearch">

          <input v-model="searchQuery" type="search" class="form-control" :placeholder="$t('search.placeholderShort')" />

        </form>

        <ul class="nav flex-column gap-1">

          <li v-for="link in navLinks" :key="link.to">
            <NuxtLinkLocale
              v-if="link.animated && liveAuctionsCount > 0"
              :to="link.to"
              class="nav-link nav-link--swap"
              data-bs-dismiss="offcanvas"
            >
              <i :class="link.icon" class="me-2" />
              <span class="nav-swap" aria-live="polite">
                <span class="nav-swap__track" :class="{ 'nav-swap__track--alt': showLiveAuctionsLabel }">
                  <span class="nav-swap__item">{{ link.label }}</span>
                  <span class="nav-swap__item nav-swap__item--live">
                    <span class="nav-swap__dot" />{{ liveAuctionsLabel }}
                  </span>
                </span>
              </span>
            </NuxtLinkLocale>
            <NuxtLinkLocale v-else :to="link.to" class="nav-link" data-bs-dismiss="offcanvas">
              <i :class="link.icon" class="me-2" />{{ link.label }}
            </NuxtLinkLocale>
          </li>

        </ul>

      </div>

    </div>

  </header>

</template>



<script setup>
import { DEFAULT_AVATAR } from '@/utils/demoImages'

const { t } = useI18n()
const authStore = useAuthStore()
const auctionsStore = useAuctionsStore()
const searchQuery = ref('')
const showLiveAuctionsLabel = ref(false)

const liveAuctionsCount = computed(() => auctionsStore.activeAuctions.length)
const liveAuctionsLabel = computed(() => t('nav.liveAuctions', { count: liveAuctionsCount.value }))

const navLinks = computed(() => [
  { to: '/', label: t('nav.feed'), icon: 'bi bi-house' },
  { to: '/stores', label: t('nav.stores'), icon: 'bi bi-tag-fill' },
  { to: '/marketplace', label: t('nav.marketplace'), icon: 'bi bi-shop' },
  { to: '/search', label: t('nav.search'), icon: 'bi bi-funnel' },
  { to: '/create-listing', label: t('nav.sell'), icon: 'bi bi-plus-circle' },
  { to: '/auctions', label: t('nav.auctions'), icon: 'bi bi-hammer', animated: true },
])

let swapTimer = null

function goSearch() {
  const localePath = useLocalePath()
  navigateTo({
    path: localePath('/search'),
    query: searchQuery.value ? { q: searchQuery.value } : {},
  })
}

onMounted(() => {
  if (!auctionsStore.auctions.length) {
    auctionsStore.fetchAuctions()
  }

  swapTimer = setInterval(() => {
    if (liveAuctionsCount.value > 0) {
      showLiveAuctionsLabel.value = !showLiveAuctionsLabel.value
    }
  }, 3000)
})

onUnmounted(() => {
  if (swapTimer) clearInterval(swapTimer)
})
</script>



<style scoped lang="scss">

.app-header {

  background: var(--es-surface);

  border-bottom: 1px solid var(--es-border);

  z-index: 1030;

}



.navbar-brand {

  color: var(--es-text);

  text-decoration: none;

}



.brand-icon {

  width: 36px;

  height: 36px;

  border-radius: 10px;

  background: var(--es-gradient);

  color: #fff;

  display: flex;

  align-items: center;

  justify-content: center;

  font-weight: 800;

  font-size: 1.1rem;

}



.search-bar .input-group {

  background: var(--es-surface-2);

  border-radius: $border-radius;

  overflow: hidden;

  border: 1px solid var(--es-border);



  .form-control, .input-group-text {

    border: none;

    background: transparent;

  }

}



.nav-icon-btn {

  width: 40px;

  height: 40px;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  background: var(--es-surface-2);

  border: 1px solid var(--es-border);

  color: var(--es-text);

  position: relative;

}



.nav-avatar-btn {

  padding: 0;

  border: 2px solid var(--es-primary);

  border-radius: 50%;

  background: none;

}



.avatar-sm {

  width: 36px;

  height: 36px;

  border-radius: 50%;

  object-fit: cover;

}



.nav-tabs-bar {

  border-top: 1px solid var(--es-border);

  padding: 0.5rem 0;



  .nav-link {

    color: var(--es-text-muted);

    border-radius: $border-radius;

    font-weight: 500;

    font-size: 0.9rem;

    padding: 0.5rem 1rem;

    transition: all $transition;



    &:hover { color: var(--es-primary); background: var(--es-surface-2); }

    &.active { background: var(--es-gradient); color: #fff; }

    &--swap {
      min-width: 9.5rem;
    }
  }
}

.nav-swap {
  display: inline-block;
  height: 1.25em;
  overflow: hidden;
  vertical-align: middle;
}

.nav-swap__track {
  display: flex;
  flex-direction: column;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  &--alt {
    transform: translateY(-50%);
  }
}

.nav-swap__item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  height: 1.25em;
  line-height: 1.25em;
  white-space: nowrap;

  &--live {
    color: var(--es-primary);
    font-weight: 600;
  }
}

.nav-link.active .nav-swap__item--live {
  color: #fff;
}

.nav-swap__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  flex-shrink: 0;
  animation: live-pulse 1.4s ease-in-out infinite;
}

.nav-link.active .nav-swap__dot {
  background: #86efac;
}

@keyframes live-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.55; transform: scale(0.85); }
}

</style>

