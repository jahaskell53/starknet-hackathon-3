"use client";

import {
  useAccount,
  useContract,
  useContractWrite,
  useNetwork,
} from "@starknet-react/core";
import { useEffect, useMemo, useState } from "react";
import { uint256 } from "starknet";
const erc20ABI = [
  {
    name: "VotingContractImpl",
    type: "impl",
    interface_name: "voting::IVotingContract",
  },
  {
    name: "voting::IVotingContract",
    type: "interface",
    items: [
      {
        name: "vote",
        type: "function",
        inputs: [
          {
            name: "vote",
            type: "core::felt252",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "get_votes",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "(core::felt252, core::felt252)",
          },
        ],
        state_mutability: "view",
      },
    ],
  },
  {
    kind: "enum",
    name: "voting::VotingContract::Event",
    type: "event",
    variants: [],
  },
];
const contractAddress =
  "0x0795d7470221e243e3da6475c463f313ec8884d5df2f7fb3e0259ff8fbea06ba";

interface WriteContractProps {
  type: string;
  text: string; // You might want to use a more specific type than `Function` based on what you expect
  amount: number;
  resolution_year: number;
  mediator: number;
}

// export default function WriteContract() {
export default function WriteContract({
  type,
  text,
  amount,
  resolution_year,
  mediator,
}: WriteContractProps) {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { contract } = useContract({
    abi: erc20ABI,
    address: contractAddress,
  });

  const [voteVal, setVoteVal] = useState(0);

  const calls = useMemo(() => {
    if (!address || !contract) return [];
    const vote = 1;
    return contract.populateTransaction["vote"]!(vote);
  }, [contract, address]);

  const { writeAsync, data, isPending } = useContractWrite({
    calls,
  });

  return (
    <>
      <div>
        Add value here:
        <input onChange={(e) => setVoteVal(parseInt(e.target.value))}></input>
      </div>
      <button onClick={() => writeAsync()}>Vote</button>
      <p>status: {isPending && <div>Submitting...</div>}</p>
      <p>hash: {data?.transaction_hash}</p>
    </>
  );
}
