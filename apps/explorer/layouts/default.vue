<template>
  <main class="flex flex-col min-h-screen">
    <MoleculesTopNavigation />
    <slot />
  </main>
</template>

<script setup lang="ts">
import "~/lib/globals";
</script>
