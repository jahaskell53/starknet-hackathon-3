"use client";
import WalletBar from "@/components/WalletBar";
import Contract from "@/components/wallet/contract";
import { useAccount } from "@starknet-react/core";
import ReadContract from "@/components/wallet/readContract";

export default function Home() {
  const { address } = useAccount();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-12">
      <WalletBar />
      <Contract />
      <ReadContract />
    </main>
  );
}
