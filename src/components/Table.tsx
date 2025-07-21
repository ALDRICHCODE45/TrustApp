"use client";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  ColumnDef,
  FilterFn,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  ColumnOrderState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState, useCallback, useMemo, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  FolderSearch,
  Layers,
  Loader2,
  RefreshCw,
  Download,
  SlidersHorizontal,
  X,
  SearchIcon,
} from "lucide-react";
import { toast } from "sonner";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterFns?: any;
  globalFilterPlaceholder?: string;
  defaultPageSize?: number;
  enableFilters?: boolean;
  filterOptions?: {
    [key: string]: {
      label: string;
      options: { value: string; label: string }[];
    };
  };
}

// Función de filtro global personalizada mejorada
const globalFilterFn: FilterFn<any> = (row, columnId, value) => {
  const search = String(value).toLowerCase();

  // Buscar en todas las columnas de la fila
  const searchableValue = Object.values(row.original)
    .map((val) => {
      if (val === null || val === undefined) return "";
      if (typeof val === "object") {
        // Si es un objeto, buscar en sus propiedades
        return Object.values(val).join(" ");
      }
      return String(val);
    })
    .join(" ")
    .toLowerCase();

  return searchableValue.includes(search);
};

// Componente de filtros integrado
interface TableFiltersProps<TData, TValue> {
  table: ReturnType<typeof useReactTable<TData>>;
  globalFilterPlaceholder?: string;
  onGlobalFilterChange?: (value: string) => void;
  filterOptions?: {
    [key: string]: {
      label: string;
      options: { value: string; label: string }[];
    };
  };
  activeFilters: { [key: string]: string };
  setActiveFilters: (filters: { [key: string]: string }) => void;
}

function TableFilters<TData, TValue>({
  table,
  globalFilterPlaceholder = "Buscar...",
  onGlobalFilterChange,
  filterOptions = {},
  activeFilters,
  setActiveFilters,
}: TableFiltersProps<TData, TValue>) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Lógica de exportación básica
      const rows = table.getFilteredRowModel().rows;
      const csvContent = [
        // Headers
        table
          .getAllColumns()
          .map((col) => col.id)
          .join(","),
        // Data
        ...rows.map((row) =>
          row
            .getVisibleCells()
            .map((cell) => String(cell.getValue() || "").replace(/,/g, ";"))
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `datos_${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("Exportación completada");
    } catch (error) {
      toast.error("Error al exportar los datos");
    } finally {
      setIsExporting(false);
    }
  };

  const resetFilters = useCallback(() => {
    setActiveFilters({});
    Object.keys(filterOptions).forEach((key) => {
      table.getColumn(key)?.setFilterValue(undefined);
    });
    onGlobalFilterChange?.("");
  }, [setActiveFilters, table, onGlobalFilterChange, filterOptions]);

  const handleFilterChange = (columnId: string, value: string) => {
    const newFilters = { ...activeFilters };
    if (value === "all") {
      delete newFilters[columnId];
      table.getColumn(columnId)?.setFilterValue(undefined);
    } else {
      newFilters[columnId] = value;
      table.getColumn(columnId)?.setFilterValue(value);
    }
    setActiveFilters(newFilters);
    table.setPageIndex(0);
  };

  const clearFilters = Object.entries(activeFilters).map(([key, value]) => ({
    condition: true,
    label: `${filterOptions[key]?.label || key}: ${value}`,
    clear: () => handleFilterChange(key, "all"),
  }));

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
            <RefreshCw className="h-4 w-4" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
          {/* Búsqueda global */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="global-search" className="text-xs font-medium">
              Búsqueda global
            </Label>
            <div className="relative">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="global-search"
                placeholder={globalFilterPlaceholder}
                value={table.getState().globalFilter ?? ""}
                onChange={(event) => onGlobalFilterChange?.(event.target.value)}
                className="h-9 text-sm pl-8"
              />
            </div>
          </div>

          {/* Filtros dinámicos basados en filterOptions */}
          {Object.entries(filterOptions).map(([columnId, config]) => (
            <div key={columnId} className="space-y-2">
              <Label
                htmlFor={`${columnId}-filter`}
                className="text-xs font-medium"
              >
                {config.label}
              </Label>
              <Select
                value={activeFilters[columnId] || "all"}
                onValueChange={(value) => handleFilterChange(columnId, value)}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue
                    placeholder={`Todos los ${config.label.toLowerCase()}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">
                      Todos los {config.label.toLowerCase()}
                    </SelectItem>
                    {config.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        {/* Indicadores de filtros activos */}
        {clearFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {clearFilters.map((filter, index) => (
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
            ))}
          </div>
        )}
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

  // Usar el pageSize actual de la tabla
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
                  <SelectItem value="100">100</SelectItem>
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
      <Table>
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

export function DataTable<TData, TValue>({
  columns,
  data,
  filterFns = {},
  globalFilterPlaceholder = "Buscar...",
  defaultPageSize = 10,
  enableFilters = true,
  filterOptions = {},
}: DataTableProps<TData, TValue>) {
  // Estados
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string }>(
    {}
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  // Configuración de la tabla
  const table = useReactTable({
    data,
    columns,
    filterFns: {
      ...filterFns,
      global: globalFilterFn,
    },
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
    onPaginationChange: setPagination,
    globalFilterFn: globalFilterFn,
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

  return (
    <div className="w-full space-y-4">
      {/* Componente de filtros */}
      {enableFilters && (
        <TableFilters
          table={table}
          globalFilterPlaceholder={globalFilterPlaceholder}
          onGlobalFilterChange={handleGlobalFilterChange}
          filterOptions={filterOptions}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
        />
      )}

      {/* Indicador de resultados */}
      <div className="flex justify-between items-center">
        <Badge variant="outline" className="text-xs">
          {table.getFilteredRowModel().rows.length} registros
        </Badge>

        {!enableFilters && (
          <div className="flex items-center gap-2">
            <Input
              placeholder={globalFilterPlaceholder}
              value={globalFilter ?? ""}
              onChange={(event) => handleGlobalFilterChange(event.target.value)}
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <Layers className="h-4 w-4 mr-2" />
                  Columnas
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Componente de tabla */}
      <DataGrid table={table} columns={columns} />

      {/* Componente de paginación */}
      <TablePagination
        table={table}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
