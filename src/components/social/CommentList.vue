<template>
  <div class="comment-list">
    <div v-if="loading" class="py-2">
      <UiSkeletonLoader type="list" />
    </div>
    <div v-else-if="comments.length === 0" class="text-muted small py-2">{{ $t('comments.empty') }}</div>
    <div v-else>
      <div v-for="comment in comments" :key="comment.id" class="comment-item d-flex gap-2 mb-2">
        <img :src="comment.avatar" class="comment-avatar" :alt="comment.userName" />
        <div class="comment-bubble flex-grow-1">
          <strong class="small">{{ comment.userName }}</strong>
          <p class="mb-0 small">{{ comment.text }}</p>
        </div>
      </div>
    </div>
    <form class="mt-2 d-flex gap-2" @submit.prevent="submitComment">
      <input v-model="newComment" type="text" class="form-control form-control-sm" :placeholder="$t('comments.placeholder')" />
      <button type="submit" class="btn btn-primary btn-sm" :disabled="!newComment.trim()">
        <i class="bi bi-send" />
      </button>
    </form>
  </div>
</template>

<script setup>
import { getProductComments, addComment } from '@/api/products'

const props = defineProps({
  productId: { type: Number, required: true },
})

const comments = ref([])
const newComment = ref('')
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await getProductComments(props.productId)
    comments.value = res.data || res || []
  } finally {
    loading.value = false
  }
})

async function submitComment() {
  if (!newComment.value.trim()) return
  const res = await addComment(props.productId, { text: newComment.value })
  comments.value.push(res.data || res)
  newComment.value = ''
}
</script>

<style scoped lang="scss">
.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-bubble {
  background: var(--es-surface-2);
  border-radius: 12px;
  padding: 0.5rem 0.75rem;
}
</style>
