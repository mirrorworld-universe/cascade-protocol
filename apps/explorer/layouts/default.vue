<template>
  <main>
    <slot />
  </main>
</template>

<script type="module" lang="ts">
// Global node polyfill.

import { Buffer } from "buffer";
import process from "process";

window.global = window;
window.Buffer = Buffer;
window.process = process;
</script>
