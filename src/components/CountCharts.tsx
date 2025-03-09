import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { RadialBar, RadialBarChart } from "recharts";

interface EmployeeData {
  name: string;
  cantidad: number;
  fill: string;
}
export const EmployeeDistribution: React.FC = () => {
  const chartData: EmployeeData[] = [
    { name: "Total", cantidad: 100, fill: "#f1f5f9" },
    { name: "Oficina 1", cantidad: 55, fill: "#3b82f6" },
    { name: "Oficina 2", cantidad: 45, fill: "#a5b4fc" },
  ];

  const chartConfig: Record<string, { label: string; color: string }> = {
    Oficina_1: { label: "Oficina 1", color: "#3b82f6" },
    Oficina_2: { label: "Oficina 2", color: "#a5b4fc" },
  };

  return (
    <Card className=" shadow-sm h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center w-full">
          <div>
            <CardTitle className="text-base">Empleados</CardTitle>
            <CardDescription>Personal</CardDescription>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-0 relative">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[220px]"
        >
          <RadialBarChart data={chartData} innerRadius={30} outerRadius={90}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="name" />}
            />
            <RadialBar dataKey="cantidad" background />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex justify-center gap-8 text-sm">
        <div className="flex flex-col items-center gap-1">
          <div className="w-4 h-4 bg-blue-500 rounded-full" />
          <p className="font-medium">55</p>
          <p className="text-slate-500 text-xs">Oficina 1(55%)</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-4 h-4 bg-indigo-300 rounded-full" />
          <p className="font-medium">45</p>
          <p className="text-slate-500 text-xs">Oficina 2(45%)</p>
        </div>
      </CardFooter>
    </Card>
  );
};
