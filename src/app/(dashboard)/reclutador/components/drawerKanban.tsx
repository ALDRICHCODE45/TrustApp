"use client";
import * as React from "react";
import { ChartSpline } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Datos de ejemplo: Distribución de vacantes

// Tiempo promedio de placement (en días)
const avgPlacementTime = 6.5;
const chartData = [
  { month: "January", perdidas: 186, placement: 80 },
  { month: "February", perdidas: 305, placement: 200 },
  { month: "March", perdidas: 237, placement: 120 },
  { month: "April", perdidas: 73, placement: 190 },
  { month: "May", perdidas: 209, placement: 130 },
  { month: "June", perdidas: 214, placement: 140 },
];
const chartConfig = {
  desktop: {
    label: "perdidas",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "placement",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function DrawerKanban() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="mt-4">
          <ChartSpline className="h-4 w-4" />
          Estadísticas
        </Button>
      </DrawerTrigger>
      <DrawerContent className="">
        <div className="mx-auto w-full max-w-xl p-4 rounded-lg shadow-md dark:shadow-gray-800">
          {/* Header */}
          <div className="mb-4 text-center">
            <h3 className="text-xl font-bold dark:text-gray-100">
              Estadísticas de Placement
            </h3>
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              Información sobre el desempeño del reclutador.
            </p>
          </div>

          {/* Gráfico Circular: Distribución de Vacantes */}
          <div className="mb-6">
            <ChartContainer config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  dataKey="perdidas"
                  type="natural"
                  fill="var(--color-mobile)"
                  fillOpacity={0.4}
                  stroke="var(--color-mobile)"
                  stackId="a"
                />
                <Area
                  dataKey="placement"
                  type="natural"
                  fill="var(--color-desktop)"
                  fillOpacity={0.4}
                  stroke="var(--color-desktop)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </div>

          {/* Información Textual: Tiempo Promedio de Placement */}
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-2 dark:text-gray-100">
              Tiempo Promedio de Placement
            </h4>
            <p className="text-2xl font-bold dark:text-gray-100">
              {avgPlacementTime} días
            </p>
          </div>

          {/* Footer */}
          <DrawerFooter className="mt-6">
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="w-full dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                Cerrar
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
