export default defineNuxtConfig({
  srcDir: "src/",
  compatibilityDate: "2024-12-01",
  devtools: { enabled: true },
  ssr: false,
  experimental: {
    // Workaround for Nuxt 3.21.8 dev crash with ssr:false (fixed in 3.21.9)
    viteEnvironmentApi: true,
  },
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "bootstrap-icons/font/bootstrap-icons.css",
    "~/assets/scss/main.scss",
  ],

  modules: ["@pinia/nuxt", "@vueuse/nuxt", "@nuxtjs/i18n"],

  i18n: {
    bundle: {
      optimizeTranslationDirective: false,
    },
    restructureDir: false,
    langDir: "locales",
    locales: [
      {
        code: "ar",
        language: "ar-AE",
        name: "العربية",
        dir: "rtl",
        file: "ar.json",
      },
      {
        code: "en",
        language: "en-US",
        name: "English",
        dir: "ltr",
        file: "en.json",
      },
      {
        code: "fr",
        language: "fr-FR",
        name: "Français",
        dir: "ltr",
        file: "fr.json",
      },
    ],
    defaultLocale: "ar",
    lazy: true,
    strategy: "prefix_except_default",
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "ewissouq_locale",
      fallbackLocale: "ar",
    },
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "/api",
      useMock: process.env.NUXT_PUBLIC_USE_MOCK !== "false",
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: ["src/assets/scss"],
          additionalData(content, filename) {
            const file = String(filename || "").replace(/\\/g, "/");
            if (
              file.includes("assets/scss/main.scss") ||
              file.includes("assets/scss/_mixins.scss")
            ) {
              return content;
            }
            return `@use "variables" as *;\n@use "mixins" as *;\n${content}`;
          },
        },
      },
    },
  },

  app: {
    pageTransition: { name: "page" },
    layoutTransition: { name: "layout" },
    head: {
      title: "EwiSSouq — Social Marketplace",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Modern social marketplace for buying, selling, and auctioning products.",
        },
      ],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap",
        },
      ],
    },
  },
});
