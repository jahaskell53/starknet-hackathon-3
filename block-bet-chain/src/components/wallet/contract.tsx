"use client";
import { useContract } from "@starknet-react/core";

const testAddress =
  "0x46809c9a9e1a62ac54f63bdca1d13ca6097661b6af96f32fe856cbcd0f10b05";

const abi = [
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

export default function Contract() {
  const { contract } = useContract({ abi: abi, address: testAddress });
  return <div>{contract?.address}</div>;
}
