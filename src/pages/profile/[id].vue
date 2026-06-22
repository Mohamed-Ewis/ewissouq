<template>
  <div v-if="loading" class="py-5">
    <UiSkeletonLoader height="300px" />
  </div>

  <UiErrorState v-else-if="error" :message="error" @retry="loadProfile" />

  <div v-else-if="user" class="profile-page">
    <ProfileHeader
      :user="user"
      :is-own-profile="isOwnProfile"
      :is-following="isFollowing"
      :published-count="user.publishedProducts?.length || 0"
      @follow="toggleFollow"
    />

    <div class="profile-tabs card mb-4">
      <ul class="nav nav-tabs border-0 px-2 px-md-3">
        <li v-for="tabItem in tabs" :key="tabItem.key" class="nav-item">
          <button class="nav-link" :class="{ active: activeTab === tabItem.key }" @click="activeTab = tabItem.key">
            {{ tabItem.label }}
            <span class="badge ms-1" :class="activeTab === tabItem.key ? 'bg-primary' : 'bg-light text-dark'">{{ tabItem.count }}</span>
          </button>
        </li>
      </ul>
    </div>

    <div class="profile-content">
      <div v-if="activeTab === 'published'" class="row g-3">
        <div v-for="p in user.publishedProducts" :key="p.id" class="col-6 col-md-4 col-lg-3">
          <ProductCard :product="p" />
        </div>
        <UiEmptyState v-if="!user.publishedProducts?.length" :title="$t('profile.noListings')" :description="$t('profile.noListingsDesc')" />
      </div>

      <div v-else-if="activeTab === 'sold'" class="row g-3">
        <div v-for="p in user.soldProducts" :key="p.id" class="col-6 col-md-4 col-lg-3">
          <ProductCard :product="p" />
        </div>
        <UiEmptyState v-if="!user.soldProducts?.length" :title="$t('profile.noSold')" />
      </div>

      <div v-else-if="activeTab === 'saved'" class="row g-3">
        <div v-for="p in user.savedProducts" :key="p.id" class="col-6 col-md-4 col-lg-3">
          <ProductCard :product="p" />
        </div>
        <UiEmptyState v-if="!user.savedProducts?.length" :title="$t('profile.noSaved')" />
      </div>

      <div v-else class="activity-feed">
        <div v-for="i in 5" :key="i" class="card p-3 mb-2 d-flex flex-row gap-3 align-items-center">
          <i class="bi bi-activity text-primary fs-4" />
          <div>
            <p class="mb-0 small">{{ $t('profile.listedProduct') }}</p>
            <span class="text-muted" style="font-size: 0.75rem">{{ $t('profile.daysAgo', { count: i }) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getUser, followUser } from '@/api/users'

const { t } = useI18n()
const route = useRoute()
const authStore = useAuthStore()
const user = ref(null)
const loading = ref(true)
const error = ref('')
const activeTab = ref('published')
const isFollowing = ref(false)

const isOwnProfile = computed(() => authStore.user?.id === user.value?.id)

const tabs = computed(() => [
  { key: 'published', label: t('profile.tabs.published'), count: user.value?.publishedProducts?.length || 0 },
  { key: 'sold', label: t('profile.tabs.sold'), count: user.value?.soldProducts?.length || 0 },
  { key: 'saved', label: t('profile.tabs.saved'), count: user.value?.savedProducts?.length || 0 },
  { key: 'activity', label: t('profile.tabs.activity'), count: 5 },
])

async function loadProfile() {
  loading.value = true
  error.value = ''
  try {
    const res = await getUser(route.params.id)
    user.value = res.data || res
    isFollowing.value = user.value.isFollowing || false
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function toggleFollow() {
  const res = await followUser(user.value.id)
  isFollowing.value = res.data?.following ?? !isFollowing.value
}

onMounted(loadProfile)
</script>

<style scoped lang="scss">
.profile-tabs {
  @include card-base;
  padding: 0.25rem 0 0;
  overflow: hidden;
}

.nav-tabs .nav-link {
  color: var(--es-text-muted);
  border: none;
  border-bottom: 2px solid transparent;
  padding: 0.85rem 1rem;
  font-weight: 500;
  font-size: 0.9rem;
  transition: color $transition, border-color $transition;

  &:hover {
    color: var(--es-primary);
    border-color: transparent;
  }

  &.active {
    color: var(--es-primary);
    border-bottom-color: var(--es-primary);
    background: none;
  }
}
</style>
