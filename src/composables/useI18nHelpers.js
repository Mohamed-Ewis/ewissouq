export function useLocalizedOptions() {
  const { t } = useI18n()

  const conditions = computed(() => [
    { value: 'new', label: t('condition.new') },
    { value: 'used', label: t('condition.used') },
    { value: 'refurbished', label: t('condition.refurbished') },
  ])

  const sortOptions = computed(() => [
    { value: 'recent', label: t('sort.recent') },
    { value: 'views', label: t('sort.views') },
    { value: 'price_asc', label: t('sort.priceAsc') },
    { value: 'price_desc', label: t('sort.priceDesc') },
    { value: 'rating', label: t('sort.rating') },
    { value: 'likes', label: t('sort.likes') },
  ])

  const countries = computed(() => [
    { value: 'ae', label: t('country.ae') },
    { value: 'sa', label: t('country.sa') },
    { value: 'eg', label: t('country.eg') },
    { value: 'jo', label: t('country.jo') },
  ])

  return { conditions, sortOptions, countries }
}

export function useCategoryName() {
  const { t } = useI18n()

  function translateCategory(category) {
    if (!category) return ''

    if (typeof category === 'string') {
      const key = category.startsWith('categories.') ? category : `categories.${category}`
      const translated = t(key)
      return translated !== key ? translated : category
    }

    if (category.i18nKey) {
      const translated = t(category.i18nKey)
      if (translated !== category.i18nKey) return translated
    }

    if (category.slug) {
      const translated = t(`categories.${category.slug}`)
      if (translated !== `categories.${category.slug}`) return translated
    }

    return category.name || ''
  }

  function translateCondition(value) {
    if (!value) return ''
    return t(`condition.${value}`)
  }

  return { translateCategory, translateCondition }
}

export function useFormatters() {
  const { t } = useI18n()

  function formatPrice(amount) {
    return t('currency.amount', { amount: Number(amount).toLocaleString() })
  }

  function timeAgo(date) {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return t('time.justNow')
    if (mins < 60) return t('time.minutesAgo', { count: mins })
    const hours = Math.floor(mins / 60)
    if (hours < 24) return t('time.hoursAgo', { count: hours })
    return t('time.daysAgo', { count: Math.floor(hours / 24) })
  }

  return { formatPrice, timeAgo }
}
