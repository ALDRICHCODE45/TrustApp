"use client";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

const data = [
  {
    name: "Total",
    count: 100,
    fill: "white",
  },
  {
    name: "Boys",
    count: 50,
    fill: "#FAE27C",
  },
  {
    name: "Girls",
    count: 50,
    fill: "#C3EBFA",
  },
];

import { type ReactElement } from "react";
import Image from "next/image";

export interface CountChartsProps {}

export function CountCharts({}: CountChartsProps): ReactElement {
  return (
    <>
      <div className="w-full bg-white rounded-xl h-full p-4 ">
        {/* TITLE */}
        <div className="">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">Students</h1>
            <Image src="/moreDark.png" alt="" width={20} height={20} />
          </div>
        </div>
        {/* CHART */}
        <div className="relative w-full h-[75%]">
          <ResponsiveContainer>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="100%"
              barSize={32}
              data={data}
            >
              <RadialBar background dataKey="count" />
            </RadialBarChart>
          </ResponsiveContainer>
          <Image
            src="/maleFemale.png"
            alt="maleFemale"
            width={50}
            height={50}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>
        {/* BOTTOM */}
        <div className="flex justify-center gap-16">
          <div className="flex flex-col gap-1">
            <div className="w-5 h-5 bg-sky rounded-full" />
            <h1 className="font-bold">1,234</h1>
            <h2 className="text-sm text-gray-300">Boys (55%)</h2>
          </div>
          <div className="flex flex-col gap-1">
            <div className="w-5 h-5 bg-alYellow rounded-full" />
            <h1 className="font-bold">1,234</h1>
            <h2 className="text-sm text-gray-300">Girls (55%)</h2>
          </div>
        </div>
      </div>
    </>
  );
}
