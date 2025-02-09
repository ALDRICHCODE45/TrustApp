"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Image from "next/image";

const data = [
  {
    month: "Lun",
    present: 60,
    absent: 39,
  },
  {
    month: "Mar",
    present: 99,
    absent: 34,
  },
  {
    month: "Mie",
    present: 23,
    absent: 11,
  },
  {
    month: "Jue",
    present: 32,
    absent: 87,
  },
  {
    month: "Vie",
    present: 88,
    absent: 29,
  },
];
const chartConfig = {
  desktop: {
    label: "Present",
    color: "#2563eb",
  },
  mobile: {
    label: "Absent",
    color: "#60a8fb",
  },
} satisfies ChartConfig;

export function AttendanceChart() {
  return (
    <Card className="rounded-xl h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <CardTitle>Bar Chart - Multiple</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </div>

        <div className="cursor-pointer">
          <Image src="/moreDark.png" alt="" width={20} height={20} />
        </div>
      </CardHeader>
      <CardContent className="">
        <ChartContainer config={chartConfig} className="w-full h-[345px]">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="present" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="absent" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
