"use client";
import WalletBar from "@/components/WalletBar";
import Contract from "@/components/wallet/contract";
import { useAccount } from "@starknet-react/core";
import ReadContract from "@/components/wallet/readContract";
import WriteContract from "@/components/wallet/writeContract";
import Tabs from "@/components/Tabs";
import Image from "next/image";

export default function Home() {
  const { address } = useAccount();

  return (
    // items-center justify-center
    <main className="flex flex-col min-h-screen gap-12 p-16">
      <div className="flex justify-between items-center p-4">
        <Image
          src={"/cube.svg"}
          height={55}
          width={55}
          alt={"cube"}
          className=" mr-3"
        ></Image>
        <h1 className="flex-1 font-bold text-xl">block-bet-chain</h1>
        <WalletBar />
      </div>
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-end">
          <button className="my-3 bg-cyan-300 rounded-md p-2 text-black hover:bg-cyan-400">
            <p>Add New Contract</p>
          </button>
          <Tabs />
        </div>
        <ReadContract />
        {/* <WriteContract /> */}
      </div>
    </main>
  );
}
