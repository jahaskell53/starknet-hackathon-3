import { useAccount, useContractRead } from "@starknet-react/core";

const testAddress =
  "0x1235451dbfb2d16d6c18a00725bec5ae595556e3348d4350aa8f25757227ee0";

const abi = [
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

export default function ReadContract() {
  const { address } = useAccount();

  const { data, isError, isLoading, error } = useContractRead({
    functionName: "get_votes",
    args: [],
    abi,
    address: testAddress,
    watch: true,
  });

  if (isLoading) return <div>Loading ...</div>;
  if (isError || !data) return <div>{error?.message}</div>;
  //@ts-ignore
  return (
    <div>
      {JSON.stringify(data, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
      )}
    </div>
  );
}
