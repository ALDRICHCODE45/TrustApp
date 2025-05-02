"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { LeadStatus, Oficina, User } from "@prisma/client";
import { LeadFilters } from "./historyComponents/LeadFilters";
import { LeadCards } from "./historyComponents/LeadCards";
import { EmptyState } from "./historyComponents/EmptyState";

// Tipos para nuestra función y datos
export type LeadStatusRecord = {
  leadId: string;
  empresa: string;
  status: LeadStatus;
  statusDate: string;
  type: "initialState" | "statusChange" | "created";
  generador: User;
};

export interface FilterState {
  generadorId: string | null;
  oficina: Oficina | null;
  fechaProspeccion: Date | null;
}

interface Props {
  generadores: User[];
}

export default function LeadHistory({ generadores }: Props) {
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

  // Estados separados para datos originales y filtrados
  const [originalLeadHistory, setOriginalLeadHistory] = useState<
    LeadStatusRecord[]
  >([]);
  const [filteredLeadHistory, setFilteredLeadHistory] = useState<
    LeadStatusRecord[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // Estado de filtros
  const [filters, setFilters] = useState<FilterState>({
    generadorId: null,
    oficina: null,
    fechaProspeccion: null,
  });

  // Limpiar filtros
  const cleanFilters = () => {
    setFilters({
      fechaProspeccion: null,
      generadorId: null,
      oficina: null,
    });
  };

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

      // Guardar los datos originales
      setOriginalLeadHistory(data);
      // Inicialmente, los datos filtrados son iguales a los originales
      setFilteredLeadHistory(data);

      // Restablecer filtros al cargar nuevos datos
      cleanFilters();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al obtener el historial de leads");
    } finally {
      setIsLoading(false);
    }
  };

  // Aplicar filtros a los datos originales cuando cambien los filtros
  useEffect(() => {
    if (originalLeadHistory.length === 0) return;

    let result = [...originalLeadHistory];

    if (filters.generadorId) {
      result = result.filter(
        (lead) => lead.generador.id === filters.generadorId,
      );
    }

    if (filters.oficina) {
      result = result.filter(
        (lead) => lead.generador.Oficina === filters.oficina,
      );
    }

    setFilteredLeadHistory(result);
  }, [filters, originalLeadHistory]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const isDateRangeValid = Boolean(dateRange?.from && dateRange?.to);
  const hasFiltersApplied =
    filters.generadorId !== null || filters.oficina !== null;
  const isDisable = originalLeadHistory.length === 0;

  return (
    <div className="w-full h-full pt-7 flex flex-col">
      {/* Contenido principal */}
      <div className="py-6 flex-1 flex flex-col px-6">
        <LeadFilters
          dateRange={dateRange}
          setDateRange={setDateRange}
          isLoading={isLoading}
          fetchLeadHistory={fetchLeadHistory}
          filters={filters}
          handleFilterChange={handleFilterChange}
          cleanFilters={cleanFilters}
          hasFiltersApplied={hasFiltersApplied}
          isDisable={isDisable}
          generadores={generadores}
        />

        {/* Resultados */}
        <div className="flex-1 overflow-y-auto max-h-[470px]">
          {filteredLeadHistory.length > 0 ? (
            <LeadCards filteredLeadHistory={filteredLeadHistory} />
          ) : (
            <EmptyState
              isLoading={isLoading}
              isDateRangeValid={isDateRangeValid}
              hasFiltersApplied={hasFiltersApplied}
            />
          )}
        </div>
      </div>
    </div>
  );
}
