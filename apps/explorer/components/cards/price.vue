<template>
  <Card class="min-w-[300px] h-full">
    <CardHeader
      class="flex flex-row items-center justify-between space-y-0 pb-2"
    >
      <CardTitle class="text-md font-bold"> SOL Price </CardTitle>
    </CardHeader>
    <CardContent class="flex flex-col items-start justify-center gap-2">
      <CardHeader class="text-2xl font-bold p-0">{{
        formattedPrice
      }}</CardHeader>
      <p class="text-xs text-muted-foreground">Refreshes every 2 seconds.</p>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { onServerPrefetch } from "vue";
import { useSolPrice } from "../../queries/helpers/use-sol-price";

const { data, suspense } = useSolPrice();

onServerPrefetch(async () => {
  await suspense();
});

const formattedPrice = computed(() => data.value?.formattedPrice ?? "$0.00");
</script>
