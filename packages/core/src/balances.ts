// We hard code this to 1e9 because it's the number of lamports in 1 SOL
export const LAMPORTS_PER_SOL = 1000000000;

/** Convert lamports to SOL */
export function lamportsToSol(lamports: number | bigint): number {
  if (typeof lamports === "number") {
    return lamports / LAMPORTS_PER_SOL;
  }

  let signMultiplier = 1;
  if (lamports < 0) {
    signMultiplier = -1;
  }

  const absLamports = lamports < 0 ? -lamports : lamports;
  const lamportsString = absLamports.toString(10).padStart(10, "0");
  const splitIndex = lamportsString.length - 9;
  const solString =
    lamportsString.slice(0, splitIndex) +
    "." +
    lamportsString.slice(splitIndex);
  return signMultiplier * parseFloat(solString);
}

/** Convert Lamports to a SOL string */
export function lamportsToSolString(
  lamports: number | bigint,
  maximumFractionDigits = 9
): string {
  const sol = lamportsToSol(lamports);
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(sol);
}

export type $$SOL = "◎";

export const SOL = "◎";
export const $SOL = SOL.toString() as $$SOL;
