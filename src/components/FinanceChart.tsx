"use client";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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
    month: "Ene",
    income: 4000,
    expense: 2400,
    amt: 2400,
  },
  {
    month: "Feb",
    income: 3000,
    expense: 1398,
    amt: 2210,
  },
  {
    month: "Mar",
    income: 2000,
    expense: 9800,
    amt: 2290,
  },
  {
    month: "Abr",
    income: 2780,
    expense: 3908,
    amt: 2000,
  },
  {
    month: "May",
    income: 1890,
    expense: 4800,
    amt: 2181,
  },
  {
    month: "Jun",
    income: 2390,
    expense: 3800,
    amt: 2500,
  },
  {
    month: "Jul",
    income: 3490,
    expense: 4300,
    amt: 2100,
  },
  {
    month: "Ago",
    income: 3490,
    expense: 4300,
    amt: 2100,
  },
  {
    month: "Sep",
    income: 3490,
    expense: 4300,
    amt: 2100,
  },
  {
    month: "Oct",
    income: 3490,
    expense: 4300,
    amt: 2100,
  },
  {
    month: "Nov",
    income: 3490,
    expense: 4300,
    amt: 2100,
  },
  {
    month: "Dic",
    income: 3490,
    expense: 4300,
    amt: 2100,
  },
];

const chartConfig = {
  expense: {
    label: "Expense",
    color: "#C3EBFA",
  },
  income: {
    label: "Income",
    color: "#60a8fb",
  },
  amt: {
    label: "Amounth",
    color: "#ddd",
  },
} satisfies ChartConfig;

export function FinanceChart() {
  return (
    <Card className="">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col items-start">
          <CardTitle>Finance Chart - Multiple</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </div>
        <div className="items-end cursor-pointer">
          <Image src="/moreDark.png" alt="more.." width={20} height={20} />
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
            <Line
              dataKey="income"
              type="monotone"
              stroke="var(--color-expense)"
              strokeWidth={2}
              dot={true}
            />
            <Line
              dataKey="expense"
              type="monotone"
              stroke="var(--color-income)"
              strokeWidth={2}
              dot={true}
            />
            <Line
              dataKey="amt"
              type="monotone"
              stroke="var(--color-amt)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
