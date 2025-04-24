"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, SearchIcon, HistoryIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { LeadStatus } from "@prisma/client";

// Tipos para nuestra función y datos

type LeadStatusRecord = {
  leadId: string;
  empresa: string;
  status: LeadStatus;
  statusDate: string;
  type: "initialState" | "statusChange" | "created";
};

export default function LeadHistoryDrawer() {
  // Estado para las fechas seleccionadas
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date | undefined;
  }>({
    from: new Date(),
    to: undefined,
  });

  // Estado para almacenar los resultados
  const [leadHistory, setLeadHistory] = useState<LeadStatusRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Función para obtener el historial de leads
  const fetchLeadHistory = async () => {
    if (!dateRange.from || !dateRange.to) return;

    setIsLoading(true);
    try {
      // Formateamos las fechas para la API
      const startDate = format(dateRange.from, "yyyy-MM-dd");
      const endDate = format(dateRange.to, "yyyy-MM-dd");

      const response = await fetch(
        `/api/leads/history?startDate=${startDate}&endDate=${endDate}`,
      );

      if (!response.ok) {
        throw new Error("Error al obtener datos de historial");
      }

      const data = await response.json();
      setLeadHistory(data);
    } catch (error) {
      console.error("Error:", error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener el color del badge según el estado
  const getStatusColor = (status: LeadStatus) => {
    const statusColors = {
      Contacto: "bg-slate-500",
      SocialSelling: "bg-blue-500",
      ContactoCalido: "bg-yellow-500",
      Prospecto: "bg-orange-500",
      CitaAgendada: "bg-purple-500",
      CitaValidada: "bg-pink-500",
      Cliente: "bg-green-500",
    };

    return statusColors[status] || "bg-gray-500";
  };

  // Agrupar leads por empresa para mejor visualización
  const groupedLeads = leadHistory.reduce(
    (acc, item) => {
      if (!acc[item.leadId]) {
        acc[item.leadId] = {
          empresa: item.empresa,
          estados: [],
        };
      }

      acc[item.leadId].estados.push({
        status: item.status,
        date: new Date(item.statusDate),
        type: item.type,
      });

      // Ordenar por fecha
      acc[item.leadId].estados.sort(
        (a, b) => a.date.getTime() - b.date.getTime(),
      );

      return acc;
    },
    {} as Record<
      string,
      {
        empresa: string;
        estados: Array<{ status: LeadStatus; date: Date; type: string }>;
      }
    >,
  );

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="gap-2">
          <HistoryIcon className="h-4 w-4" />
          Historial de Leads
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader>
            <DrawerTitle>Historial de Estados de Leads</DrawerTitle>
            <DrawerDescription>
              Visualiza el estado de los leads en un rango de fechas específico
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Selector de rango de fechas */}
              <div className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM/yyyy", {
                              locale: es,
                            })}{" "}
                            -{" "}
                            {format(dateRange.to, "dd/MM/yyyy", { locale: es })}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/yyyy", { locale: es })
                        )
                      ) : (
                        <span>Selecciona un rango de fechas</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <Calendar
                    className="z-[999]"
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => setDateRange(range as any)}
                    initialFocus
                    locale={es}
                  />
                </Popover>
              </div>

              {/* Botón de búsqueda */}
              <Button
                onClick={fetchLeadHistory}
                disabled={!dateRange.from || !dateRange.to || isLoading}
                className="md:w-auto"
              >
                <SearchIcon className="mr-2 h-4 w-4" />
                {isLoading ? "Cargando..." : "Buscar"}
              </Button>
            </div>

            {/* Resultados */}
            {leadHistory.length > 0 ? (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {Object.entries(groupedLeads).map(([leadId, lead]) => (
                  <Card key={leadId} className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{lead.empresa}</CardTitle>
                      <CardDescription>
                        ID: {leadId.substring(0, 8)}...
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {lead.estados.map((estado, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center py-1 border-b last:border-0"
                          >
                            <div className="flex items-center gap-2">
                              <Badge
                                className={cn(
                                  "text-white",
                                  estado.type === "initialState"
                                    ? "bg-slate-700"
                                    : estado.type === "created"
                                      ? "bg-emerald-600"
                                      : getStatusColor(estado.status),
                                )}
                              >
                                {estado.status}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {estado.type === "initialState"
                                  ? "Estado inicial"
                                  : estado.type === "created"
                                    ? "Lead creado"
                                    : "Cambio de estado"}
                              </span>
                            </div>
                            <span className="text-sm">
                              {format(estado.date, "dd/MM/yyyy HH:mm", {
                                locale: es,
                              })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                {isLoading
                  ? "Cargando datos..."
                  : dateRange.from && dateRange.to
                    ? "No se encontraron datos para el rango seleccionado"
                    : "Selecciona un rango de fechas y haz clic en buscar"}
              </div>
            )}
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cerrar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
