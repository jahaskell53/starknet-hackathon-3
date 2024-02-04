"use client";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useMemo } from "react";
import { Button } from "./ui/Button";

function WalletConnected() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const shortenedAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  return (
    <div className="flex flex-col items-center">
      <span>Connected: {shortenedAddress}</span>
      <button
        className="p-4 bg-rose-400 rounded-md hover:bg-rose-500 text-black"
        onClick={() => disconnect()}
      >
        Disconnect from wallet
      </button>
    </div>
  );
}

function ConnectWallet() {
  const { connectors, connect } = useConnect();

  return (
    <div>
      {/* <span>Choose a wallet: </span> */}
      {connectors.map((connector) => {
        return (
          <Button
            key={connector.id}
            onClick={() => connect({ connector })}
            className="gap-x-2 mr-2 bg-cyan-300 text-black hover:bg-cyan-500"
          >
            Connect to Wallet!
          </Button>
        );
      })}
    </div>
  );
}

export default function WalletBar() {
  const { address } = useAccount();

  return address ? <WalletConnected /> : <ConnectWallet />;
}
