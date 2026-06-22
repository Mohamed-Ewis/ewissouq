export default defineNuxtPlugin(() => {
  const head = useLocaleHead({ addDirAttribute: true, addSeoAttributes: true })

  useHead({
    htmlAttrs: {
      lang: () => head.value.htmlAttrs?.lang,
      dir: () => head.value.htmlAttrs?.dir,
    },
  })
})
