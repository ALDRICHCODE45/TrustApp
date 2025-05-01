"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { CalendarIcon, SearchIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { LeadStatus } from "@prisma/client";
import { leadStatusMap } from "@/app/(dashboard)/list/leads/components/LeadChangeStatus";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@prisma/client";

// Tipos para nuestra función y datos
type LeadStatusRecord = {
  leadId: string;
  empresa: string;
  status: LeadStatus;
  statusDate: string;
  type: "initialState" | "statusChange" | "created";
  generador: User;
};

export default function LeadHistory() {
  // Estado para las fechas seleccionadas
  const [dateRange, setDateRange] = useState<
    | {
        from: Date | undefined;
        to: Date | undefined;
      }
    | undefined
  >({
    from: new Date(),
    to: undefined,
  });

  // Estado para almacenar los resultados
  const [leadHistory, setLeadHistory] = useState<LeadStatusRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Función para obtener el historial de leads
  const fetchLeadHistory = async () => {
    if (!dateRange?.from || !dateRange.to) return;

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
      console.log({ data });
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
      Eliminado: "bg-red-500",
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
          generador: item.generador,
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
        generador: User;
      }
    >,
  );

  const isDateRangeValid = Boolean(dateRange?.from && dateRange?.to);

  return (
    <div className="w-full h-full pt-7 flex flex-col animate__animated animate__fadeInUp">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-semibold">
          Historial de Estados de Leads
        </h2>
        <p className="text-muted-foreground mt-1">
          Visualiza el estado de los leads en un rango de fechas específico
        </p>
      </div>

      {/* Contenido principal */}
      <div className="py-6 flex-1 flex flex-col">
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
                  {isDateRangeValid ? (
                    <>
                      {format(dateRange?.from!, "dd/MM/yyyy", {
                        locale: es,
                      })}{" "}
                      - {format(dateRange?.to!, "dd/MM/yyyy", { locale: es })}
                    </>
                  ) : (
                    <span>Selecciona un rango de fechas</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="z-50">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => setDateRange(range as any)}
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel></SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Generador" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Generadores</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Botón de búsqueda */}
          <Button
            onClick={fetchLeadHistory}
            disabled={!dateRange?.from || !dateRange.to || isLoading}
            className="md:w-auto"
          >
            <SearchIcon className="mr-2 h-4 w-4" />
            {isLoading ? "Cargando..." : "Buscar"}
          </Button>
        </div>

        {/* Resultados */}
        <div className="flex-1 overflow-hidden">
          {leadHistory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full overflow-y-auto pb-4">
              {Object.entries(groupedLeads).map(([leadId, lead]) => (
                <Card key={leadId} className="shadow-sm h-fit">
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
                              variant="destructive"
                              className={cn(
                                "text-white",
                                estado.type === "initialState"
                                  ? "bg-slate-700"
                                  : estado.type === "created"
                                    ? "bg-emerald-600"
                                    : getStatusColor(estado.status),
                              )}
                            >
                              {leadStatusMap[estado.status]}
                            </Badge>
                            {/* <span className="text-sm text-muted-foreground"> */}
                            {/*   {estado.type === "initialState" */}
                            {/*     ? "Estado inicial" */}
                            {/*     : estado.type === "created" */}
                            {/*       ? "Lead creado" */}
                            {/*       : "Cambio de estado"} */}
                            {/* </span> */}
                          </div>
                          <span className="text-gray-400">
                            {lead.generador.name}
                          </span>
                          <span className="text-sm">
                            {format(estado.date, "EEE dd/MM/yy HH:mm", {
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
            <div className="h-full flex items-center justify-center text-center text-muted-foreground">
              {isLoading
                ? "Cargando datos..."
                : isDateRangeValid
                  ? "No se encontraron datos para el rango seleccionado"
                  : "Selecciona un rango de fechas y haz clic en buscar"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
