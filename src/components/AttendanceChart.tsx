"use client";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";

interface PerformanceData {
  month: string;
  present: number;
  absent: number;
}
/* PERFORMANCE CHART */
export const AttendanceChart: React.FC = () => {
  const data: PerformanceData[] = [
    { month: "Lun", present: 60, absent: 39 },
    { month: "Mar", present: 99, absent: 34 },
    { month: "Mie", present: 23, absent: 11 },
    { month: "Jue", present: 32, absent: 87 },
    { month: "Vie", present: 88, absent: 29 },
  ];

  const chartConfig: Record<string, { label: string; color: string }> = {
    present: { label: "Presente", color: "#3b82f6" },
    absent: { label: "Ausente", color: "#e2e8f0" },
  };

  return (
    <Card className=" shadow-sm h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base">Rendimiento</CardTitle>
            <CardDescription>Junio - Julio 2024</CardDescription>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[260px]">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              opacity={0.2}
            />
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
            <Bar dataKey="present" fill="var(--color-present)" radius={4} />
            <Bar dataKey="absent" fill="var(--color-absent)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
