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
  Layers,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Loader2,
  CalendarIcon,
  X,
  RefreshCw,
  Download,
  SlidersHorizontal,
} from "lucide-react";
import { LeadOrigen, LeadStatus, User } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { deleteMayLeads } from "@/actions/leads/deleteLeads";
import { es } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { LeadWithRelations } from "../kanban/page";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

const filterAnything: FilterFn<LeadWithRelations> = (
  row: Row<LeadWithRelations>,
  columnId: string,
  filterValue: any,
  addMeta: (meta: any) => void
) => {
  if (!filterValue || filterValue === "") return true;

  const searchTerm = filterValue.toLowerCase();
  return (
    row.original.origen.nombre.toLowerCase().includes(searchTerm) ||
    row.original.sector.nombre.toLowerCase().includes(searchTerm) ||
    row.original.empresa.toLowerCase().includes(searchTerm)
  );
};

const filterDateRange: FilterFn<LeadWithRelations> = (
  row: Row<LeadWithRelations>,
  columnId: string,
  filterValue: { from: Date | undefined; to: Date | undefined }
) => {
  if (!filterValue?.from && !filterValue?.to) return true;

  // La fecha del lead viene en UTC desde la base de datos
  const fechaUTC = new Date(row.original.createdAt);
  // Convertir a fecha local para comparación
  const fechaLocal = new Date(
    fechaUTC.toLocaleString("en-US", { timeZone: "America/Mexico_City" })
  );

  // Convertir las fechas del filtro a la zona horaria local
  const from = filterValue.from
    ? new Date(
        filterValue.from.toLocaleString("en-US", {
          timeZone: "America/Mexico_City",
        })
      )
    : undefined;
  const to = filterValue.to
    ? new Date(
        filterValue.to.toLocaleString("en-US", {
          timeZone: "America/Mexico_City",
        })
      )
    : undefined;

  // Ajustar las fechas para incluir todo el día
  if (from) {
    from.setHours(0, 0, 0, 0);
  }
  if (to) {
    to.setHours(23, 59, 59, 999);
  }

  if (from && to) {
    return fechaLocal >= from && fechaLocal <= to;
  } else if (from) {
    return fechaLocal >= from;
  } else if (to) {
    return fechaLocal <= to;
  }

  return true;
};

// Tipos para paginación híbrida
interface HybridPaginationData {
  currentPage: number;
  totalPages: number;
  totalLocalRecords: number;
  totalServerRecords: number;
  hasMoreInServer: boolean;
  pageSize: number;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

// Tipos
export interface DataTableProps<LeadWithRelations, TValue> {
  columns: ColumnDef<LeadWithRelations, TValue>[];
  data: LeadWithRelations[];
  defaultPageSize?: number;
  filterPlaceholder?: string;
  generadores: User[];
  origenes?: LeadOrigen[];
  // Props para paginación híbrida
  hybridPagination?: HybridPaginationData;
  onHybridParamsChange?: (params: any) => void;
  currentHybridParams?: any;
  isHybridLoading?: boolean;
  isFiltering?: boolean;
  onHybridRefresh?: () => void;
  // Nueva prop para actualizar leads en el estado
  updateLeadInState?: (
    leadId: string,
    updates: Partial<LeadWithRelations>
  ) => void;
}

// Componente de filtro y selector de columnas
interface TableFiltersProps<TData, TValue> {
  table: ReturnType<typeof useReactTable<TData>>;
  filterPlaceholder?: string;
  onGlobalFilterChange?: (value: string) => void;
  currentStatus: LeadStatus | "all";
  setCurrentStatus: (newStatus: LeadStatus | "all") => void;
  currentGl: string;
  setCurrentGl: (newGl: string) => void;
  generadores: User[];
  currentDateRange: { from: Date | undefined; to: Date | undefined };
  setCurrentDateRange: (newDateRange: {
    from: Date | undefined;
    to: Date | undefined;
  }) => void;
  currentOrigen: string;
  setCurrentOrigen: (newOrigen: string) => void;
  origenes: LeadOrigen[];
}

function TableFilters<TData extends { id: string }, TValue>({
  table,
  filterPlaceholder = "Filtrar...",
  onGlobalFilterChange,
  currentStatus,
  setCurrentStatus,
  currentGl,
  setCurrentGl,
  generadores,
  currentDateRange,
  setCurrentDateRange,
  currentOrigen,
  setCurrentOrigen,
  origenes,
}: TableFiltersProps<TData, TValue>) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleDelete = async () => {
    setDeleteLoading(true);
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const ids = selectedRows.map((row) => row.original.id);

    try {
      await deleteMayLeads(ids);
      toast.success("Leads Eliminados correctamente");
    } catch (error) {
      toast.error("Error al eliminar leads");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Definir las columnas a exportar
      const exportColumns = [
        "empresa",
        "origen",
        "sector",
        "generadorLeads",
        "link",
        "createdAt",
        "status",
        "oficina",
      ];
      const rows = table.getFilteredRowModel().rows;
      // Encabezados legibles
      const headers = exportColumns;
      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          headers
            .map((header) => {
              let value = (row.original as any)[header];
              // Manejar objetos anidados
              if (header === "origen" && value && typeof value === "object")
                value = value.nombre;
              if (header === "sector" && value && typeof value === "object")
                value = value.nombre;
              if (
                header === "generadorLeads" &&
                value &&
                typeof value === "object"
              )
                value = value.name;
              if (header === "createdAt" && value)
                value = new Date(value).toLocaleString();
              if (
                header === "oficina" &&
                (row.original as any).generadorLeads &&
                (row.original as any).generadorLeads.Oficina
              )
                value = (row.original as any).generadorLeads.Oficina;
              if (typeof value === "string") return `"${value}"`;
              return value ?? "";
            })
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `leads_${new Date().toISOString()}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Exportación completada");
    } catch (error) {
      toast.error("Error al exportar los datos");
    } finally {
      setIsExporting(false);
    }
  };

  const hasSelectedRows = table.getFilteredSelectedRowModel().rows.length > 0;

  const handleClearDateFilter = useCallback(() => {
    setCurrentDateRange({ from: undefined, to: undefined });
    table.getColumn("createdAt")?.setFilterValue(undefined);
    table.setPageIndex(0);
  }, [setCurrentDateRange, table]);

  const statusOptions = Object.values(LeadStatus);

  return (
    <Card className="mb-6 mt-6 shadow-sm">
      <CardContent className="p-5">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
          {/* Buscador global */}
          <div className="space-y-2">
            <Label htmlFor="global-filter" className="text-sm font-medium">
              Búsqueda global
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4" />
              <Input
                id="global-filter"
                placeholder={filterPlaceholder}
                className="pl-9"
                onChange={(e) => onGlobalFilterChange?.(e.target.value)}
              />
            </div>
          </div>

          {/* Filtro por estado */}
          <div className="space-y-2">
            <Label htmlFor="status-filter" className="text-sm font-medium">
              Estado
            </Label>
            <Select value={currentStatus} onValueChange={setCurrentStatus}>
              <SelectTrigger id="status-filter" className="w-full">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Seleccionar estado" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Estado</SelectLabel>
                  <SelectItem value="all">Todos</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace(/([A-Z])/g, " $1").trim()}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por origen */}
          <div className="space-y-2">
            <Label htmlFor="origen-filter" className="text-sm font-medium">
              Origen
            </Label>
            <Select value={currentOrigen} onValueChange={setCurrentOrigen}>
              <SelectTrigger id="origen-filter" className="w-full">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Seleccionar origen" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Origen</SelectLabel>
                  <SelectItem value="all">Todos</SelectItem>
                  {origenes.map((origen) => (
                    <SelectItem value={origen.id} key={origen.id}>
                      {origen.nombre}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Date filter */}
          <div className="space-y-2">
            <Label htmlFor="date-filter" className="text-sm font-medium">
              Rango de Fechas
            </Label>
            <div className="flex flex-col gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date-filter"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {currentDateRange.from ? (
                      currentDateRange.to ? (
                        <>
                          {format(currentDateRange.from, "EEE d/M/yy", {
                            locale: es,
                          })}{" "}
                          -{" "}
                          {format(currentDateRange.to, "EEE d/M/yy", {
                            locale: es,
                          })}
                        </>
                      ) : (
                        format(currentDateRange.from, "EEE d/M/yy", {
                          locale: es,
                        })
                      )
                    ) : (
                      <span>Seleccionar rango</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    captionLayout="dropdown"
                    mode="range"
                    selected={{
                      from: currentDateRange.from,
                      to: currentDateRange.to,
                    }}
                    onSelect={(range) => {
                      if (range?.from) {
                        setCurrentDateRange({
                          from: range.from,
                          to: range.to,
                        });
                        table.getColumn("createdAt")?.setFilterValue({
                          from: range.from,
                          to: range.to,
                        });
                        table.setPageIndex(0);
                      }
                    }}
                    initialFocus
                    locale={es}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>

              {(currentDateRange.from || currentDateRange.to) && (
                <Badge variant="outline" className="w-fit gap-1">
                  {currentDateRange.from &&
                    format(currentDateRange.from, "EEE d/M/yy", { locale: es })}
                  {currentDateRange.to &&
                    ` - ${format(currentDateRange.to, "EEE d/M/yy", {
                      locale: es,
                    })}`}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0"
                    onClick={handleClearDateFilter}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          </div>

          {/* Filtro por generador */}
          <div className="space-y-2">
            <Label htmlFor="generador-filter" className="text-sm font-medium">
              Generador
            </Label>
            <Select value={currentGl} onValueChange={setCurrentGl}>
              <SelectTrigger id="generador-filter" className="w-full">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Seleccionar generador" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Generador</SelectLabel>
                  <SelectItem value="all">Todos</SelectItem>
                  {generadores.map((user) => (
                    <SelectItem value={user.id} key={user.id}>
                      {user.name} ({user.role})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Acciones en grupo */}
          <div className="flex flex-col justify-end space-y-2">
            {hasSelectedRows ? (
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="flex items-center justify-center gap-2 h-10 w-full"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <Loader2 className="animate-spin size-4" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                Eliminar {table.getFilteredSelectedRowModel().rows.length}{" "}
                {table.getFilteredSelectedRowModel().rows.length === 1
                  ? "lead"
                  : "leads"}
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="default" className="w-full">
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
            )}
          </div>
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
                ({selectedRows} de {totalRows} filas seleccionadas)
              </span>
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
                value={pageSize.toString()}
                onValueChange={onPageSizeChange}
              >
                <SelectTrigger id="page-size" className="w-[80px]">
                  <SelectValue placeholder={pageSize.toString()} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
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
                <ChevronLeft className="h-4 w-4" />
                <ChevronLeft className="h-4 w-4 -ml-2" />
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
                  {totalPages}
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
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                title="Última página"
              >
                <ChevronRight className="h-4 w-4" />
                <ChevronRight className="h-4 w-4 -ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente de paginación híbrida
interface HybridPaginationProps {
  hybridData: HybridPaginationData;
}

function HybridPagination({ hybridData }: HybridPaginationProps) {
  const {
    currentPage,
    totalPages,
    totalLocalRecords,
    totalServerRecords,
    hasMoreInServer,
    goToPage,
    setPageSize,
    pageSize, // Agregamos pageSize para usar el valor actual
  } = hybridData;

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Información de paginación */}
          <div className="flex-1 text-sm text-muted-foreground">
            <div className="flex flex-col sm:flex-row gap-2">
              <span className="font-medium">
                Página {currentPage} de {totalPages}
              </span>
              <span className="text-muted-foreground">
                ({totalLocalRecords} cargados de {totalServerRecords} totales)
              </span>
              {hasMoreInServer && (
                <Badge variant="outline" className="text-xs">
                  🔄 Pre-cargando más...
                </Badge>
              )}
            </div>
          </div>

          {/* Selector de filas por página y navegación */}
          <div className="flex items-center gap-4">
            {/* Selector de filas por página */}
            <div className="flex items-center gap-2">
              <Label htmlFor="hybrid-page-size" className="text-sm">
                Filas por página:
              </Label>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => setPageSize(parseInt(value, 10))}
              >
                <SelectTrigger id="hybrid-page-size" className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Navegación de páginas */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                title="Primera página"
              >
                <ChevronLeft className="h-4 w-4" />
                <ChevronLeft className="h-4 w-4 -ml-2" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                title="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Indicador de página actual */}
              <div className="flex items-center gap-1 px-2">
                <span className="text-sm font-medium">{currentPage}</span>
                <span className="text-sm text-muted-foreground">/</span>
                <span className="text-sm text-muted-foreground">
                  {totalPages}
                </span>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                title="Página siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                title="Última página"
              >
                <ChevronRight className="h-4 w-4" />
                <ChevronRight className="h-4 w-4 -ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente de la tabla
interface DataGridProps<TData, TValue> {
  table: ReturnType<typeof useReactTable<TData>>;
  columns: ColumnDef<TData, TValue>[];
  isFiltering?: boolean;
}

function DataGrid<TData, TValue>({
  table,
  columns,
  isFiltering,
}: DataGridProps<TData, TValue>) {
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  useEffect(() => {
    setColumnOrder(table.getAllColumns().map((column) => column.id));
  }, [table]);

  // Columnas que no se pueden mover
  const nonDraggableColumns = ["select", "actions"];

  return (
    <div className="rounded-md border dark:bg-[#0e0e0e] overflow-x-auto">
      <Table className="downloadable-table">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted/50">
              {headerGroup.headers.map((header) => {
                const isDraggable = !nonDraggableColumns.includes(header.id);
                return (
                  <TableHead
                    key={header.id}
                    className={`
                      font-semibold transition-all duration-200
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
                  hover:bg-muted/50 transition-colors group
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
                      group-hover:bg-muted/30 transition-colors
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
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  {isFiltering ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-muted-foreground">
                        Aplicando filtros...
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-muted-foreground">
                        No se encontraron resultados.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          table.resetColumnFilters();
                          table.resetGlobalFilter();
                        }}
                      >
                        Limpiar filtros
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Componente principal
export function CommercialTable<TData extends LeadWithRelations, TValue>({
  columns,
  data,
  defaultPageSize = 10,
  filterPlaceholder = "Busqueda Global...",
  generadores,
  origenes,
  hybridPagination,
  onHybridParamsChange,
  currentHybridParams,
  isHybridLoading,
  isFiltering,
  onHybridRefresh,
  updateLeadInState,
}: DataTableProps<TData, TValue>) {
  // Estados
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState<LeadStatus | "all">("all");
  const [currentGl, setCurrentGl] = useState("all");
  const [currentOrigen, setCurrentOrigen] = useState("all");
  const [currentDateRange, setCurrentDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [tableData, setTableData] = useState<LeadWithRelations[]>(data);
  const [currentPage, setCurrentPage] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);

  // Memoizar los datos de la tabla para evitar re-renderizaciones innecesarias
  const memoizedData = useMemo(() => tableData, [tableData]);

  const [pagination, setPagination] = useState({
    pageIndex: currentPage,
    pageSize: defaultPageSize,
  });

  const router = useRouter();

  // Configuración de la tabla
  const table = useReactTable({
    data: memoizedData,
    columns: columns as ColumnDef<LeadWithRelations>[],
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
      filterDateRange,
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
    if (onHybridRefresh) {
      // Usar paginación híbrida
      onHybridRefresh();
    } else {
      // Fallback al método original
      try {
        setIsRefreshing(true);
        const response = await fetch("/api/leads");
        const newData = await response.json();
        setTableData(newData);
      } catch (error) {
        console.error("Error al actualizar los datos:", error);
        toast.error("Error al actualizar los datos");
      } finally {
        setIsRefreshing(false);
      }
    }
  }, [onHybridRefresh]);

  // Memoize handlers to prevent unnecessary re-renders
  const handlePageSizeChange = useCallback(
    (value: string) => {
      const newSize = parseInt(value, 10);
      if (hybridPagination) {
        // Usar la función del hook de paginación híbrida
        hybridPagination.setPageSize(newSize);
      } else {
        // Fallback al método original
        setPageSize(newSize);
        table.setPageSize(newSize);
      }
    },
    [table, hybridPagination]
  );

  const handleGlobalFilterChange = useCallback(
    (value: string) => {
      if (onHybridParamsChange) {
        // Usar paginación híbrida
        const debounceTimer = setTimeout(() => {
          onHybridParamsChange({ search: value });
        }, 300);
        return () => clearTimeout(debounceTimer);
      } else {
        // Fallback al método original
        setGlobalFilter(value);
        table.setPageIndex(0);
      }
    },
    [table, onHybridParamsChange]
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      setCurrentStatus(value as LeadStatus | "all");
      if (onHybridParamsChange) {
        // Usar paginación híbrida
        onHybridParamsChange({
          status: value === "all" ? undefined : (value as LeadStatus),
        });
      } else {
        // Fallback al método original
        if (value === "all") {
          table.getColumn("status")?.setFilterValue(undefined);
          return;
        }
        table.getColumn("status")?.setFilterValue(value);
        table.setPageIndex(0);
      }
    },
    [table, onHybridParamsChange]
  );

  const handleGlChange = useCallback(
    (value: string) => {
      setCurrentGl(value);
      if (onHybridParamsChange) {
        // Usar paginación híbrida
        onHybridParamsChange({
          generadorId: value === "all" ? undefined : value,
        });
      } else {
        // Fallback al método original
        if (value === "all") {
          table.getColumn("generadorLeads")?.setFilterValue(undefined);
          return;
        }
        table.getColumn("generadorLeads")?.setFilterValue(value);
        table.setPageIndex(0);
      }
    },
    [table, onHybridParamsChange]
  );

  const handleOrigenChange = useCallback(
    (value: string) => {
      setCurrentOrigen(value);
      if (onHybridParamsChange) {
        // Usar paginación híbrida
        onHybridParamsChange({
          origenId: value === "all" ? undefined : value,
        });
      } else {
        // Fallback al método original
        if (value === "all") {
          table.getColumn("Origen")?.setFilterValue(undefined);
          return;
        }
        table.getColumn("Origen")?.setFilterValue(value);
        table.setPageIndex(0);
      }
    },
    [table, onHybridParamsChange]
  );

  const handleDateRangeChange = useCallback(
    (range: { from: Date | undefined; to: Date | undefined }) => {
      setCurrentDateRange(range);
      if (onHybridParamsChange) {
        // Usar paginación híbrida
        onHybridParamsChange({
          dateFrom: range.from?.toISOString(),
          dateTo: range.to?.toISOString(),
        });
      } else {
        // Fallback al método original
        if (!range.from && !range.to) {
          table.getColumn("createdAt")?.setFilterValue(undefined);
          return;
        }
        table.getColumn("createdAt")?.setFilterValue(range);
        table.setPageIndex(0);
      }
    },
    [table, onHybridParamsChange]
  );

  return (
    <div className="dark:bg-[#0e0e0e] w-full max-w-[93vw]">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"></div>
          <Button
            variant="outline"
            onClick={refreshData}
            disabled={isHybridLoading || isRefreshing}
            className="flex items-center gap-2"
          >
            {isHybridLoading || isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isHybridLoading || isRefreshing
              ? "Actualizando..."
              : "Actualizar datos"}
          </Button>
        </div>
      </div>
      <TableFilters
        setCurrentDateRange={handleDateRangeChange}
        currentDateRange={currentDateRange}
        generadores={generadores}
        origenes={origenes ?? []}
        table={table}
        filterPlaceholder={filterPlaceholder}
        onGlobalFilterChange={handleGlobalFilterChange}
        currentStatus={currentStatus}
        setCurrentStatus={handleStatusChange}
        currentGl={currentGl}
        setCurrentGl={handleGlChange}
        currentOrigen={currentOrigen}
        setCurrentOrigen={handleOrigenChange}
      />

      <div className="mb-5 flex items-center gap-2">
        <Badge variant="outline" className="text-xs">
          {hybridPagination
            ? `${hybridPagination.totalLocalRecords} cargados de ${hybridPagination.totalServerRecords} totales`
            : `${table.getFilteredRowModel().rows.length} leads`}
        </Badge>
        {isFiltering && (
          <Badge
            variant="secondary"
            className="text-xs flex items-center gap-1"
          >
            <Loader2 className="h-3 w-3 animate-spin" />
            Aplicando filtros...
          </Badge>
        )}
      </div>
      <DataGrid
        table={table}
        columns={columns as ColumnDef<LeadWithRelations>[]}
        isFiltering={isFiltering}
      />
      {hybridPagination ? (
        <HybridPagination hybridData={hybridPagination} />
      ) : (
        <TablePagination
          table={table}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
}
