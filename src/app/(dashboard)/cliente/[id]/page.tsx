import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { notFound } from "next/navigation";
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
import { ClientTabsWrapper } from "./components/ClientTabsWrapper";
// import { NuevoComentarioForm } from "../../list/reclutamiento/components/CommentSheet";

interface PageProps {
  params: Promise<{ id: string }>;
}

const fetchClient = async (clientId: number): Promise<Cliente | undefined> => {
  // Simular una búsqueda en base de datos
  const cliente = clientesData.find((client) => client.id === clientId);
  return cliente;
};

export default async function ClientProfilePage({ params }: PageProps) {
  const { id } = await params;
  const cliente = await fetchClient(Number(id));

  if (!cliente) {
    notFound();
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
          <ClientTabsWrapper cliente={cliente} />
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
