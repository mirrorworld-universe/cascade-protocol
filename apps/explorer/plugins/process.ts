import process from "process";

export default defineNuxtPlugin(() => {
  globalThis.process = process;
});
