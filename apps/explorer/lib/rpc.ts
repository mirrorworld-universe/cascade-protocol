import { createSolanaRpc } from "@solana/web3.js";

// @ts-ignore BigInt doesn't know how to serialize BigInt
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

export const rpc = createSolanaRpc("https://api.devnet.solana.com");
