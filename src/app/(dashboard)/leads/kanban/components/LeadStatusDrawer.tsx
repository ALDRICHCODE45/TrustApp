"use client";
import { useMemo, useState } from "react";
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
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  SearchIcon,
  UserIcon,
  BuildingIcon,
  FilterIcon,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { LeadStatus } from "@prisma/client";
import { leadStatusMap } from "@/app/(dashboard)/list/leads/components/LeadChangeStatus";
import { User } from "@prisma/client";
import { toast } from "sonner";
import { Oficina } from "@prisma/client";

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

  //filtros
  const [generador, setGenerador] = useState<User>();
  const [oficina, setOficina] = useState<Oficina>();

  // Función simplificada para obtener el historial de leads
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
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al obtener el historial de leads");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener el color del badge según el estado
  const getStatusColor = (status: LeadStatus) => {
    const statusColors = {
      Contacto: "bg-slate-500 hover:bg-slate-600",
      SocialSelling: "bg-blue-500 hover:bg-blue-600",
      ContactoCalido: "bg-yellow-500 hover:bg-yellow-600",
      Prospecto: "bg-orange-500 hover:bg-orange-600",
      CitaAgendada: "bg-purple-500 hover:bg-purple-600",
      CitaValidada: "bg-pink-500 hover:bg-pink-600",
      Cliente: "bg-green-500 hover:bg-green-600",
      Eliminado: "bg-red-500 hover:bg-red-600",
    };

    return statusColors[status] || "bg-gray-500";
  };

  // Agrupar leads por empresa para mejor visualización
  const groupedLeads = useMemo(() => {
    return leadHistory.reduce(
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
          generador: item.generador,
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
          estados: Array<{
            status: LeadStatus;
            date: Date;
            type: string;
            generador: User;
          }>;
          generador: User;
        }
      >,
    );
  }, [leadHistory]);

  const isDateRangeValid = Boolean(dateRange?.from && dateRange?.to);

  return (
    <div className="w-full h-full pt-7 flex flex-col">
      {/* Contenido principal */}
      <div className="py-6 flex-1 flex flex-col px-6 ">
        <Card className="mb-6 shadow-md border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Filtros de búsqueda
            </CardTitle>
            <CardDescription>
              Configura el rango de fechas para la consulta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Selector de rango de fechas */}
              <div className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                      {isDateRangeValid ? (
                        <>
                          {format(dateRange?.from!, "dd/MM/yyyy", {
                            locale: es,
                          })}{" "}
                          -{" "}
                          {format(dateRange?.to!, "dd/MM/yyyy", { locale: es })}
                        </>
                      ) : (
                        <span>Selecciona un rango de fechas</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="z-50 shadow-xl border-slate-200 dark:border-slate-700 p-0">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => setDateRange(range as any)}
                      locale={es}
                      className="rounded-md border-0"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Botón de búsqueda */}
              <Button
                onClick={fetchLeadHistory}
                disabled={!dateRange?.from || !dateRange.to || isLoading}
                className="md:w-auto bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <SearchIcon className="mr-2 h-4 w-4" />
                {isLoading ? "Cargando..." : "Buscar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="flex-1 overflow-y-scroll max-h-[470px]">
          {leadHistory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full overflow-y-auto pb-6">
              {Object.entries(groupedLeads).map(([leadId, lead]) => (
                <Card
                  key={leadId}
                  className="shadow-lg flex flex-col h-full hover:shadow-xl transition-shadow border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                        {lead.empresa}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-0 border-slate-300 dark:border-slate-600"
                      >
                        ID: {leadId.substring(0, 8)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 flex-1 overflow-y-auto">
                    <div className="space-y-3 h-full overflow-y-scroll">
                      {lead.estados.map((estado, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "flex justify-between items-center py-2 px-3 rounded-md",
                            idx % 2 === 0
                              ? "bg-slate-50 dark:bg-slate-800/50"
                              : "",
                          )}
                        >
                          <Badge
                            className={cn(
                              "text-white font-medium px-2 py-1 transition-colors",
                              getStatusColor(estado.status),
                            )}
                          >
                            {leadStatusMap[estado.status]}
                          </Badge>

                          <div className="flex flex-col items-end text-right">
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                              {format(estado.date, "dd MMM yyyy", {
                                locale: es,
                              })}
                            </span>
                            <div className="flex gap-3">
                              <div className="flex gap-2 items-center">
                                <UserIcon size={13} className="text-gray-600" />
                                <span className="text-xs">
                                  {estado.generador.name}
                                </span>
                              </div>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {format(estado.date, "HH:mm", {
                                  locale: es,
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 pb-4  px-6 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/30">
                    {lead.estados.length} actualizaciones
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/30 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
              {isLoading ? (
                <>
                  <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-blue-200 animate-spin mb-4"></div>
                  <p className="font-medium">Cargando datos...</p>
                </>
              ) : isDateRangeValid ? (
                <>
                  <SearchIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                  <p className="font-medium">
                    No se encontraron datos para el rango seleccionado
                  </p>
                  <p className="mt-2 text-sm">
                    Intenta con un rango de fechas diferente
                  </p>
                </>
              ) : (
                <>
                  <CalendarIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                  <p className="font-medium">
                    Selecciona un rango de fechas y haz clic en buscar
                  </p>
                  <p className="mt-2 text-sm">
                    Visualiza el historial de estados de tus leads
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
