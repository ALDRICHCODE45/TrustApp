"use client";
import { RadialBar, RadialBarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

const chartData = [
  {
    name: "Total",
    cantidad: 100,
    fill: "#c3ebfa",
  },
  {
    name: "Boys",
    cantidad: 50,
    fill: "var(--color-boys)",
  },
  {
    name: "Girls",
    cantidad: 50,
    fill: "var(--color-girls)",
  },
];

const chartConfig = {
  boys: {
    label: "Boys",
    color: "#2563eb", // Color amarillo
  },
  girls: {
    label: "Girls",
    color: "#60a8fb", // Color azul claro
  },
} satisfies ChartConfig;

export function CountCharts() {
  return (
    <Card className="flex flex-col  w-full h-full">
      {/* Header */}
      <CardHeader className="items-center p-5">
        <div className="flex  flex-row justify-between items-center w-full">
          <div className="flex flex-col">
            <CardTitle>Empleados</CardTitle>
            <CardDescription className="items-start">
              Descripcion general
            </CardDescription>
          </div>
          <Image
            src="/moreDark.png"
            alt="More options"
            width={20}
            height={20}
            className="cursor-pointer"
          />
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-1 pb-0 relative">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart data={chartData} innerRadius={30} outerRadius={110}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="name" />}
            />
            <RadialBar dataKey="cantidad" background />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex justify-center gap-8 text-sm">
        <div className="flex flex-col items-center gap-1">
          <div className="w-5 h-5 bg-[#60a8fb] rounded-full" />
          <h1 className="font-bold">50</h1>
          <h2 className="text-muted-foreground">Boys (50%)</h2>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-5 h-5 bg-[#C3EBFA] rounded-full" />
          <h1 className="font-bold">50</h1>
          <h2 className="text-muted-foreground">Girls (50%)</h2>
        </div>
      </CardFooter>
    </Card>
  );
}
