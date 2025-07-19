"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  X,
  Search,
  Filter,
  ChevronDown,
  Users,
  Building,
  Tag,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VacancyTipo, User, Client } from "@prisma/client";
import { VacancyWithRelations } from "./ReclutadorColumns";

export interface FilterState {
  searchTerm: string;
  reclutadorId: string | null;
  clienteId: string | null;
  tipo: VacancyTipo | null;
  fechaAsignacion: { from: Date | null; to: Date | null };
  año: number | null;
  mes: number | null;
  rangoMeses: { from: number | null; to: number | null };
}

interface KanbanFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  reclutadores: User[];
  clientes: Client[];
  vacantes: VacancyWithRelations[];
}

export function KanbanFilters({
  onFilterChange,
  reclutadores,
  clientes,
  vacantes,
}: KanbanFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    reclutadorId: null,
    clienteId: null,
    tipo: null,
    fechaAsignacion: { from: null, to: null },
    año: null,
    mes: null,
    rangoMeses: { from: null, to: null },
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Obtener años únicos de las vacantes
  const availableYears = Array.from(
    new Set(vacantes.map((v) => new Date(v.fechaAsignacion).getFullYear()))
  ).sort((a, b) => b - a);

  // Meses del año en español
  const months = [
    { value: 1, label: "Enero" },
    { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" },
    { value: 6, label: "Junio" },
    { value: 7, label: "Julio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" },
    { value: 12, label: "Diciembre" },
  ];

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      searchTerm: "",
      reclutadorId: null,
      clienteId: null,
      tipo: null,
      fechaAsignacion: { from: null, to: null },
      año: null,
      mes: null,
      rangoMeses: { from: null, to: null },
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const clearSingleFilter = (filterKey: keyof FilterState) => {
    if (filterKey === "fechaAsignacion") {
      const newFilters = {
        ...filters,
        fechaAsignacion: { from: null, to: null },
      };
      setFilters(newFilters);
      onFilterChange(newFilters);
    } else if (filterKey === "rangoMeses") {
      const newFilters = {
        ...filters,
        rangoMeses: { from: null, to: null },
      };
      setFilters(newFilters);
      onFilterChange(newFilters);
    } else {
      const newFilters = { ...filters, [filterKey]: null };
      setFilters(newFilters);
      onFilterChange(newFilters);
    }
  };

  const hasActiveFilters =
    filters.searchTerm ||
    filters.reclutadorId ||
    filters.clienteId ||
    filters.tipo ||
    filters.fechaAsignacion.from ||
    filters.fechaAsignacion.to ||
    filters.año ||
    filters.mes ||
    filters.rangoMeses.from ||
    filters.rangoMeses.to;

  const activeFiltersCount = [
    filters.searchTerm,
    filters.reclutadorId,
    filters.clienteId,
    filters.tipo,
    filters.fechaAsignacion.from || filters.fechaAsignacion.to,
    filters.año,
    filters.mes,
    filters.rangoMeses.from || filters.rangoMeses.to,
  ].filter(Boolean).length;

  return (
    <div className="bg-card border rounded-xl p-6 mb-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Filtros</h2>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount} activo{activeFiltersCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 mr-2 transition-transform",
                showAdvancedFilters && "rotate-180"
              )}
            />
            {showAdvancedFilters ? "Ocultar" : "Mostrar"} filtros avanzados
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-2" />
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {/* Filtros básicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Búsqueda por posición */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Buscar posición
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Nombre de la posición..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Reclutador */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Users className="h-4 w-4" />
            Reclutador
          </label>
          <Select
            value={filters.reclutadorId || "todos"}
            onValueChange={(value) =>
              handleFilterChange(
                "reclutadorId",
                value === "todos" ? null : value
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar reclutador" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los reclutadores</SelectItem>
              {reclutadores.map((reclutador) => (
                <SelectItem key={reclutador.id} value={reclutador.id}>
                  {reclutador.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cliente */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Building className="h-4 w-4" />
            Cliente
          </label>
          <Select
            value={filters.clienteId || "todos"}
            onValueChange={(value) =>
              handleFilterChange("clienteId", value === "todos" ? null : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los clientes</SelectItem>
              {clientes.map((cliente) => (
                <SelectItem key={cliente.id} value={cliente.id}>
                  {cliente.cuenta || `Cliente ${cliente.id}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tipo */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Tipo
          </label>
          <Select
            value={filters.tipo || "todos"}
            onValueChange={(value) =>
              handleFilterChange(
                "tipo",
                value === "todos" ? null : (value as VacancyTipo)
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los tipos</SelectItem>
              <SelectItem value={VacancyTipo.Nueva}>Nueva</SelectItem>
              <SelectItem value={VacancyTipo.Recompra}>Recompra</SelectItem>
              <SelectItem value={VacancyTipo.Garantia}>Garantía</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filtros avanzados */}
      {showAdvancedFilters && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-md font-medium text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Filtros de fecha
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Rango de fechas de asignación */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Rango de fechas
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.fechaAsignacion.from &&
                        !filters.fechaAsignacion.to &&
                        "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.fechaAsignacion.from ? (
                      filters.fechaAsignacion.to ? (
                        <>
                          {format(filters.fechaAsignacion.from, "dd/MM/yyyy", {
                            locale: es,
                          })}{" "}
                          -{" "}
                          {format(filters.fechaAsignacion.to, "dd/MM/yyyy", {
                            locale: es,
                          })}
                        </>
                      ) : (
                        format(filters.fechaAsignacion.from, "dd/MM/yyyy", {
                          locale: es,
                        })
                      )
                    ) : (
                      "Seleccionar rango"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    captionLayout="dropdown"
                    selected={{
                      from: filters.fechaAsignacion.from || undefined,
                      to: filters.fechaAsignacion.to || undefined,
                    }}
                    onSelect={(range) => {
                      handleFilterChange("fechaAsignacion", {
                        from: range?.from || null,
                        to: range?.to || null,
                      });
                    }}
                    initialFocus
                    numberOfMonths={2}
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Año */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Año
              </label>
              <Select
                value={filters.año?.toString() || "todos"}
                onValueChange={(value) =>
                  handleFilterChange(
                    "año",
                    value === "todos" ? null : parseInt(value)
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar año" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los años</SelectItem>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Mes
              </label>
              <Select
                value={filters.mes?.toString() || "todos"}
                onValueChange={(value) =>
                  handleFilterChange(
                    "mes",
                    value === "todos" ? null : parseInt(value)
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar mes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los meses</SelectItem>
                  {months.map((month) => (
                    <SelectItem
                      key={month.value}
                      value={month.value.toString()}
                    >
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rango de meses */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Rango de meses
              </label>
              <div className="flex gap-2">
                <Select
                  value={filters.rangoMeses.from?.toString() || "desde"}
                  onValueChange={(value) =>
                    handleFilterChange("rangoMeses", {
                      ...filters.rangoMeses,
                      from: value === "desde" ? null : parseInt(value),
                    })
                  }
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Desde" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desde">Desde</SelectItem>
                    {months.map((month) => (
                      <SelectItem
                        key={month.value}
                        value={month.value.toString()}
                      >
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filters.rangoMeses.to?.toString() || "hasta"}
                  onValueChange={(value) =>
                    handleFilterChange("rangoMeses", {
                      ...filters.rangoMeses,
                      to: value === "hasta" ? null : parseInt(value),
                    })
                  }
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Hasta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hasta">Hasta</SelectItem>
                    {months.map((month) => (
                      <SelectItem
                        key={month.value}
                        value={month.value.toString()}
                      >
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <span className="text-sm text-muted-foreground">
            Filtros activos:
          </span>

          {filters.searchTerm && (
            <Badge variant="outline" className="flex items-center gap-1">
              <span>Búsqueda: {filters.searchTerm}</span>
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => clearSingleFilter("searchTerm")}
              />
            </Badge>
          )}

          {filters.reclutadorId && (
            <Badge variant="outline" className="flex items-center gap-1">
              <span>
                Reclutador:{" "}
                {reclutadores.find((r) => r.id === filters.reclutadorId)?.name}
              </span>
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => clearSingleFilter("reclutadorId")}
              />
            </Badge>
          )}

          {filters.clienteId && (
            <Badge variant="outline" className="flex items-center gap-1">
              <span>
                Cliente:{" "}
                {clientes.find((c) => c.id === filters.clienteId)?.cuenta}
              </span>
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => clearSingleFilter("clienteId")}
              />
            </Badge>
          )}

          {filters.tipo && (
            <Badge variant="outline" className="flex items-center gap-1">
              <span>Tipo: {filters.tipo}</span>
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => clearSingleFilter("tipo")}
              />
            </Badge>
          )}

          {(filters.fechaAsignacion.from || filters.fechaAsignacion.to) && (
            <Badge variant="outline" className="flex items-center gap-1">
              <span>
                Fecha:{" "}
                {filters.fechaAsignacion.from && filters.fechaAsignacion.to
                  ? `${format(filters.fechaAsignacion.from, "dd/MM/yyyy", {
                      locale: es,
                    })} - ${format(filters.fechaAsignacion.to, "dd/MM/yyyy", {
                      locale: es,
                    })}`
                  : filters.fechaAsignacion.from
                  ? `Desde ${format(
                      filters.fechaAsignacion.from,
                      "dd/MM/yyyy",
                      { locale: es }
                    )}`
                  : `Hasta ${format(filters.fechaAsignacion.to!, "dd/MM/yyyy", {
                      locale: es,
                    })}`}
              </span>
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => clearSingleFilter("fechaAsignacion")}
              />
            </Badge>
          )}

          {filters.año && (
            <Badge variant="outline" className="flex items-center gap-1">
              <span>Año: {filters.año}</span>
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => clearSingleFilter("año")}
              />
            </Badge>
          )}

          {filters.mes && (
            <Badge variant="outline" className="flex items-center gap-1">
              <span>
                Mes: {months.find((m) => m.value === filters.mes)?.label}
              </span>
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => clearSingleFilter("mes")}
              />
            </Badge>
          )}

          {(filters.rangoMeses.from || filters.rangoMeses.to) && (
            <Badge variant="outline" className="flex items-center gap-1">
              <span>
                Meses:{" "}
                {filters.rangoMeses.from && filters.rangoMeses.to
                  ? `${
                      months.find((m) => m.value === filters.rangoMeses.from)
                        ?.label
                    } - ${
                      months.find((m) => m.value === filters.rangoMeses.to)
                        ?.label
                    }`
                  : filters.rangoMeses.from
                  ? `Desde ${
                      months.find((m) => m.value === filters.rangoMeses.from)
                        ?.label
                    }`
                  : `Hasta ${
                      months.find((m) => m.value === filters.rangoMeses.to)
                        ?.label
                    }`}
              </span>
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => clearSingleFilter("rangoMeses")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
