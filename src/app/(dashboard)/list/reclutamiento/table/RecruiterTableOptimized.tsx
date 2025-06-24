"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  FilterFn,
  Row,
  ColumnOrderState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import {
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  Filter,
  FolderSearch,
  Layers,
  Loader2,
  RefreshCw,
  Download,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "../../../../../components/DateRangePicker";
import {
  clientesData,
  Oficina,
  Role,
  UsersData,
  Vacante,
} from "../../../../../lib/data";
import { toast } from "sonner";
import CreateVacanteForm from "../components/CreateVacanteForm";

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
  filterPlaceholder?: string;
}

// Componente de filtros integrado
interface TableFiltersProps<TData, TValue> {
  table: ReturnType<typeof useReactTable<TData>>;
  filterPlaceholder?: string;
  onGlobalFilterChange?: (value: string) => void;
  currentStatus: string;
  setCurrentStatus: (newStatus: string) => void;
  currentClient: string;
  setCurrentClient: (newClient: string) => void;
  currentRecruiter: string;
  setCurrentRecruiter: (newRecruiter: string) => void;
  currentTipo: string;
  setCurrentTipo: (newTipo: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: (newRange: DateRange | undefined) => void;
  currentOficina: Oficina | "all";
  setCurrentOficina: (newOficina: Oficina | "all") => void;
}

function TableFilters<TData, TValue>({
  table,
  filterPlaceholder = "Filtrar...",
  onGlobalFilterChange,
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
}: TableFiltersProps<TData, TValue>) {
  const [isExporting, setIsExporting] = useState(false);

  // Memoizar los reclutadores
  const recruites = useMemo(
    () => UsersData.filter((user) => user.rol === Role.reclutador),
    []
  );

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Lógica de exportación
      toast.success("Exportación completada");
    } catch (error) {
      toast.error("Error al exportar los datos");
    } finally {
      setIsExporting(false);
    }
  };

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
    onGlobalFilterChange?.("");
  }, [
    setCurrentStatus,
    setCurrentClient,
    setCurrentRecruiter,
    setCurrentTipo,
    setDateRange,
    setCurrentOficina,
    table,
    onGlobalFilterChange,
  ]);

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
    [setDateRange, table]
  );

  const clearFilters = [
    {
      condition: currentOficina !== "all",
      label: `Oficina: ${currentOficina}`,
      clear: () => {
        setCurrentOficina("all");
        table.getColumn("oficina")?.setFilterValue(undefined);
      },
    },
    {
      condition: currentStatus !== "all",
      label: `Estado: ${currentStatus}`,
      clear: () => {
        setCurrentStatus("all");
        table.getColumn("estado")?.setFilterValue(undefined);
      },
    },
    {
      condition: currentClient !== "all",
      label: `Cliente: ${currentClient}`,
      clear: () => {
        setCurrentClient("all");
        table.getColumn("cliente")?.setFilterValue(undefined);
      },
    },
    {
      condition: currentRecruiter !== "all",
      label: `Reclutador: ${currentRecruiter}`,
      clear: () => {
        setCurrentRecruiter("all");
        table.getColumn("reclutador")?.setFilterValue(undefined);
      },
    },
    {
      condition: currentTipo !== "all",
      label: `Tipo: ${currentTipo}`,
      clear: () => {
        setCurrentTipo("all");
        table.getColumn("tipo")?.setFilterValue(undefined);
      },
    },
    {
      condition: dateRange && (dateRange.from || dateRange.to),
      label: `Fecha: ${dateRange?.from?.toLocaleDateString()} - ${
        dateRange?.to?.toLocaleDateString() || "ahora"
      }`,
      clear: () => {
        setDateRange(undefined);
        table.getColumn("asignacion")?.setFilterValue(undefined);
      },
    },
  ];

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-3">
                <SlidersHorizontal size={16} className="mr-2" />
                Acciones
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                className="flex items-center gap-2"
                onClick={handleExport}
                disabled={isExporting}
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Exportar a CSV
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <ColumnSelector table={table} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-4 pb-3 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Filtro de Estado */}
          <div className="space-y-2">
            <Label htmlFor="status-filter" className="text-xs font-medium">
              Estado
            </Label>
            <Select value={currentStatus} onValueChange={setCurrentStatus}>
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

          {/* Filtro de Oficina */}
          <div className="space-y-2">
            <Label htmlFor="oficina-filter" className="text-xs font-medium">
              Oficina
            </Label>
            <Select value={currentOficina} onValueChange={setCurrentOficina}>
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
            <Select value={currentClient} onValueChange={setCurrentClient}>
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
              onValueChange={setCurrentRecruiter}
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
            <Select value={currentTipo} onValueChange={setCurrentTipo}>
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
          {clearFilters.map((filter, index) =>
            filter.condition ? (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {filter.label}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={filter.clear}
                />
              </Badge>
            ) : null
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para el selector de columnas
interface ColumnSelectorProps<TData> {
  table: ReturnType<typeof useReactTable<TData>>;
}

function ColumnSelector<TData>({ table }: ColumnSelectorProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="default" className="w-full">
          <Layers size={16} className="mr-2" />
          Columnas visibles
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-[400px] overflow-y-scroll"
        onSelect={(e) => e.preventDefault()}
      >
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Componente de paginación
interface PaginationProps<TData> {
  table: ReturnType<typeof useReactTable<TData>>;
  pageSize: number;
  onPageSizeChange: (value: string) => void;
}

function TablePagination<TData>({
  table,
  pageSize,
  onPageSizeChange,
}: PaginationProps<TData>) {
  const { pageIndex, pageSize: currentPageSize } = table.getState().pagination;
  const totalPages = table.getPageCount();
  const totalRows = table.getFilteredRowModel().rows.length;
  const selectedRows = table.getFilteredSelectedRowModel().rows.length;

  // Usar el pageSize actual de la tabla, no el prop
  const actualPageSize = currentPageSize;

  // Calcular la última página de forma segura
  const lastPageIndex = Math.max(0, totalPages - 1);

  // Calcular el rango de registros mostrados
  const startRecord = totalRows === 0 ? 0 : pageIndex * actualPageSize + 1;
  const endRecord = Math.min((pageIndex + 1) * actualPageSize, totalRows);

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Información de paginación */}
          <div className="flex-1 text-sm text-muted-foreground">
            <div className="flex flex-col sm:flex-row gap-2">
              <span className="font-medium">
                Página {pageIndex + 1} de {totalPages || 1}
              </span>
              <span className="text-muted-foreground">
                (Mostrando {startRecord}-{endRecord} de {totalRows} registros)
              </span>
              {selectedRows > 0 && (
                <span className="text-muted-foreground">
                  • {selectedRows} filas seleccionadas
                </span>
              )}
            </div>
          </div>

          {/* Selector de filas por página y navegación */}
          <div className="flex items-center gap-4">
            {/* Selector de filas por página */}
            <div className="flex items-center gap-2">
              <Label htmlFor="page-size" className="text-sm">
                Filas por página:
              </Label>
              <Select
                value={actualPageSize.toString()}
                onValueChange={onPageSizeChange}
              >
                <SelectTrigger id="page-size" className="w-[80px]">
                  <SelectValue placeholder={actualPageSize.toString()} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Navegación de páginas */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                title="Primera página"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                title="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Indicador de página actual */}
              <div className="flex items-center gap-1 px-2">
                <span className="text-sm font-medium">{pageIndex + 1}</span>
                <span className="text-sm text-muted-foreground">/</span>
                <span className="text-sm text-muted-foreground">
                  {totalPages || 1}
                </span>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                title="Página siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.setPageIndex(lastPageIndex)}
                disabled={!table.getCanNextPage() || totalPages <= 1}
                title="Última página"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente de la tabla con drag and drop
interface DataGridProps<TData, TValue> {
  table: ReturnType<typeof useReactTable<TData>>;
  columns: ColumnDef<TData, TValue>[];
}

function DataGrid<TData, TValue>({
  table,
  columns,
}: DataGridProps<TData, TValue>) {
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  useEffect(() => {
    setColumnOrder(table.getAllColumns().map((column) => column.id));
  }, [table]);

  // Columnas que no se pueden mover
  const nonDraggableColumns = useMemo(() => ["select", "actions"], []);

  const handleClearFilters = useCallback(() => {
    table.resetColumnFilters();
  }, [table]);

  return (
    <div className="rounded-md border shadow-sm dark:bg-[#0e0e0e] overflow-hidden">
      <Table className="downloadable-table">
        <TableHeader className="bg-gray-50 dark:bg-slate-900/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                const isDraggable = !nonDraggableColumns.includes(header.id);
                return (
                  <TableHead
                    key={header.id}
                    className={`
                      font-medium text-xs uppercase py-3 transition-all duration-200
                      ${isDraggable ? "cursor-move" : ""}
                      ${
                        draggedColumn === header.id ? "opacity-50 scale-95" : ""
                      }
                      ${
                        dropTarget === header.id
                          ? "bg-primary/20 border-2 border-primary"
                          : ""
                      }
                      hover:bg-muted/70
                    `}
                    draggable={isDraggable}
                    onDragStart={
                      isDraggable
                        ? (e) => {
                            setDraggedColumn(header.id);
                            e.dataTransfer.setData("text/plain", header.id);
                            e.dataTransfer.effectAllowed = "move";
                          }
                        : undefined
                    }
                    onDragEnd={
                      isDraggable
                        ? () => {
                            setDraggedColumn(null);
                            setDropTarget(null);
                          }
                        : undefined
                    }
                    onDragOver={
                      isDraggable
                        ? (e) => {
                            e.preventDefault();
                            if (header.id !== draggedColumn) {
                              setDropTarget(header.id);
                            }
                          }
                        : undefined
                    }
                    onDragLeave={
                      isDraggable
                        ? (e) => {
                            e.preventDefault();
                            if (header.id !== draggedColumn) {
                              setDropTarget(null);
                            }
                          }
                        : undefined
                    }
                    onDrop={
                      isDraggable
                        ? (e) => {
                            e.preventDefault();
                            setDraggedColumn(null);
                            setDropTarget(null);
                            const draggedColumnId =
                              e.dataTransfer.getData("text/plain");
                            const dropColumnId = header.id;
                            if (draggedColumnId === dropColumnId) return;
                            const newColumnOrder = [...columnOrder];
                            const draggedIndex =
                              newColumnOrder.indexOf(draggedColumnId);
                            const dropIndex =
                              newColumnOrder.indexOf(dropColumnId);
                            newColumnOrder.splice(draggedIndex, 1);
                            newColumnOrder.splice(
                              dropIndex,
                              0,
                              draggedColumnId
                            );
                            setColumnOrder(newColumnOrder);
                            table.setColumnOrder(newColumnOrder);
                          }
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-2">
                      {isDraggable && (
                        <span className="text-muted-foreground">⋮⋮</span>
                      )}
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={`
                  hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors group
                  ${hoveredRow === row.id ? "bg-muted/30" : ""}
                  ${row.getIsSelected() ? "bg-primary/10" : ""}
                `}
                onMouseEnter={() => setHoveredRow(row.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={`
                      py-3 group-hover:bg-muted/30 transition-colors
                      ${hoveredRow === row.id ? "bg-muted/40" : ""}
                    `}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <FolderSearch className="h-8 w-8 mb-2 opacity-40" />
                  <h3 className="font-medium">No se encontraron resultados</h3>
                  <p className="text-sm">
                    Intente con diferentes criterios de búsqueda
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    className="mt-2"
                  >
                    Limpiar filtros
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Componente principal optimizado
export function RecruiterTable<TData, TValue>({
  columns,
  data,
  defaultPageSize = 10,
  filterPlaceholder = "Buscar vacantes...",
}: DataTableProps<TData, TValue>) {
  // Estados
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState("all");
  const [currentRecruiter, setCurrentRecruiter] = useState("all");
  const [currentClient, setCurrentClient] = useState("all");
  const [currentTipo, setCurrentTipo] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [currentOficina, setCurrentOficina] = useState<Oficina | "all">("all");
  const [tableData, setTableData] = useState<TData[]>(data);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [currentPage, setCurrentPage] = useState(0);

  // Memoizar los datos de la tabla para evitar re-renderizaciones innecesarias
  const memoizedData = useMemo(() => tableData, [tableData]);

  const [pagination, setPagination] = useState({
    pageIndex: currentPage,
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
    onGlobalFilterChange: setGlobalFilter,
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater(pagination);
        setCurrentPage(newState.pageIndex);
        setPagination(newState);
      } else {
        setCurrentPage(updater.pageIndex);
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
      globalFilter,
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

  const handleGlobalFilterChange = useCallback(
    (value: string) => {
      setGlobalFilter(value);
      table.setPageIndex(0);
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

  return (
    <div className="w-full max-w-[93vw] space-y-4">
      {/* Panel superior con acciones principales */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <CreateVacanteForm />
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
        filterPlaceholder={filterPlaceholder}
        onGlobalFilterChange={handleGlobalFilterChange}
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
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
