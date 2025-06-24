"use client";
import { useMemo, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "../../../../../../components/DateRangePicker";
import {
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Filter,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import {
  clientesData,
  Oficina,
  Role,
  User,
  UsersData,
} from "../../../../../../lib/data";

interface TableFiltersProps {
  table: any;
  currentStatus: string;
  setCurrentStatus: (status: string) => void;
  currentClient: string;
  setCurrentClient: (client: string) => void;
  currentRecruiter: string;
  setCurrentRecruiter: (recruiter: string) => void;
  currentTipo: string;
  setCurrentTipo: (value: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  currentOficina: Oficina | "all";
  setCurrentOficina: (newOficina: Oficina | "all") => void;
}

export const TableFilters = ({
  table,
  currentStatus,
  setCurrentStatus,
  currentClient,
  setCurrentClient,
  currentRecruiter,
  setCurrentRecruiter,
  currentTipo,
  setCurrentTipo,
  dateRange,
  setDateRange,
  currentOficina,
  setCurrentOficina,
}: TableFiltersProps) => {
  // Memoizar los reclutadores para evitar recálculos innecesarios
  const recruites = useMemo(
    () => UsersData.filter((user) => user.rol === Role.reclutador),
    []
  );

  const handleDateRangeChange = useCallback(
    (range: DateRange | undefined) => {
      setDateRange(range);

      if (!range || (!range.from && !range.to)) {
        table.getColumn("asignacion")?.setFilterValue(undefined);
        return;
      }

      table.getColumn("asignacion")?.setFilterValue(range);
    },
    [setDateRange, table]
  );

  const resetFilters = useCallback(() => {
    setCurrentStatus("all");
    setCurrentClient("all");
    setCurrentRecruiter("all");
    setCurrentTipo("all");
    setDateRange(undefined);
    setCurrentOficina("all");
    table.getColumn("estado")?.setFilterValue(undefined);
    table.getColumn("cliente")?.setFilterValue(undefined);
    table.getColumn("reclutador")?.setFilterValue(undefined);
    table.getColumn("tipo")?.setFilterValue(undefined);
    table.getColumn("asignacion")?.setFilterValue(undefined);
    table.getColumn("oficina")?.setFilterValue(undefined);
  }, [
    setCurrentStatus,
    setCurrentClient,
    setCurrentRecruiter,
    setCurrentTipo,
    setDateRange,
    setCurrentOficina,
    table,
  ]);

  const handleStatusChange = useCallback(
    (value: string) => {
      if (value === "all") {
        table.getColumn("estado")?.setFilterValue(undefined);
        setCurrentStatus("all");
        return;
      }
      setCurrentStatus(value);
      table.getColumn("estado")?.setFilterValue(value);
    },
    [table, setCurrentStatus]
  );

  const handleClientChange = useCallback(
    (value: string) => {
      if (value === "all") {
        table.getColumn("cliente")?.setFilterValue(undefined);
        setCurrentClient("all");
        return;
      }
      setCurrentClient(value);
      table.getColumn("cliente")?.setFilterValue(value);
    },
    [table, setCurrentClient]
  );

  const handleRecruiterChange = useCallback(
    (value: string) => {
      if (value === "all") {
        table.getColumn("reclutador")?.setFilterValue(undefined);
        setCurrentRecruiter("all");
        return;
      }
      setCurrentRecruiter(value);
      table.getColumn("reclutador")?.setFilterValue(value);
    },
    [table, setCurrentRecruiter]
  );

  const handleTipoChange = useCallback(
    (value: string) => {
      if (value === "all") {
        table.getColumn("tipo")?.setFilterValue(undefined);
        setCurrentTipo("all");
        return;
      }
      setCurrentTipo(value);
      table.getColumn("tipo")?.setFilterValue(value);
    },
    [table, setCurrentTipo]
  );

  const handleOficinaChange = useCallback(
    (value: string) => {
      if (value === "all") {
        table.getColumn("oficina")?.setFilterValue(undefined);
        setCurrentOficina("all");
        return;
      }
      setCurrentOficina(value as Oficina);
      table.getColumn("oficina")?.setFilterValue(value);
    },
    [table, setCurrentOficina]
  );

  const clearOficinaFilter = useCallback(() => {
    setCurrentOficina("all");
    table.getColumn("oficina")?.setFilterValue(undefined);
  }, [setCurrentOficina, table]);

  const clearStatusFilter = useCallback(() => {
    setCurrentStatus("all");
    table.getColumn("estado")?.setFilterValue(undefined);
  }, [setCurrentStatus, table]);

  const clearClientFilter = useCallback(() => {
    setCurrentClient("all");
    table.getColumn("cliente")?.setFilterValue(undefined);
  }, [setCurrentClient, table]);

  const clearRecruiterFilter = useCallback(() => {
    setCurrentRecruiter("all");
    table.getColumn("reclutador")?.setFilterValue(undefined);
  }, [setCurrentRecruiter, table]);

  const clearTipoFilter = useCallback(() => {
    setCurrentTipo("all");
    table.getColumn("tipo")?.setFilterValue(undefined);
  }, [setCurrentTipo, table]);

  const clearDateFilter = useCallback(() => {
    setDateRange(undefined);
    table.getColumn("asignacion")?.setFilterValue(undefined);
  }, [setDateRange, table]);

  return (
    <Card className="mb-6 border-0 shadow-md overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Filtros</h3>
          <Badge variant="outline" className="ml-2">
            {table.getFilteredRowModel().rows.length} resultados
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="h-8 px-3 flex items-center gap-1"
          >
            <RefreshCw />
            <span>Limpiar</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4 pb-3 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Filtro de Estado */}
          <div className="space-y-2">
            <Label htmlFor="status-filter" className="text-xs font-medium">
              Estado
            </Label>
            <Select value={currentStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Hunting">Hunting</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                  <SelectItem value="Entrevistas">Entrevistas</SelectItem>
                  <SelectItem value="Perdida">Perdida</SelectItem>
                  <SelectItem value="Placement">Placement</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* FILTRO DE OFICINA */}
          <div className="space-y-2">
            <Label htmlFor="oficina-filter" className="text-xs font-medium">
              Oficina
            </Label>
            <Select value={currentOficina} onValueChange={handleOficinaChange}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Todas las oficinas" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Todas las oficinas</SelectItem>
                  <SelectItem value={Oficina.uno}>Oficina 1</SelectItem>
                  <SelectItem value={Oficina.dos}>Oficina 2</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro de Cliente */}
          <div className="space-y-2">
            <Label htmlFor="client-filter" className="text-xs font-medium">
              Cliente
            </Label>
            <Select value={currentClient} onValueChange={handleClientChange}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Todos los clientes" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Todos los clientes</SelectItem>
                  {clientesData.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.cuenta}>
                      {cliente.cuenta}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro de Reclutador */}
          <div className="space-y-2">
            <Label htmlFor="recruiter-filter" className="text-xs font-medium">
              Reclutador
            </Label>
            <Select
              value={currentRecruiter}
              onValueChange={handleRecruiterChange}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Todos los reclutadores" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Todos los reclutadores</SelectItem>
                  {recruites.map((user) => (
                    <SelectItem key={user.id} value={user.name}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro de Tipo */}
          <div className="space-y-2">
            <Label htmlFor="tipo-filter" className="text-xs font-medium">
              Tipo
            </Label>
            <Select value={currentTipo} onValueChange={handleTipoChange}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {["Nueva", "Garantia"].map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro de Rango de Fechas */}
          <div className="space-y-2">
            <Label htmlFor="date-range-filter" className="text-xs font-medium">
              Fecha de Asignación
            </Label>
            <DateRangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              placeholder="Seleccionar fechas"
              className="h-9 text-sm"
            />
          </div>
        </div>

        {/* Indicadores de filtros activos */}
        <div className="flex flex-wrap gap-2 mt-4">
          {currentOficina !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Oficina: {currentOficina}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={clearOficinaFilter}
              />
            </Badge>
          )}

          {currentStatus !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Estado: {currentStatus}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={clearStatusFilter}
              />
            </Badge>
          )}
          {currentClient !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Cliente: {currentClient}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={clearClientFilter}
              />
            </Badge>
          )}
          {currentRecruiter !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Reclutador: {currentRecruiter}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={clearRecruiterFilter}
              />
            </Badge>
          )}
          {currentTipo !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Tipo: {currentTipo}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={clearTipoFilter}
              />
            </Badge>
          )}
          {dateRange && (dateRange.from || dateRange.to) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Fecha: {dateRange.from?.toLocaleDateString()} -{" "}
              {dateRange.to?.toLocaleDateString() || "ahora"}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={clearDateFilter}
              />
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
