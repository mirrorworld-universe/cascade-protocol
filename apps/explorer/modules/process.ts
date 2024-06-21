import { defineNuxtModule } from "nuxt/kit";
import dotenv from "dotenv";

dotenv.config();

export default defineNuxtModule({
  setup(_options, nuxt) {
    nuxt.options.vite.define = {
      "process.env": process.env,
    };
  },
});
