"use client";
import { useEffect, useState } from "react";
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
  Trash2,
  Loader2,
  LoaderCircle,
  CalendarIcon,
  X,
} from "lucide-react";
import { LeadStatus, User } from "@prisma/client";
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
import { format, isSameDay } from "date-fns";
import { LeadWithRelations } from "../kanban/page";
import { Badge } from "@/components/ui/badge";

const filterAnything: FilterFn<LeadWithRelations> = (
  row: Row<LeadWithRelations>,
  columnId: string,
  filterValue: any,
  addMeta: (meta: any) => void,
) => {
  if (!filterValue || filterValue === "") return true;

  const searchTerm = filterValue.toLowerCase();
  return (
    row.original.origen.nombre.toLowerCase().includes(searchTerm) ||
    //row.original.generadorId.toLowerCase().includes(searchTerm) ||
    row.original.sector.nombre.toLowerCase().includes(searchTerm) ||
    row.original.empresa.toLowerCase().includes(searchTerm)
  );
};

// Tipos
export interface DataTableProps<LeadWithRelations, TValue> {
  columns: ColumnDef<LeadWithRelations, TValue>[];
  data: LeadWithRelations[];
  defaultPageSize?: number;
  filterPlaceholder?: string;
  generadores: User[];
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
  currentDateCreation: Date | undefined;
  setCurrentDateCreation: (newDate: Date | undefined) => void;
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
  currentDateCreation,
  setCurrentDateCreation,
}: TableFiltersProps<TData, TValue>) {
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!currentDateCreation) {
      table.getColumn("createdAt")?.setFilterValue(undefined);
      return;
    }

    table.getColumn("createdAt")?.setFilterValue(currentDateCreation);
    table.setPageIndex(0);
  }, [currentDateCreation, table]);

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

  const hasSelectedRows = table.getFilteredSelectedRowModel().rows.length > 0;

  const handleClearDateFilter = () => {
    setCurrentDateCreation(undefined);
    table.getColumn("createdAt")?.setFilterValue(undefined);
    table.setPageIndex(0);
  };

  const statusOptions = Object.values(LeadStatus);

  return (
    <Card className="mb-6 mt-6 shadow-sm">
      <CardContent className="p-5">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Buscador global */}
          <div className="space-y-2">
            <Label htmlFor="global-filter" className="text-sm font-medium ">
              Búsqueda global
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 " />
              <Input
                id="global-filter"
                placeholder={filterPlaceholder}
                className="pl-9 "
                onChange={(e) => onGlobalFilterChange?.(e.target.value)}
              />
            </div>
          </div>

          {/* Filtro por estado */}
          <div className="space-y-2">
            <Label htmlFor="status-filter" className="text-sm font-medium ">
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
                table.setPageIndex(0);
              }}
            >
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

          {/* Date filter */}
          <div className="space-y-2">
            <Label htmlFor="date-filter" className="text-sm font-medium">
              Fecha de Creación
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
                    {currentDateCreation ? (
                      format(currentDateCreation, "eee dd/MM/yyyy", {
                        locale: es,
                      })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={currentDateCreation}
                    onSelect={setCurrentDateCreation}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>

              {/* Badge to show active date filter with clear option */}
              {currentDateCreation && (
                <Badge variant="outline" className="w-fit gap-1">
                  {format(currentDateCreation, "dd/MM/yyyy", { locale: es })}
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
                table.setPageIndex(0);
              }}
            >
              <SelectTrigger id="generador-filter" className="w-full ">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 " />
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

          {/* Selector de columnas y botón de acciones en grupo */}
          <div className="flex flex-col justify-end space-y-2">
            {hasSelectedRows ? (
              <Button
                variant="destructive"
                onClick={() => handleDelete()}
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
              <ColumnSelector table={table} />
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
export function CommercialTable<TData extends LeadWithRelations, TValue>({
  columns,
  data,
  defaultPageSize = 10,
  filterPlaceholder = "Busqueda Global...",
  generadores,
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
  const [currentDateCreation, setCurrentDateCreation] = useState<
    Date | undefined
  >(undefined);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  // Use a mounted ref to prevent state updates before mounting
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    if (!isMounted) return; // Prevent updates before mounting
    const newSize = parseInt(value, 10);
    setPageSize(newSize);
    table.setPageSize(newSize);
  };

  const handleGlobalFilterChange = (value: string) => {
    if (!isMounted) return; // Prevent updates before mounting
    setGlobalFilter(value);
    table.setPageIndex(0); // Reset a primera página al filtrar
  };

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <LoaderCircle className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="dark:bg-[#0e0e0e] w-full max-w-[93vw]">
      <TableFilters
        setCurrentDateCreation={setCurrentDateCreation}
        currentDateCreation={currentDateCreation}
        generadores={generadores}
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
