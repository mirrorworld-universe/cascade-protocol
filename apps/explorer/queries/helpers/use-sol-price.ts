import { useQuery } from "@tanstack/vue-query";
import { getCurrentSOLPrice } from "./stats";
import { keys } from "../keys";

export function useSolPrice() {
  return useQuery({
    queryKey: keys.currentSOLPrice(),
    queryFn: () => getCurrentSOLPrice(),
    refetchInterval: 2000,
  });
}
