import { CITIES, AREAS } from '@/utils/constants'

export function useProductFilters(initial = {}) {
  const { conditions, sortOptions, countries } = useLocalizedOptions()

  const filters = reactive({
    q: '',
    category: '',
    country: '',
    city: '',
    area: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    sort: 'recent',
    verified: false,
    hasVideo: false,
    ...initial,
  })

  const cityOptions = computed(() => (filters.country ? CITIES[filters.country] || [] : []))
  const areaOptions = computed(() => (filters.city ? AREAS[filters.city] || [] : []))

  const activeFilterCount = computed(() => {
    let count = 0
    if (filters.category) count++
    if (filters.country) count++
    if (filters.city) count++
    if (filters.area) count++
    if (filters.minPrice) count++
    if (filters.maxPrice) count++
    if (filters.condition) count++
    if (filters.verified) count++
    if (filters.hasVideo) count++
    return count
  })

  function resetFilters() {
    Object.assign(filters, {
      q: filters.q,
      category: '',
      country: '',
      city: '',
      area: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      sort: 'recent',
      verified: false,
      hasVideo: false,
    })
  }

  function toParams() {
    const params = { sort: filters.sort }
    if (filters.q) params.q = filters.q
    if (filters.category) params.category = filters.category
    if (filters.country) params.country = filters.country
    if (filters.city) params.city = filters.city
    if (filters.area) params.area = filters.area
    if (filters.minPrice) params.minPrice = filters.minPrice
    if (filters.maxPrice) params.maxPrice = filters.maxPrice
    if (filters.condition) params.condition = filters.condition
    if (filters.verified) params.verified = true
    if (filters.hasVideo) params.hasVideo = true
    return params
  }

  return {
    filters,
    cityOptions,
    areaOptions,
    activeFilterCount,
    resetFilters,
    toParams,
    sortOptions,
    countries,
    conditions,
  }
}
