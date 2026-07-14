<template>
  <div class="messages-page">
    <Breadcrumb
      :items="[
        { label: $t('nav.home'), to: '/' },
        { label: $t('messages.title') },
      ]"
    />

    <div class="page-header mb-4">
      <h2 class="fw-bold mb-1">{{ $t('messages.title') }}</h2>
      <p class="text-muted mb-0">{{ $t('messages.subtitle') }}</p>
    </div>

    <div v-if="thread" class="card p-4 mb-4">
      <div class="d-flex align-items-center justify-content-between gap-2 mb-3">
        <div>
          <div class="small text-muted">{{ $t('messages.aboutListing') }}</div>
          <div class="fw-semibold">{{ thread.listingTitle }}</div>
        </div>
        <NuxtLinkLocale v-if="thread.listingHref" :to="thread.listingHref" class="btn btn-sm btn-outline-primary">
          {{ $t('messages.viewListing') }}
        </NuxtLinkLocale>
      </div>

      <div class="thread-box mb-3">
        <div v-for="(msg, i) in thread.messages" :key="i" class="thread-msg" :class="{ mine: msg.mine }">
          <div class="thread-msg__bubble">{{ msg.text }}</div>
          <div class="small text-muted mt-1">{{ msg.time }}</div>
        </div>
      </div>

      <form class="d-flex gap-2" @submit.prevent="sendMessage">
        <input v-model="draft" type="text" class="form-control" :placeholder="$t('messages.placeholder')" required />
        <button type="submit" class="btn btn-primary">{{ $t('messages.send') }}</button>
      </form>
    </div>

    <UiEmptyState
      v-else
      icon="bi bi-chat-dots"
      :title="$t('messages.emptyTitle')"
      :description="$t('messages.emptyDesc')"
    >
      <template #action>
        <NuxtLinkLocale to="/marketplace" class="btn btn-primary mt-2">{{ $t('nav.marketplace') }}</NuxtLinkLocale>
      </template>
    </UiEmptyState>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default', middleware: 'auth' })

const { t } = useI18n()
const route = useRoute()
const draft = ref('')

const thread = ref(null)

onMounted(() => {
  const listingId = route.query.listingId
  const sellerId = route.query.sellerId
  const title = route.query.title || t('messages.defaultListing')

  if (listingId || sellerId) {
    thread.value = {
      listingTitle: String(title),
      listingHref: listingId ? `/marketplace/${listingId}` : null,
      messages: [
        {
          mine: false,
          text: t('messages.autoReply'),
          time: t('messages.justNow'),
        },
      ],
    }
  }
})

function sendMessage() {
  if (!draft.value.trim() || !thread.value) return
  thread.value.messages.push({
    mine: true,
    text: draft.value.trim(),
    time: t('messages.justNow'),
  })
  draft.value = ''
}
</script>

<style scoped lang="scss">
.thread-box {
  background: var(--es-surface-2);
  border-radius: 12px;
  padding: 1rem;
  max-height: 320px;
  overflow-y: auto;
}

.thread-msg {
  margin-bottom: 0.85rem;
  max-width: 85%;

  &.mine {
    margin-inline-start: auto;
    text-align: end;

    .thread-msg__bubble {
      background: var(--es-primary);
      color: #fff;
    }
  }
}

.thread-msg__bubble {
  display: inline-block;
  padding: 0.65rem 0.9rem;
  border-radius: 12px;
  background: var(--es-surface);
  border: 1px solid var(--es-border);
}
</style>
