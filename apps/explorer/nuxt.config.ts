import { loadEnv } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

const env = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");

export default defineNuxtConfig({
  app: {
    head: {
      title: "Cascade - Solana's human-readable explorer",
      meta: [
        {
          charset: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          hid: "description",
          name: "description",
          content: "Solana's human-readable explorer",
        },
      ],
    },
  },
  // devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt"],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  alias: {
    "@cascade-protocol/core": "../../packages/core/src/index.ts",
  },
  vite: {
    define: {
      "process.env": env,
    },
    plugins: [
      nodePolyfills({
        globals: {
          process: true,
        },
      }),
    ],
  },
});
