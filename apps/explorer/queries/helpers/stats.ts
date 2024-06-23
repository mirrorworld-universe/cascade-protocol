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

export interface GetCurrentSolPriceResponse {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee: any;
  priceImpactPct: string;
  routePlan: RoutePlan[];
  contextSlot: number;
  timeTaken: number;
}

export interface RoutePlan {
  swapInfo: SwapInfo;
  percent: number;
}

export interface SwapInfo {
  ammKey: string;
  label: string;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  feeAmount: string;
  feeMint: string;
}

export async function getCurrentSOLPrice(): Promise<{
  price: number;
  formattedPrice: string;
}> {
  const response = await fetch(
    "https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=1000000&slippageBps=1"
  );
  const data = (await response.json()) as GetCurrentSolPriceResponse;
  const price = Number(Number(data.outAmount).toFixed(3)) / 1000;

  const formattedPrice = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  }).format(price);

  return {
    price,
    formattedPrice,
  };
}
