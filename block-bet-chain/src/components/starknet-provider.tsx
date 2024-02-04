"use client";
import { ReactNode } from "react";

import { Chain, devnet, goerli, mainnet } from "@starknet-react/chains";
import {
  StarknetConfig,
  argent,
  braavos,
  jsonRpcProvider,
  publicProvider,
  useInjectedConnectors,
  voyager,
} from "@starknet-react/core";

export function StarknetProvider({ children }: { children: ReactNode }) {
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [argent()],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: "onlyIfNoConnectors",
    // Randomize the order of the connectors.
    order: "random",
  });

  function rpc(chain: Chain) {
    return {
      nodeUrl: `https://starknet-testnet.public.blastapi.io/rpc/v0_6`,
    };
  }

  return (
    <StarknetConfig
      chains={[mainnet]}
      // provider={publicProvider()}
      provider={jsonRpcProvider({ rpc })}
      connectors={connectors}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
}
