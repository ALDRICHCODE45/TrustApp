"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { AttendanceChart } from "@/components/AttendanceChart";
import { EmployeeDistribution } from "@/components/CountCharts";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CardFiscalInformation } from "./CardFiscalInformation";
import { ClientesComentariosSections } from "./ClientesComentariosSction";
import { CardCommercialInformation } from "./CardCommercialInformation";
import { Cliente } from "@/lib/data";

interface ClientTabsWrapperProps {
  cliente: Cliente;
}

export function ClientTabsWrapper({ cliente }: ClientTabsWrapperProps) {
  return (
    <Tabs defaultValue="details" className="w-full">
      <Card>
        <CardHeader className="px-6 pb-2 pt-6">
          <TabsList className="grid w-full grid-cols-3 h-full">
            <TabsTrigger value="details" className="text-xs md:text-base">
              Detalles
            </TabsTrigger>
            <TabsTrigger value="comments" className="text-xs md:text-base">
              Comentarios
            </TabsTrigger>
            <TabsTrigger value="statistics" className="text-xs md:text-base">
              Estadísticas
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="p-6">
          {/* Pestaña de detalles */}
          <TabsContent value="details" className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Información comercial */}
              <CardCommercialInformation client={cliente} />
              {/* Información fiscal */}
              <CardFiscalInformation client={cliente} />
            </div>
          </TabsContent>
          {/* Pestaña de comentarios */}
          <TabsContent value="comments" className="mt-0">
            <div className="space-y-4">
              <div className="flex justify-between items-center pr-4">
                <h3 className="text-sm md:text-lg  font-normal md:font-medium">
                  Historial de comentarios
                </h3>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <PlusCircle />
                      Agregar Comentario
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] z-[200]">
                    <DialogHeader>
                      <DialogTitle>Nuevo Comentario</DialogTitle>
                      <Separator />
                    </DialogHeader>
                    {/* Formulario dentro del diálogo */}
                    <div className="text-center text-muted-foreground">
                      Formulario de comentarios en desarrollo
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Comentarios renderizados */}
              <ClientesComentariosSections client={cliente} />
            </div>
          </TabsContent>

          {/* Pestaña de estadísticas */}
          <TabsContent value="statistics" className="mt-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Rendimiento mensual
                </h3>
                <AttendanceChart />
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Métricas de contratación
                </h3>

                {/* Grafica de estadisticas */}
                <EmployeeDistribution />
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}
