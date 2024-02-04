"use client";

import {
  useAccount,
  useContract,
  useContractWrite,
  useNetwork,
} from "@starknet-react/core";
import { useEffect, useMemo, useState } from "react";
import { uint256 } from "starknet";
const testAddress =
  "0x0795d7470221e243e3da6475c463f313ec8884d5df2f7fb3e0259ff8fbea06ba";

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
      {
        name: "accept",
        type: "function",
        inputs: [
          {
            name: "id",
            type: "core::integer::u32",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "decide",
        type: "function",
        inputs: [
          {
            name: "id",
            type: "core::integer::u32",
          },
          {
            name: "winner",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "get_text",
        type: "function",
        inputs: [
          {
            name: "id",
            type: "core::integer::u32",
          },
        ],
        outputs: [
          {
            type: "core::felt252",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "get_amount",
        type: "function",
        inputs: [
          {
            name: "id",
            type: "core::integer::u32",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "get_resolution_date",
        type: "function",
        inputs: [
          {
            name: "id",
            type: "core::integer::u32",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "get_predictor",
        type: "function",
        inputs: [
          {
            name: "id",
            type: "core::integer::u32",
          },
        ],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "get_challenger",
        type: "function",
        inputs: [
          {
            name: "id",
            type: "core::integer::u32",
          },
        ],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "get_mediator",
        type: "function",
        inputs: [
          {
            name: "id",
            type: "core::integer::u32",
          },
        ],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "get_winner",
        type: "function",
        inputs: [
          {
            name: "id",
            type: "core::integer::u32",
          },
        ],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
      },
    ],
  },
  {
    name: "constructor",
    type: "constructor",
    inputs: [],
  },
  {
    kind: "enum",
    name: "wager_alpha::WagerContract::Event",
    type: "event",
    variants: [],
  },
];

interface WriteContractProps {
  type: string;
  text: string; // You might want to use a more specific type than `Function` based on what you expect
  amount: number;
  resolution_year: number;
  mediator: number;
}

// export default function WriteContract() {
export default function AddBetModal({
  type,
  text,
  amount,
  resolution_year,
  mediator,
}: WriteContractProps) {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { contract } = useContract({
    abi: abi,
    address: testAddress,
  });

  const [txt, setText] = useState("txt");
  const [amt, setAmt] = useState(1);
  const [resDate, setResDate] = useState(2024);
  const [med, setMediator] = useState(0);

  const calls = useMemo(() => {
    if (!address || !contract) return [];
    const vote = 1;
    // return contract.populateTransaction["vote"]!(vote);
    // return contract.populateTransaction["bet"]!("veganInFuture", 888, 888, 1);
    console.log(txt, amt, resDate, med);

    return contract.populateTransaction["bet"]!(txt, 888, 123, 1);
  }, [contract, address, txt, amt, resDate, med]);

  function sampleHandler() {
    writeAsync();
  }

  const { writeAsync, data, isPending } = useContractWrite({
    calls,
  });

  return (
    <>
      <form className="flex flex-col">
        <input
          onChange={(e) => setText(e.target.value)}
          className="text-black mb-2"
          placeholder="text"
        ></input>
        <input
          onChange={(e) => setAmt(parseInt(e.target.value))}
          className="text-black mb-2"
          placeholder="amount"
        ></input>
        <input
          onChange={(e) => setResDate(parseInt(e.target.value))}
          className="text-black mb-2"
          placeholder="resolution_year"
        ></input>
        <input
          onChange={(e) => setMediator(parseInt(e.target.value))}
          className="text-black mb-2"
          placeholder="mediator"
        ></input>
      </form>
      <button onClick={() => sampleHandler()}>Vote</button>
      <p>status: {isPending && <div>Submitting...</div>}</p>
      <p>hash: {data?.transaction_hash}</p>
    </>
  );
}
