<template>
  <section class="branch-locator">
    <div class="branch-locator__toolbar card p-3 mb-4">
      <div class="row g-3 align-items-center">
        <div class="col-lg-5">
          <div class="input-group">
            <span class="input-group-text bg-transparent"><i class="bi bi-search" /></span>
            <input
              v-model="searchQuery"
              type="search"
              class="form-control"
              :placeholder="$t('businesses.branchSearch')"
            />
          </div>
        </div>
        <div class="col-lg-4">
          <select v-model="selectedCity" class="form-select">
            <option value="">{{ $t('businesses.allCities') }} ({{ branches.length }})</option>
            <option v-for="city in cities" :key="city" :value="city">
              {{ city }} ({{ countByCity(city) }})
            </option>
          </select>
        </div>
        <div class="col-lg-3">
          <div class="branch-stat-badge">
            <i class="bi bi-geo-alt-fill text-primary" />
            <strong>{{ filteredBranches.length }}</strong>
            <span>{{ $t('businesses.branchesShown') }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="grouped.length" class="branch-groups">
      <div v-for="group in grouped" :key="group.city" class="branch-group mb-4">
        <div class="branch-group__header">
          <h5 class="fw-bold mb-0">
            <i class="bi bi-building me-2 text-primary" />{{ group.city }}
          </h5>
          <span class="badge bg-primary-subtle text-primary">{{ group.count }} {{ $t('businesses.branchUnit') }}</span>
        </div>

        <div class="branch-grid">
          <article
            v-for="branch in group.branches"
            :key="branch.id"
            class="branch-card"
            :class="{ 'branch-card--flagship': branch.isFlagship }"
          >
            <div class="branch-card__icon">
              <i class="bi bi-shop-window" />
            </div>
            <div class="branch-card__body">
              <h6 class="branch-card__name fw-semibold mb-1">{{ branch.name }}</h6>
              <p class="branch-card__address small text-muted mb-2">
                <i class="bi bi-geo-alt me-1" />{{ branch.address || `${branch.area}, ${branch.city}` }}
              </p>
              <div class="branch-card__meta d-flex flex-wrap gap-2">
                <span v-if="branch.hours" class="meta-chip">
                  <i class="bi bi-clock" />
                  {{ branch.hours.open }} – {{ branch.hours.close }}
                </span>
                <a v-if="branch.phone" :href="`tel:${branch.phone}`" class="meta-chip meta-chip--action">
                  <i class="bi bi-telephone" /> {{ $t('businesses.call') }}
                </a>
                <a
                  :href="mapsLink(branch)"
                  target="_blank"
                  rel="noopener"
                  class="meta-chip meta-chip--action"
                >
                  <i class="bi bi-map" /> {{ $t('businesses.directions') }}
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>

    <UiEmptyState
      v-else
      icon="bi bi-geo-alt"
      :title="$t('businesses.noBranchesMatch')"
      :description="$t('businesses.noBranchesMatchDesc')"
    />
  </section>
</template>

<script setup>
import { groupBranchesByCity, getBranchCities } from '@/data/businessBranches'

const props = defineProps({
  branches: { type: Array, default: () => [] },
})

const searchQuery = ref('')
const selectedCity = ref('')

const cities = computed(() => getBranchCities(props.branches))

function countByCity(city) {
  return props.branches.filter((b) => b.city === city).length
}

const filteredBranches = computed(() => {
  let list = props.branches
  if (selectedCity.value) {
    list = list.filter((b) => b.city === selectedCity.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(
      (b) =>
        b.name.toLowerCase().includes(q)
        || b.city.toLowerCase().includes(q)
        || (b.area && b.area.toLowerCase().includes(q))
        || (b.address && b.address.toLowerCase().includes(q)),
    )
  }
  return list
})

const grouped = computed(() => groupBranchesByCity(filteredBranches.value))

function mapsLink(branch) {
  const q = encodeURIComponent(`${branch.name}, ${branch.area}, ${branch.city}`)
  return `https://www.google.com/maps/search/?api=1&query=${q}`
}
</script>

<style scoped lang="scss">
.branch-stat-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  background: var(--es-surface-2);
  border-radius: 10px;
  font-size: 0.9rem;

  strong {
    font-size: 1.25rem;
    color: var(--es-primary);
  }

  span {
    color: var(--es-text-muted);
  }
}

.branch-group__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--es-border);
}

.branch-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.875rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.branch-card {
  display: flex;
  gap: 0.875rem;
  padding: 1rem;
  background: var(--es-surface);
  border: 1px solid var(--es-border);
  border-radius: 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: var(--es-primary);
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.1);
  }

  &--flagship {
    border-color: rgba(245, 158, 11, 0.4);
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.04), transparent);
  }
}

.branch-card__icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--es-surface-2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: var(--es-primary);
  flex-shrink: 0;
}

.branch-card__name {
  font-size: 0.95rem;
  color: var(--es-text);
}

.meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  background: var(--es-surface-2);
  color: var(--es-text-muted);
  text-decoration: none;

  &--action {
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--es-primary);
      color: #fff;
    }
  }
}
</style>
