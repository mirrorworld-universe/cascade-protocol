<template>
  <nav class="flex flex-row items-center justify-between w-full border-b">
    <MoleculesContainer
      class="flex justify-start items-center px-4 py-3 sticky top-0 left-0 right-0"
    >
      <NuxtLink to="/" class="text-black">
        <MoleculesLogo class="h-7 text-black" />
      </NuxtLink>

      <NuxtLink
        href="https://github.com/mirrorworld-universe/cascade-protocol"
        target="_blank"
        class="ml-auto"
      >
        <GithubLogoIcon class="ml-auto h-5 w-5 text-black" />
      </NuxtLink>
    </MoleculesContainer>
  </nav>
</template>

<script setup lang="ts">
import { GithubLogoIcon } from "@radix-icons/vue";
</script>
