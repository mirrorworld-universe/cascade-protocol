import { useQuery } from "@tanstack/vue-query";
import { getSupply } from "./stats";
import { keys } from "../keys";

export function useStats() {
  return useQuery({
    queryKey: keys.supply(),
    queryFn: () => getSupply(),
    refetchInterval: 2000,
  });
}
