import { useAccount, useContractRead } from "@starknet-react/core";
const hex2ascii = require("hex2ascii");

const testAddress =
  "0x07bbee915f7e3dfa5f11f70739585657682eb6bf03385cb20aa97e4dd8cd8a63";

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

function convertToString(bigintInput: bigint) {
  // Convert the bigint to a string to work with its digits
  const stringInput = bigintInput.toString(16);
  return hex2ascii(stringInput);
}

function processIfBigInt(
  data: string | bigint | true | { [key: string]: any }
): string {
  // Check if data is of type bigint, then process
  const result = typeof data === "bigint" ? convertToString(data) : "";

  return result ?? "";
}

export default function ReadContract() {
  const { address } = useAccount();

  const { data, isError, isLoading, error } = useContractRead({
    functionName: "get_text",
    args: [1],
    abi,
    address: testAddress,
    watch: true,
  });

  if (isLoading) return <div>Loading ...</div>;
  if (isError || !data) return <div>{error?.message}</div>;
  //@ts-ignore
  return (
    <div>
      {/* {data.toLocaleString()} */}
      {processIfBigInt(data)}
      {/* {String.fromCharCode(32)} */}
      {/* {JSON.stringify(data, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
      )} */}
    </div>
  );
}
