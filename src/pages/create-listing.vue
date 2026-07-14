<template>
  <div class="create-listing-page">
    <div class="page-header mb-4">
      <h2 class="fw-bold mb-1">{{ $t('listing.title') }}</h2>
      <p class="text-muted mb-0">{{ $t('listing.subtitle') }}</p>
    </div>

    <div class="publish-types mb-4">
      <button
        v-for="opt in publishOptions"
        :key="opt.value"
        type="button"
        class="publish-type"
        :class="{ active: publishType === opt.value }"
        :disabled="opt.disabled"
        @click="publishType = opt.value"
      >
        <i :class="opt.icon" />
        <span class="fw-semibold">{{ opt.label }}</span>
        <small class="text-muted">{{ opt.hint }}</small>
      </button>
    </div>

    <div v-if="publishType === 'offer' && !isStoreAccount" class="alert alert-warning">
      {{ $t('listing.offerStoreOnly') }}
      <NuxtLinkLocale to="/auth/register" class="alert-link">{{ $t('auth.signUp') }}</NuxtLinkLocale>
    </div>

    <form v-else class="card p-4" @submit.prevent="handleSubmit">
      <div class="row g-4">
        <div class="col-12">
          <label class="form-label fw-semibold">{{ $t('listing.photos') }}</label>
          <div class="upload-zone p-4 text-center" @click="$refs.fileInput.click()">
            <i class="bi bi-cloud-upload fs-1 text-primary mb-2 d-block" />
            <p class="mb-0 text-muted">{{ $t('listing.photosHint') }}</p>
            <input ref="fileInput" type="file" accept="image/*" multiple class="d-none" @change="onImagesChange" />
          </div>
          <div v-if="imagePreviews.length" class="d-flex gap-2 mt-3 flex-wrap">
            <img v-for="(img, i) in imagePreviews" :key="i" :src="img" class="preview-thumb" :alt="`preview-${i}`" />
          </div>
        </div>

        <div v-if="publishType === 'classified'" class="col-12">
          <label class="form-label fw-semibold">{{ $t('listing.video') }}</label>
          <input type="file" accept="video/*" class="form-control" @change="onVideoChange" />
        </div>

        <div class="col-md-8">
          <label class="form-label fw-semibold">{{ $t('listing.titleLabel') }}</label>
          <input v-model="form.title" type="text" class="form-control" :placeholder="$t('listing.titlePlaceholder')" required />
        </div>

        <div class="col-md-4">
          <label class="form-label fw-semibold">
            {{ publishType === 'auction' ? $t('listing.startingBid') : $t('listing.price') }}
          </label>
          <input v-model.number="form.price" type="number" class="form-control" placeholder="0" required min="1" />
        </div>

        <div v-if="publishType === 'offer'" class="col-md-4">
          <label class="form-label fw-semibold">{{ $t('listing.salePrice') }}</label>
          <input v-model.number="form.salePrice" type="number" class="form-control" required min="1" />
        </div>

        <div v-if="publishType === 'offer'" class="col-md-4">
          <label class="form-label fw-semibold">{{ $t('listing.validUntil') }}</label>
          <input v-model="form.validUntil" type="date" class="form-control" required />
        </div>

        <div v-if="publishType === 'auction'" class="col-md-4">
          <label class="form-label fw-semibold">{{ $t('listing.auctionEnds') }}</label>
          <input v-model="form.endTime" type="datetime-local" class="form-control" required />
        </div>

        <div class="col-12">
          <label class="form-label fw-semibold">{{ $t('listing.description') }}</label>
          <textarea v-model="form.description" class="form-control" rows="4" :placeholder="$t('listing.descriptionPlaceholder')" required />
        </div>

        <div v-if="publishType === 'classified'" class="col-md-4">
          <label class="form-label fw-semibold">{{ $t('listing.category') }}</label>
          <select v-model="form.categoryId" class="form-select" required>
            <option value="">{{ $t('listing.selectCategory') }}</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ translateCategory(cat) }}</option>
          </select>
        </div>

        <div v-if="publishType === 'classified'" class="col-md-4">
          <label class="form-label fw-semibold">{{ $t('listing.condition') }}</label>
          <select v-model="form.condition" class="form-select" required>
            <option v-for="c in conditions" :key="c.value" :value="c.value">{{ c.label }}</option>
          </select>
        </div>

        <div class="col-md-4">
          <label class="form-label fw-semibold">{{ $t('listing.city') }}</label>
          <input v-model="form.location.city" type="text" class="form-control" :placeholder="$t('listing.cityPlaceholder')" required />
        </div>
      </div>

      <div v-if="error" class="alert alert-danger mt-4 small">{{ error }}</div>
      <div v-if="success" class="alert alert-success mt-4 small">{{ successMessage }}</div>

      <div class="d-flex gap-2 mt-4">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-1" />
          {{ $t('listing.publish') }}
        </button>
        <NuxtLinkLocale to="/" class="btn btn-outline-secondary">{{ $t('common.cancel') }}</NuxtLinkLocale>
      </div>
    </form>
  </div>
</template>

<script setup>
import { getCategories } from '@/api/categories'
import { getListingCategories } from '@/utils/categoryHelpers'

definePageMeta({ middleware: 'auth' })

const { t } = useI18n()
const authStore = useAuthStore()
const productsStore = useProductsStore()
const { conditions } = useLocalizedOptions()
const { translateCategory } = useCategoryName()
const { to: localizedNavigate } = useLocalizedNavigate()

const categories = ref([])
const imagePreviews = ref([])
const loading = ref(false)
const error = ref('')
const success = ref(false)
const publishType = ref('classified')

const isStoreAccount = computed(
  () => authStore.user?.accountType === 'business' || !!authStore.user?.businessId,
)

const publishOptions = computed(() => [
  {
    value: 'classified',
    label: t('listing.types.classified'),
    hint: t('listing.types.classifiedHint'),
    icon: 'bi bi-tag',
    disabled: false,
  },
  {
    value: 'auction',
    label: t('listing.types.auction'),
    hint: t('listing.types.auctionHint'),
    icon: 'bi bi-hammer',
    disabled: false,
  },
  {
    value: 'offer',
    label: t('listing.types.offer'),
    hint: t('listing.types.offerHint'),
    icon: 'bi bi-percent',
    disabled: !isStoreAccount.value,
  },
])

const successMessage = computed(() => {
  if (publishType.value === 'auction') return t('listing.successAuction')
  if (publishType.value === 'offer') return t('listing.successOffer')
  return t('listing.success')
})

const form = reactive({
  title: '',
  description: '',
  price: null,
  salePrice: null,
  validUntil: '',
  endTime: '',
  categoryId: '',
  condition: 'used',
  location: { country: 'ae', city: 'Dubai', area: '' },
  images: [],
  video: null,
})

function onImagesChange(e) {
  const files = Array.from(e.target.files)
  imagePreviews.value = files.map((f) => URL.createObjectURL(f))
  form.images = imagePreviews.value
}

function onVideoChange(e) {
  const file = e.target.files[0]
  if (file) form.video = URL.createObjectURL(file)
}

async function handleSubmit() {
  loading.value = true
  error.value = ''
  success.value = false
  try {
    const product = await productsStore.createListing({
      ...form,
      price: publishType.value === 'offer' ? (form.salePrice || form.price) : form.price,
      description: publishType.value === 'classified'
        ? form.description
        : `[${publishType.value}] ${form.description}`,
    })
    success.value = true
    const dest = publishType.value === 'auction'
      ? '/auctions'
      : publishType.value === 'offer'
        ? '/stores'
        : `/marketplace/${product.id}`
    setTimeout(() => localizedNavigate(dest), 1200)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const res = await getCategories()
  const tree = res.data || res || []
  categories.value = getListingCategories(tree)
})
</script>

<style scoped lang="scss">
.publish-types {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.publish-type {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.15rem;
  text-align: start;
  padding: 1rem;
  border-radius: 14px;
  border: 1px solid var(--es-border);
  background: var(--es-surface);
  color: inherit;

  i { font-size: 1.35rem; color: var(--es-primary); }

  &.active {
    border-color: var(--es-primary);
    box-shadow: 0 0 0 1px var(--es-primary);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
}

.upload-zone {
  border: 2px dashed var(--es-border);
  border-radius: $border-radius-lg;
  cursor: pointer;
  transition: all $transition;
  &:hover { border-color: var(--es-primary); background: rgba(99, 102, 241, 0.05); }
}

.preview-thumb {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}
</style>
