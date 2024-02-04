import {
  useAccount,
  useContract,
  useContractWrite,
  useNetwork,
} from "@starknet-react/core";
import { useMemo } from "react";
const erc20ABI = [
  {
    name: "WagerContractImpl",
    type: "impl",
    interface_name: "wager_alpha::IWagerContract",
  },
  {
    name: "core::integer::u256",
    type: "struct",
    members: [
      {
        name: "low",
        type: "core::integer::u128",
      },
      {
        name: "high",
        type: "core::integer::u128",
      },
    ],
  },
  {
    name: "wager_alpha::IWagerContract",
    type: "interface",
    items: [
      {
        name: "bet",
        type: "function",
        inputs: [
          {
            name: "text",
            type: "core::felt252",
          },
          {
            name: "amount",
            type: "core::integer::u256",
          },
          {
            name: "predictor",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "challenger",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "resolution_date",
            type: "core::integer::u256",
          },
          {
            name: "mediator",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  {
    kind: "enum",
    name: "wager_alpha::WagerContract::Event",
    type: "event",
    variants: [],
  },
];
const contractAddress =
  "0x046809c9a9e1a62ac54f63bdca1d13ca6097661b6af96f32fe856cbcd0f10b05";

export default function WriteContract() {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const { contract } = useContract({
    abi: erc20ABI,
    address: contractAddress,
  });

  const calls = useMemo(() => {
    if (!address || !contract) return [];
    return contract.populateTransaction["bet"]!(address, {
      low: 1,
      high: 0,
    });
  }, [contract, address]);

  const { writeAsync, data, isPending } = useContractWrite({
    calls,
  });

  return (
    <>
      <button onClick={() => writeAsync()}>Transfer</button>
      <p>status: {isPending && <div>Submitting...</div>}</p>
      <p>hash: {data?.transaction_hash}</p>
    </>
  );
}
