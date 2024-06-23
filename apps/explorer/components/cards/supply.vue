<template>
  <Card class="min-w-[420px]">
    <CardHeader
      class="flex flex-row items-center justify-between space-y-0 pb-2"
    >
      <CardTitle class="text-md font-bold"> SOL Circulating Supply </CardTitle>
    </CardHeader>
    <CardContent class="flex flex-col items-start justify-center gap-2">
      <div class="text-2xl font-bold">{{ circulatingSupply }}</div>
      <Progress
        :model-value="circulatingSupplyPercentageNormalized"
        class="w-3/5"
      />
      <p class="text-xs text-muted-foreground">
        {{ circulatingSupplyPercentageString }} of {{ totalSupply }} in
        circulation.
      </p>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { getSupply } from "../../queries/helpers/stats";
import { onServerPrefetch } from "vue";
import {
  SOL,
  lamportsToSol,
  lamportsToSolString,
} from "@cascade-protocol/core";
import { useStats } from "../../queries/helpers/use-stats";

const { data, suspense } = useStats();

onServerPrefetch(async () => {
  await suspense();
});

const supplyInSOL = computed(() => {
  const circulating = lamportsToSol(data.value?.circulating ?? 0);
  const nonCirculating = lamportsToSol(data.value?.nonCirculating ?? 0);
  const total = lamportsToSol(data.value?.total ?? 0);

  return {
    circulating,
    nonCirculating,
    total,
  };
});

const circulatingSupplyPercentage = computed(() => {
  const value = Number(
    parseFloat(
      String(supplyInSOL.value.circulating / supplyInSOL.value.total)
    ).toFixed(6)
  );

  return value;
});

const circulatingSupplyPercentageNormalized = computed(
  () => circulatingSupplyPercentage.value * 100
);

const circulatingSupplyPercentageString = computed(() => {
  return Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 4,
  }).format(circulatingSupplyPercentage.value);
});

const circulatingSupply = computed(() => {
  return `${SOL}${lamportsToSolString(data.value?.circulating ?? 0)}`;
});
const totalSupply = computed(() => {
  return `${SOL}${lamportsToSolString(data.value?.total ?? 0)}`;
});
</script>
