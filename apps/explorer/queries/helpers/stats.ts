import type { LamportsUnsafeBeyond2Pow53Minus1 } from "@solana/web3.js";
import { rpc } from "~/lib/rpc";

export type Supply = {
  circulating: LamportsUnsafeBeyond2Pow53Minus1;
  nonCirculating: LamportsUnsafeBeyond2Pow53Minus1;
  total: LamportsUnsafeBeyond2Pow53Minus1;
};

export async function getSupply(): Promise<Supply> {
  const supplyResponse = await rpc
    .getSupply({
      commitment: "finalized",
      excludeNonCirculatingAccountsList: true,
    })
    .send();

  const supply = {
    circulating: supplyResponse.value.circulating,
    nonCirculating: supplyResponse.value.nonCirculating,
    total: supplyResponse.value.total,
  };

  return supply;
}
