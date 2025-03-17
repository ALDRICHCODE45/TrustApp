"use client";
import { useState } from "react";
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
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
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
} from "lucide-react";
import { Lead, LeadStatus, Role, User, UsersData } from "../../../../lib/data";
import { Card, CardContent } from "@/components/ui/card";

const filterAnything: FilterFn<Lead> = (
  row: Row<Lead>,
  columnId: string,
  filterValue: any,
  addMeta: (meta: any) => void,
) => {
  if (!filterValue || filterValue === "") return true;

  const searchTerm = filterValue.toLowerCase();
  return (
    row.original.origen.toLowerCase().includes(searchTerm) ||
    row.original.generadorLeads.name.toLowerCase().includes(searchTerm) ||
    row.original.sector.toLowerCase().includes(searchTerm) ||
    row.original.empresa.toLowerCase().includes(searchTerm)
  );
};

// Tipos
export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultPageSize?: number;
  filterPlaceholder?: string;
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
}

function TableFilters<TData, TValue>({
  table,
  filterPlaceholder = "Filtrar...",
  onGlobalFilterChange,
  currentStatus,
  setCurrentStatus,
  currentGl,
  setCurrentGl,
}: TableFiltersProps<TData, TValue>) {
  const generadores = UsersData.filter(
    (user) => user.rol === Role.generadorLeads,
  );

  return (
    <Card className="mb-4 mt-4">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Buscador global */}
          <div className="space-y-2">
            <Label htmlFor="global-filter" className="text-sm font-medium">
              Búsqueda global
            </Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="global-filter"
                placeholder={filterPlaceholder}
                className="pl-8"
                onChange={(e) => onGlobalFilterChange?.(e.target.value)}
              />
            </div>
          </div>

          {/* Filtro por estado */}
          <div className="space-y-2">
            <Label htmlFor="status-filter" className="text-sm font-medium">
              Estado
            </Label>
            <Select
              value={currentStatus}
              onValueChange={(value) => {
                if (value === "all") {
                  table.getColumn("status")?.setFilterValue(undefined);
                  setCurrentStatus("all");
                  return;
                }
                setCurrentStatus(value as LeadStatus);
                table.getColumn("status")?.setFilterValue(value);
                table.setPageIndex(0); // Reset a primera página al filtrar
              }}
            >
              <SelectTrigger id="status-filter" className="w-full">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Seleccionar estado" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Estado</SelectLabel>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="S.S">Social Selling</SelectItem>
                  <SelectItem value="Contacto">Contacto</SelectItem>
                  <SelectItem value="C.C">Entrevistas</SelectItem>
                  <SelectItem value="Prospecto">Prospecto</SelectItem>
                  <SelectItem value="C.A">Cita Agendada</SelectItem>
                  <SelectItem value="C.V">Cita Validada</SelectItem>
                  <SelectItem value="Cliente">Cliente</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por generador */}
          <div className="space-y-2">
            <Label htmlFor="generador-filter" className="text-sm font-medium">
              Generador
            </Label>
            <Select
              value={currentGl}
              onValueChange={(value) => {
                if (value === "all") {
                  table.getColumn("generadorLeads")?.setFilterValue(undefined);
                  setCurrentGl("all");
                  return;
                }
                setCurrentGl(value);
                table.getColumn("generadorLeads")?.setFilterValue(value);
                table.setPageIndex(0); // Reset a primera página al filtrar
              }}
            >
              <SelectTrigger id="generador-filter" className="w-full">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Seleccionar generador" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Generador</SelectLabel>
                  <SelectItem value="all">Todos</SelectItem>
                  {generadores.map((user) => (
                    <SelectItem value={user.name} key={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Selector de columnas */}
          <div className="flex items-end">
            <ColumnSelector table={table} />
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

// Componente de la tabla
interface DataGridProps<TData, TValue> {
  table: ReturnType<typeof useReactTable<TData>>;
  columns: ColumnDef<TData, TValue>[];
}

function DataGrid<TData, TValue>({
  table,
  columns,
}: DataGridProps<TData, TValue>) {
  return (
    <div className="rounded-md border dark:bg-[#0e0e0e] overflow-x-auto">
      <Table className="downloadable-table">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted/50">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="font-semibold">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="hover:bg-muted/50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No se encontraron resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
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
                ({table.getFilteredSelectedRowModel().rows.length} de{" "}
                {table.getFilteredRowModel().rows.length} filas seleccionadas)
              </span>
            </div>
          </div>

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
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>

            {/* Botones de paginación */}
            <div className="flex items-center space-x-2 ml-4">
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

// Componente principal
export function CommercialTable<TData, TValue>({
  columns,
  data,
  defaultPageSize = 10,
  filterPlaceholder = "Busqueda Global...",
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
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  // Configuración de la tabla
  const table = useReactTable({
    data,
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
    onPaginationChange: setPagination,
    filterFns: {
      filterAnything,
    },

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination,
    },
  });

  // Manejadores
  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value, 10);
    setPageSize(newSize);
    table.setPageSize(newSize);
  };

  const handleGlobalFilterChange = (value: string) => {
    setGlobalFilter(value);
    table.setPageIndex(0); // Reset a primera página al filtrar
  };

  return (
    <div className="dark:bg-[#0e0e0e] w-full max-w-[93vw]">
      <TableFilters
        table={table}
        filterPlaceholder={filterPlaceholder}
        onGlobalFilterChange={handleGlobalFilterChange}
        currentStatus={currentStatus}
        setCurrentStatus={setCurrentStatus}
        currentGl={currentGl}
        setCurrentGl={setCurrentGl}
      />
      <DataGrid table={table} columns={columns} />
      <TablePagination
        table={table}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
