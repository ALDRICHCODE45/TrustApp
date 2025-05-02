import { CalendarIcon, SearchIcon } from "lucide-react";

interface EmptyStateProps {
  isLoading: boolean;
  isDateRangeValid: boolean;
  hasFiltersApplied: boolean;
}

export function EmptyState({
  isLoading,
  isDateRangeValid,
  hasFiltersApplied,
}: EmptyStateProps) {
  return (
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
            {hasFiltersApplied && " y los filtros aplicados"}
          </p>
          <p className="mt-2 text-sm">
            {hasFiltersApplied
              ? "Intenta con un rango de fechas diferente o ajusta los filtros"
              : "Intenta con un rango de fechas diferente"}
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
  );
}
