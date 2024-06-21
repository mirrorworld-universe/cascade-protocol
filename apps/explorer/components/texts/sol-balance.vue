<template>
  <span>
    ◎<span className="font-mono">{{ solBalance }}</span>
  </span>
</template>

<script lang="ts" setup>
import { lamportsToSolString } from "@cascade-protocol/core";
import { computed } from "vue";

const props = defineProps<{
  lamports: number | bigint;
  maximumFractionDigits?: number;
}>();

const solBalance = computed(() =>
  lamportsToSolString(props.lamports, props.maximumFractionDigits)
);
</script>
