export function useBusinessName() {
  const { t, te } = useI18n()

  function translateBusiness(source) {
    if (!source) return ''
    const key = typeof source === 'string' ? source : source.nameKey
    if (key && te(key)) return t(key)
    if (typeof source === 'string') return source
    return source.name || ''
  }

  function tierLabel(tier) {
    const map = {
      basic: 'businesses.tiers.basic',
      verified: 'businesses.tiers.verified',
      premium: 'businesses.tiers.premium',
    }
    return map[tier] ? t(map[tier]) : tier
  }

  function tierIcon(tier) {
    if (tier === 'premium') return 'bi bi-gem'
    if (tier === 'verified') return 'bi bi-patch-check-fill'
    return 'bi bi-shop'
  }

  return { translateBusiness, tierLabel, tierIcon }
}
