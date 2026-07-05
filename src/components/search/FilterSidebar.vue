<template>
  <aside class="filter-sidebar">
    <div class="filter-header d-flex justify-content-between align-items-center mb-3">
      <h6 class="fw-bold mb-0"><i class="bi bi-funnel me-1" /> {{ $t('filters.title') }}</h6>
      <button v-if="activeCount" class="btn btn-link btn-sm p-0" @click="$emit('reset')">{{ $t('filters.clearAll') }}</button>
    </div>

    <div class="mb-3">
      <label class="form-label small fw-semibold">{{ $t('filters.category') }}</label>
      <select v-model="filters.category" class="form-select form-select-sm">
        <option value="">{{ $t('filters.allCategories') }}</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ translateCategory(cat) }}</option>
      </select>
    </div>

    <div class="mb-3">
      <label class="form-label small fw-semibold">{{ $t('filters.country') }}</label>
      <select v-model="filters.country" class="form-select form-select-sm" @change="filters.city = ''; filters.area = ''">
        <option value="">{{ $t('filters.allCountries') }}</option>
        <option v-for="c in countries" :key="c.value" :value="c.value">{{ c.label }}</option>
      </select>
    </div>

    <div v-if="cityOptions.length" class="mb-3">
      <label class="form-label small fw-semibold">{{ $t('filters.city') }}</label>
      <select v-model="filters.city" class="form-select form-select-sm" @change="filters.area = ''">
        <option value="">{{ $t('filters.allCities') }}</option>
        <option v-for="city in cityOptions" :key="city" :value="city">{{ city }}</option>
      </select>
    </div>

    <div v-if="areaOptions.length" class="mb-3">
      <label class="form-label small fw-semibold">{{ $t('filters.area') }}</label>
      <select v-model="filters.area" class="form-select form-select-sm">
        <option value="">{{ $t('filters.allAreas') }}</option>
        <option v-for="area in areaOptions" :key="area" :value="area">{{ area }}</option>
      </select>
    </div>

    <div class="mb-3">
      <label class="form-label small fw-semibold">{{ $t('filters.priceRange') }}</label>
      <div class="row g-2">
        <div class="col-6">
          <input v-model="filters.minPrice" type="number" class="form-control form-control-sm" :placeholder="$t('filters.min')" />
        </div>
        <div class="col-6">
          <input v-model="filters.maxPrice" type="number" class="form-control form-control-sm" :placeholder="$t('filters.max')" />
        </div>
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label small fw-semibold">{{ $t('filters.condition') }}</label>
      <select v-model="filters.condition" class="form-select form-select-sm">
        <option value="">{{ $t('filters.any') }}</option>
        <option v-for="c in conditions" :key="c.value" :value="c.value">{{ c.label }}</option>
      </select>
    </div>

    <div class="mb-3">
      <label class="form-label small fw-semibold">{{ $t('filters.sortBy') }}</label>
      <select v-model="filters.sort" class="form-select form-select-sm">
        <option v-for="s in sortOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
      </select>
    </div>

    <div class="form-check mb-2">
      <input id="verified" v-model="filters.verified" class="form-check-input" type="checkbox" />
      <label class="form-check-label small" for="verified">{{ $t('filters.verifiedSellers') }}</label>
    </div>

    <div class="form-check mb-2">
      <input id="businessOnly" v-model="filters.businessOnly" class="form-check-input" type="checkbox" />
      <label class="form-check-label small" for="businessOnly">{{ $t('filters.businessOnly') }}</label>
    </div>

    <div class="form-check mb-3">
      <input id="hasVideo" v-model="filters.hasVideo" class="form-check-input" type="checkbox" />
      <label class="form-check-label small" for="hasVideo">{{ $t('filters.hasVideo') }}</label>
    </div>

    <button class="btn btn-primary w-100" @click="$emit('apply')">
      {{ $t('filters.apply') }}
    </button>
  </aside>
</template>

<script setup>
defineProps({
  filters: { type: Object, required: true },
  categories: { type: Array, default: () => [] },
  countries: { type: Array, default: () => [] },
  cityOptions: { type: Array, default: () => [] },
  areaOptions: { type: Array, default: () => [] },
  conditions: { type: Array, default: () => [] },
  sortOptions: { type: Array, default: () => [] },
  activeCount: { type: Number, default: 0 },
})

defineEmits(['apply', 'reset'])

const { translateCategory } = useCategoryName()
</script>

<style scoped lang="scss">
.filter-sidebar {
  @include card-base;
  padding: 1.25rem;
  position: sticky;
  top: 100px;
}
</style>
