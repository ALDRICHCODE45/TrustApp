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
import { CalendarIcon, SearchIcon, XCircleIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Oficina, User } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterState } from "../LeadHistory";

interface LeadFiltersProps {
  dateRange:
    | {
        from: Date | undefined;
        to: Date | undefined;
      }
    | undefined;
  setDateRange: React.Dispatch<
    React.SetStateAction<
      | {
          from: Date | undefined;
          to: Date | undefined;
        }
      | undefined
    >
  >;
  isLoading: boolean;
  fetchLeadHistory: () => Promise<void>;
  filters: FilterState;
  handleFilterChange: (key: keyof FilterState, value: any) => void;
  cleanFilters: () => void;
  hasFiltersApplied: boolean;
  isDisable: boolean;
  generadores: User[];
}

export function LeadFilters({
  dateRange,
  setDateRange,
  isLoading,
  fetchLeadHistory,
  filters,
  handleFilterChange,
  cleanFilters,
  hasFiltersApplied,
  isDisable,
  generadores,
}: LeadFiltersProps) {
  const isDateRangeValid = Boolean(dateRange?.from && dateRange?.to);

  return (
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
                  className="w-full justify-start text-left font-normal "
                >
                  <CalendarIcon className="mr-2 h-4 w-4 " />
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
          <div className="flex-1">
            <Select
              disabled={isDisable}
              value={filters.generadorId === null ? "all" : filters.generadorId}
              onValueChange={(value) =>
                handleFilterChange(
                  "generadorId",
                  value === "all" ? null : value,
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Generadores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los generadores</SelectItem>
                {generadores.map((generador) => (
                  <SelectItem value={generador.id} key={generador.id}>
                    {generador.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select
              disabled={isDisable}
              value={filters.oficina === null ? "all" : filters.oficina}
              onValueChange={(value) =>
                handleFilterChange("oficina", value === "all" ? null : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Oficinas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las oficinas</SelectItem>
                <SelectItem value={Oficina.Oficina1} key={Oficina.Oficina1}>
                  1
                </SelectItem>
                <SelectItem value={Oficina.Oficina2} key={Oficina.Oficina2}>
                  2
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Botón de búsqueda */}
          <Button
            onClick={fetchLeadHistory}
            variant="default"
            disabled={!dateRange?.from || !dateRange.to || isLoading}
          >
            <SearchIcon className="mr-2 h-4 w-4" />
            {isLoading ? "Cargando..." : "Buscar"}
          </Button>
        </div>

        {/* Botón para limpiar filtros */}
        {hasFiltersApplied && (
          <div className="mt-3 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={cleanFilters}
              className="text-xs text-slate-600 dark:text-slate-400"
            >
              <XCircleIcon className="mr-1 h-3 w-3" />
              Limpiar filtros
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
