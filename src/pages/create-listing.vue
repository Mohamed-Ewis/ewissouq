<template>
  <div class="create-listing-page">
    <div class="page-header mb-4">
      <h2 class="fw-bold mb-1">{{ $t('listing.title') }}</h2>
      <p class="text-muted mb-0">{{ $t('listing.subtitle') }}</p>
    </div>

    <form class="card p-4" @submit.prevent="handleSubmit">
      <div class="row g-4">
        <div class="col-12">
          <label class="form-label fw-semibold">{{ $t('listing.photos') }}</label>
          <div class="upload-zone p-4 text-center" @click="$refs.fileInput.click()">
            <i class="bi bi-cloud-upload fs-1 text-primary mb-2 d-block" />
            <p class="mb-0 text-muted">{{ $t('listing.photosHint') }}</p>
            <input ref="fileInput" type="file" accept="image/*" multiple class="d-none" @change="onImagesChange" />
          </div>
          <div v-if="imagePreviews.length" class="d-flex gap-2 mt-3 flex-wrap">
            <img v-for="(img, i) in imagePreviews" :key="i" :src="img" class="preview-thumb" />
          </div>
        </div>

        <div class="col-12">
          <label class="form-label fw-semibold">{{ $t('listing.video') }}</label>
          <input type="file" accept="video/*" class="form-control" @change="onVideoChange" />
        </div>

        <div class="col-md-8">
          <label class="form-label fw-semibold">{{ $t('listing.titleLabel') }}</label>
          <input v-model="form.title" type="text" class="form-control" :placeholder="$t('listing.titlePlaceholder')" required />
        </div>

        <div class="col-md-4">
          <label class="form-label fw-semibold">{{ $t('listing.price') }}</label>
          <input v-model.number="form.price" type="number" class="form-control" placeholder="0" required min="1" />
        </div>

        <div class="col-12">
          <label class="form-label fw-semibold">{{ $t('listing.description') }}</label>
          <textarea v-model="form.description" class="form-control" rows="4" :placeholder="$t('listing.descriptionPlaceholder')" required />
        </div>

        <div class="col-md-4">
          <label class="form-label fw-semibold">{{ $t('listing.category') }}</label>
          <select v-model="form.categoryId" class="form-select" required>
            <option value="">{{ $t('listing.selectCategory') }}</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ translateCategory(cat) }}</option>
          </select>
        </div>

        <div class="col-md-4">
          <label class="form-label fw-semibold">{{ $t('listing.condition') }}</label>
          <select v-model="form.condition" class="form-select" required>
            <option v-for="c in conditions" :key="c.value" :value="c.value">{{ c.label }}</option>
          </select>
        </div>

        <div class="col-md-4">
          <label class="form-label fw-semibold">{{ $t('listing.city') }}</label>
          <input v-model="form.location.city" type="text" class="form-control" :placeholder="$t('listing.cityPlaceholder')" required />
        </div>

        <div class="col-md-4">
          <label class="form-label fw-semibold">{{ $t('listing.area') }}</label>
          <input v-model="form.location.area" type="text" class="form-control" :placeholder="$t('listing.areaPlaceholder')" />
        </div>

        <div class="col-md-4">
          <label class="form-label fw-semibold">{{ $t('listing.country') }}</label>
          <select v-model="form.location.country" class="form-select">
            <option v-for="c in countries" :key="c.value" :value="c.value">{{ c.label }}</option>
          </select>
        </div>
      </div>

      <div v-if="error" class="alert alert-danger mt-4 small">{{ error }}</div>
      <div v-if="success" class="alert alert-success mt-4 small">{{ $t('listing.success') }}</div>

      <div class="d-flex gap-2 mt-4">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-1" />
          {{ $t('listing.publish') }}
        </button>
        <NuxtLinkLocale to="/marketplace" class="btn btn-outline-secondary">{{ $t('common.cancel') }}</NuxtLinkLocale>
      </div>
    </form>
  </div>
</template>

<script setup>
import { getCategories } from '@/api/categories'

definePageMeta({ middleware: 'auth' })

const productsStore = useProductsStore()
const { conditions, countries } = useLocalizedOptions()
const { translateCategory } = useCategoryName()
const categories = ref([])
const imagePreviews = ref([])
const loading = ref(false)
const error = ref('')
const success = ref(false)

const form = reactive({
  title: '',
  description: '',
  price: null,
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

const { to: localizedNavigate } = useLocalizedNavigate()

async function handleSubmit() {
  loading.value = true
  error.value = ''
  success.value = false
  try {
    const product = await productsStore.createListing(form)
    success.value = true
    setTimeout(() => localizedNavigate(`/marketplace/${product.id}`), 1500)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const res = await getCategories()
  categories.value = res.data || res || []
})
</script>

<style scoped lang="scss">
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
