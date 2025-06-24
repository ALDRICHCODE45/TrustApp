"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  FilterFn,
  ColumnOrderState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";
import { Oficina } from "../../../../../lib/data";
import { Download, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import CreateVacanteForm from "../components/CreateVacanteForm";
import {
  TableFilters,
  TablePagination,
  DataGrid,
  ColumnSelector,
} from "./components";

// Función de filtro personalizada para rangos de fechas
const dateRangeFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
  if (!filterValue || (!filterValue.from && !filterValue.to)) {
    return true;
  }

  const cellValue = row.getValue(columnId);
  if (!cellValue) return false;

  let date: Date;
  if (typeof cellValue === "string") {
    date = new Date(cellValue);
  } else if (cellValue instanceof Date) {
    date = cellValue;
  } else {
    return false;
  }

  const dateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const fromDate = filterValue.from
    ? new Date(
        filterValue.from.getFullYear(),
        filterValue.from.getMonth(),
        filterValue.from.getDate()
      )
    : null;

  const toDate = filterValue.to
    ? new Date(
        filterValue.to.getFullYear(),
        filterValue.to.getMonth(),
        filterValue.to.getDate()
      )
    : null;

  if (fromDate && toDate) {
    return dateOnly >= fromDate && dateOnly <= toDate;
  } else if (fromDate) {
    return dateOnly >= fromDate;
  } else if (toDate) {
    return dateOnly <= toDate;
  }

  return true;
};

// Tipos
export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultPageSize?: number;
}

// Componente principal optimizado
export function RecruiterTable<TData, TValue>({
  columns,
  data,
  defaultPageSize = 10,
}: DataTableProps<TData, TValue>) {
  // Estados
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [currentStatus, setCurrentStatus] = useState("all");
  const [currentRecruiter, setCurrentRecruiter] = useState("all");
  const [currentClient, setCurrentClient] = useState("all");
  const [currentTipo, setCurrentTipo] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [currentOficina, setCurrentOficina] = useState<Oficina | "all">("all");
  const [tableData, setTableData] = useState<TData[]>(data);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);

  // Memoizar los datos de la tabla para evitar re-renderizaciones innecesarias
  const memoizedData = useMemo(() => tableData, [tableData]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  // Configuración de la tabla
  const table = useReactTable({
    data: memoizedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater(pagination);
        setPageIndex(newState.pageIndex);
        setPagination(newState);
      } else {
        setPageIndex(updater.pageIndex);
        setPagination(updater);
      }
    },
    filterFns: {
      filterDateRange: dateRangeFilterFn,
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      columnOrder,
    },
  });

  // Efecto para actualizar los datos cuando cambia la prop data
  useEffect(() => {
    setTableData(data);
    // Resetear la página a la primera cuando se actualizan los datos
    table.setPageIndex(0);
  }, [data, table]);

  // Efecto para resetear la página cuando cambian los filtros
  useEffect(() => {
    setPageIndex(0);
  }, [columnFilters]);

  // Función para actualizar los datos
  const refreshData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      // Aquí puedes agregar la lógica para refrescar los datos
      // Por ejemplo, hacer una llamada a la API
      toast.success("Datos actualizados correctamente");
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
      toast.error("Error al actualizar los datos");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Memoize handlers to prevent unnecessary re-renders
  const handlePageSizeChange = useCallback(
    (value: string) => {
      const newSize = parseInt(value, 10);
      setPageSize(newSize);
      table.setPageSize(newSize);
    },
    [table]
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      if (value === "all") {
        table.getColumn("estado")?.setFilterValue(undefined);
        setCurrentStatus("all");
        return;
      }
      setCurrentStatus(value);
      table.getColumn("estado")?.setFilterValue(value);
      table.setPageIndex(0);
    },
    [table]
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
      table.setPageIndex(0);
    },
    [table]
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
      table.setPageIndex(0);
    },
    [table]
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
      table.setPageIndex(0);
    },
    [table]
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
      table.setPageIndex(0);
    },
    [table]
  );

  const handleDateRangeChange = useCallback(
    (range: DateRange | undefined) => {
      setDateRange(range);
      if (!range || (!range.from && !range.to)) {
        table.getColumn("asignacion")?.setFilterValue(undefined);
        return;
      }
      table.getColumn("asignacion")?.setFilterValue(range);
      table.setPageIndex(0);
    },
    [table]
  );

  const handleExport = useCallback(async () => {
    try {
      // Lógica de exportación
      toast.success("Exportación completada");
    } catch (error) {
      toast.error("Error al exportar los datos");
    }
  }, []);

  return (
    <div className="w-full max-w-[93vw] space-y-4">
      {/* Panel superior con acciones principales */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Gestión de Vacantes
        </h2>

        <div className="flex items-center gap-2">
          <CreateVacanteForm />
          <ColumnSelector table={table} />
          <Button
            size="sm"
            className="h-9 flex items-center gap-2"
            onClick={handleExport}
          >
            <Download />
            <span>Exportar</span>
          </Button>
          <Button
            variant="outline"
            onClick={refreshData}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isRefreshing ? "Actualizando..." : "Actualizar datos"}
          </Button>
        </div>
      </div>

      {/* Componente de filtros optimizado */}
      <TableFilters
        table={table}
        currentStatus={currentStatus}
        setCurrentStatus={handleStatusChange}
        currentClient={currentClient}
        setCurrentClient={handleClientChange}
        currentRecruiter={currentRecruiter}
        setCurrentRecruiter={handleRecruiterChange}
        currentTipo={currentTipo}
        setCurrentTipo={handleTipoChange}
        dateRange={dateRange}
        setDateRange={handleDateRangeChange}
        currentOficina={currentOficina}
        setCurrentOficina={handleOficinaChange}
      />

      {/* Indicador de resultados */}
      <div className="mb-5">
        <Badge variant="outline" className="text-xs">
          {table.getFilteredRowModel().rows.length} vacantes
        </Badge>
      </div>

      {/* Componente de tabla optimizado */}
      <DataGrid table={table} columns={columns} />

      {/* Componente de paginación optimizado */}
      <TablePagination
        table={table}
        pageSize={pageSize}
        setPageSize={setPageSize}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
      />
    </div>
  );
}
