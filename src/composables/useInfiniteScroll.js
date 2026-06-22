export function useInfiniteScroll(callback, options = {}) {
  const { distance = 200, canLoad = () => true } = options
  const target = ref(null)
  const loading = ref(false)

  useIntersectionObserver(
    target,
    async ([{ isIntersecting }]) => {
      if (isIntersecting && canLoad() && !loading.value) {
        loading.value = true
        try {
          await callback()
        } finally {
          loading.value = false
        }
      }
    },
    { rootMargin: `${distance}px` },
  )

  return { target, loading }
}
