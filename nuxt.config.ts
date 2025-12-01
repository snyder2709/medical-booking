import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  pinia: {
    storesDirs: ["./stores/**"],
  },
  runtimeConfig: {
    apiProxyUrl:
      process.env.NUXT_API_PROXY_URL || "https://dd-tz-frontend.vercel.app",
  },
  modules: ["shadcn-nuxt", "nuxt-lucide-icons", "@nuxt/hints", "@pinia/nuxt"],
  vite: {
    plugins: [tailwindcss()],
  },
  css: ["@/assets/css/tailwind.css"],
  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: "@/components/ui",
  },
  app: {
    head: {
      title: "МедБукинг",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      meta: [
        {
          name: "description",
          content: "Выберите специалиста и запишитесь на прием онлайн",
        },
      ],
    },
  },
});
