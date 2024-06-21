<template>
  <div>Hello World</div>
  <pre>{{ data }}</pre>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { getSupply } from "../queries/helpers/stats";
import { onServerPrefetch } from "vue";

const { data, suspense } = useQuery({
  queryKey: ["test"],
  queryFn: () => getSupply(),
  refetchInterval: 60000,
});

onServerPrefetch(async () => {
  await suspense();
});
</script>
