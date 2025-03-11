"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { notFound, useParams } from "next/navigation";
import { Cliente, clientesData } from "@/lib/data";
import { Separator } from "@/components/ui/separator";
import { AttendanceChart } from "@/components/AttendanceChart";
import { EmployeeDistribution } from "@/components/CountCharts";
import { Button } from "@/components/ui/button";
import { TrendingUp, X, Check, AlertCircle, PlusCircle } from "lucide-react";
import { ClientProfileHeader } from "./components/ClientProfileHeader";
import { CardGeneralInformation } from "./components/CardGeneralInformation";
import { CardFiscalInformation } from "./components/CardFiscalInformation";
import { ClientesComentariosSections } from "./components/ClientesComentariosSction";
import { ResumenFinancieroCard } from "./components/ResumenFinancieroCard";
import { ClientesContactosCard } from "./components/ClientesContactosCard";
import { CardCommercialInformation } from "./components/CardCommercialInformation";
import Loading from "./loading";
import { useEffect, useState } from "react";

const fetchClient = async (clientId: number): Promise<Cliente | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const cliente = clientesData.find((client) => client.id === clientId);
      resolve(cliente);
    }, 1000);
  });
};

export default function ClientProfilePage() {
  const { id } = useParams();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCliente = async () => {
      try {
        setIsLoading(true);
        const client = await fetchClient(Number(id));
        if (!client) {
          notFound();
        }
        setCliente(client);
      } catch {
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    loadCliente();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  if (!cliente) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Encabezado y resumen general */}
      <ClientProfileHeader client={cliente} />
      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda y central (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tarjetas de KPI */}
          <div className="grid grid-cols-2  md:grid-cols-2 lg:grid-cols-4  gap-4">
            <CardGeneralInformation
              borderColor="border-l-primary"
              Icon={TrendingUp}
              iconColor="text-green-500"
              info={cliente.asignadas}
              title="Asignadas"
            />

            <CardGeneralInformation
              borderColor="border-l-[#ff0033]"
              Icon={X}
              iconColor="text-destructive"
              info={cliente.perdidas}
              title="Perdidas"
            />
            <CardGeneralInformation
              borderColor="border-l-[#f5a010]"
              Icon={AlertCircle}
              iconColor="text-amber-500"
              info={cliente.canceladas}
              title="Canceladas"
            />
            <CardGeneralInformation
              borderColor="border-l-green-500"
              Icon={Check}
              iconColor="text-green-500"
              info={cliente.placements}
              title="Placements"
            />
          </div>
          {/* Pestañas principales */}
          <Tabs defaultValue="details" className="w-full">
            <Card>
              <CardHeader className="px-6 pb-2 pt-6">
                <TabsList className="grid w-full grid-cols-3 h-full">
                  <TabsTrigger value="details" className="text-xs md:text-base">
                    Detalles
                  </TabsTrigger>
                  <TabsTrigger value="comments" className="text-xs :text-base">
                    Comentarios
                  </TabsTrigger>
                  <TabsTrigger
                    value="statistics"
                    className="text-xs md:text-base"
                  >
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
                      <Button size="sm" variant="outline" className="gap-1">
                        <PlusCircle size={16} />
                        <span className="hidden md:block">
                          Nuevo comentario
                        </span>
                      </Button>
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
        </div>
        {/* Columna derecha (1/3) */}
        <div className="space-y-6">
          {/* Resumen financiero Component */}
          <ResumenFinancieroCard client={cliente} />
          {/* Contactos */}
          <ClientesContactosCard client={cliente} />
        </div>
      </div>
    </div>
  );
}
