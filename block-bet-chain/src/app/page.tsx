"use client";
import WalletBar from "@/components/WalletBar";
import Contract from "@/components/wallet/contract";
import { useAccount } from "@starknet-react/core";
import ReadContract from "@/components/wallet/readContract";
import WriteContract from "@/components/wallet/writeContract";
import Tabs from "@/components/Tabs";
import Image from "next/image";
import { useState } from "react";
import { Tab } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const { address } = useAccount();
  const idList: number[] = [0, 1, 2];
  const readFunctions: string[][] = [
    ["get_text", "string", "text-center text-md font-medium leading-5", "Prediction: "],
    ["get_amount", "number", "mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500", "Amount: "],
    ["get_resolution_date", "number", "mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500", "Date: "],
    ["get_predictor", "number", "mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500", "Predictor: "],
    ["get_challenger", "number", "mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500", "Challenger: "],
    ["get_mediator", "number", "mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500", "Mediator: "],
    ["get_winner", "number", "mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500", "Winner: "],
  ];

  let [categories] = useState({
    "All Contracts": [
      {
        id: 1,
        title: "Does drinking coffee make you smarter?",
        date: "5h ago",
        commentCount: 5,
        shareCount: 2,
      },
      {
        id: 2,
        title: "So you've bought coffee... now what?",
        date: "2h ago",
        commentCount: 3,
        shareCount: 2,
      },
    ],
    "My Contracts": [
      {
        id: 1,
        title: "Is tech making coffee better or worse?",
        date: "Jan 7",
        commentCount: 29,
        shareCount: 16,
      },
      {
        id: 2,
        title: "The most innovative things happening in coffee",
        date: "Mar 19",
        commentCount: 24,
        shareCount: 12,
      },
    ],
  });

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
          {/* <Tabs /> */}

          <div className="w-full max-w-md px-2 sm:px-0 text-black">
            <Tab.Group>
              <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                {/* {Object.keys(categories).map((category) => (
                  <Tab
                    key={category}
                    className={({ selected }) =>
                      classNames(
                        "w-full rounded-lg py-2.5 text-md font-medium leading-5",
                        "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                        selected
                          ? "bg-gray-200 text-blue-700 shadow"
                          : "text-blue-100 hover:bg-gray-200/[0.12]"
                      )
                    }
                  >
                    {category}
                  </Tab>
                ))} */}
              </Tab.List>
              <Tab.Panels className="mt-2">
                {/* {Object.values(categories).map((posts, idx) => (
                  <Tab.Panel
                    key={idx}
                    className={classNames(
                      "rounded-xl bg-gray-200 p-3",
                      "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                    )}
                  >
                    <ul>
                      {posts.map((post) => (
                        <li
                          key={post.id}
                          className="relative rounded-md p-3 hover:bg-gray-100"
                        >
                          <h3 className="text-md font-medium leading-5">
                            {post.title}
                          </h3>

                          <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
                            <li>{post.date}</li>
                            <li>&middot;</li>
                            <li>{post.commentCount} comments</li>
                            <li>&middot;</li>
                            <li>{post.shareCount} shares</li>
                          </ul>

                          <a
                            href="#"
                            className={classNames(
                              "absolute inset-0 rounded-md",
                              "ring-blue-400 focus:z-10 focus:outline-none focus:ring-2"
                            )}
                          />
                        </li>
                      ))}
                    </ul>
                  </Tab.Panel>
                ))} */}
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
       <ul className={classNames(
  "rounded-xl bg-gray-200 p-3",
  "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
  "relative rounded-md p-3 text-black"
)}>
  {idList.map((currId, index) => (
    <li key={`id-${currId}`} className="relative rounded-md p-3 hover:bg-gray-100 text-black">
      {readFunctions.map((currFunc, funcIndex) => (
        // Assuming you want to list each readFunction as a separate list item
        <ul key={`func-${currId}-${funcIndex}`} className="space-y-2">
          <li>
            <ReadContract
              func={currFunc}
              id={currId}
            />
          </li>
        </ul>
      ))}
    </li>
  ))}
</ul>

      </div>
    </main>
  );
}
