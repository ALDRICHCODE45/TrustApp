"use client";
import { Badge } from "@/components/ui/badge";
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
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  clientesData,
  Oficina,
  Role,
  User,
  UsersData,
  Vacante,
} from "../../../../../lib/data";
import {
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  Download,
  FileText,
  Filter,
  FolderSearch,
  Layers,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "../../../../../components/DateRangePicker";
import CreateVacanteForm from "../components/CreateVacanteForm";

// Componente de Filtros separado
interface TableFiltersProps {
  table: any;
  currentStatus: string;
  setCurrentStatus: (status: string) => void;
  currentClient: string;
  setCurrentClient: (client: string) => void;
  currentRecruiter: string;
  setCurrentRecruiter: (recruiter: string) => void;
  onSearchChange: (value: string) => void;
  currentTipo: string;
  setCurrentTipo: (value: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  currentOficina: Oficina | "all";
  setCurrentOficina: (newOficina: Oficina | "all") => void;
}

// TableFilters Mejorado
const TableFilters = ({
  table,
  currentStatus,
  setCurrentStatus,
  currentClient,
  setCurrentClient,
  currentRecruiter,
  setCurrentRecruiter,
  onSearchChange,
  currentTipo,
  setCurrentTipo,
  dateRange,
  setDateRange,
  currentOficina,
  setCurrentOficina,
}: TableFiltersProps) => {
  const recruites = UsersData.filter((user) => user.rol === Role.reclutador);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);

    if (!range || (!range.from && !range.to)) {
      table.getColumn("asignacion")?.setFilterValue(undefined);
      return;
    }

    table.getColumn("asignacion")?.setFilterValue(range);
  };

  const resetFilters = () => {
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
    onSearchChange("");
  };

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
            variant="ghost"
            size="sm"
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="h-8 px-2"
          >
            {isFilterExpanded ? <ChevronUp /> : <ChevronDown />}
          </Button>
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

      {isFilterExpanded && (
        <CardContent className="pt-4 pb-3 px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Filtro de búsqueda general */}
            <div className="space-y-2">
              <Label htmlFor="global-search" className="text-xs font-medium">
                Búsqueda General
              </Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="global-search"
                  placeholder="Buscar..."
                  className="pl-8 h-9 text-sm focus-visible:ring-primary/50"
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
            </div>

            {/* Filtro de Estado */}
            <div className="space-y-2">
              <Label htmlFor="status-filter" className="text-xs font-medium">
                Estado
              </Label>
              <Select
                value={currentStatus}
                onValueChange={(value) => {
                  if (value === "all") {
                    table.getColumn("estado")?.setFilterValue(undefined);
                    setCurrentStatus("all");
                    return;
                  }
                  setCurrentStatus(value);
                  table.getColumn("estado")?.setFilterValue(value);
                }}
              >
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
              <Label htmlFor="client-filter" className="text-xs font-medium">
                Oficina
              </Label>
              <Select
                value={currentOficina}
                onValueChange={(value) => {
                  if (value === "all") {
                    table.getColumn("oficina")?.setFilterValue(undefined);
                    setCurrentOficina("all");
                    return;
                  }
                  setCurrentOficina(value as Oficina);
                  table.getColumn("oficina")?.setFilterValue(value);
                }}
              >
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
              <Select
                value={currentClient}
                onValueChange={(value) => {
                  if (value === "all") {
                    table.getColumn("cliente")?.setFilterValue(undefined);
                    setCurrentClient("all");
                    return;
                  }
                  setCurrentClient(value);
                  table.getColumn("cliente")?.setFilterValue(value);
                }}
              >
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
                onValueChange={(value) => {
                  if (value === "all") {
                    table.getColumn("reclutador")?.setFilterValue(undefined);
                    setCurrentRecruiter("all");
                    return;
                  }
                  setCurrentRecruiter(value);
                  table.getColumn("reclutador")?.setFilterValue(value);
                }}
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
              <Select
                value={currentTipo}
                onValueChange={(value) => {
                  if (value === "all") {
                    table.getColumn("tipo")?.setFilterValue(undefined);
                    setCurrentTipo("all");
                    return;
                  }
                  setCurrentTipo(value);
                  table.getColumn("tipo")?.setFilterValue(value);
                }}
              >
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
              <Label
                htmlFor="date-range-filter"
                className="text-xs font-medium"
              >
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
                  onClick={() => {
                    setCurrentOficina("all");
                    table.getColumn("oficina")?.setFilterValue(undefined);
                  }}
                />
              </Badge>
            )}

            {currentStatus !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Estado: {currentStatus}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => {
                    setCurrentStatus("all");
                    table.getColumn("estado")?.setFilterValue(undefined);
                  }}
                />
              </Badge>
            )}
            {currentClient !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Cliente: {currentClient}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => {
                    setCurrentClient("all");
                    table.getColumn("cliente")?.setFilterValue(undefined);
                  }}
                />
              </Badge>
            )}
            {currentRecruiter !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Reclutador: {currentRecruiter}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => {
                    setCurrentRecruiter("all");
                    table.getColumn("reclutador")?.setFilterValue(undefined);
                  }}
                />
              </Badge>
            )}
            {currentTipo !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Tipo: {currentTipo}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => {
                    setCurrentTipo("all");
                    table.getColumn("tipo")?.setFilterValue(undefined);
                  }}
                />
              </Badge>
            )}
            {dateRange && (dateRange.from || dateRange.to) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Fecha: {dateRange.from?.toLocaleDateString()} -{" "}
                {dateRange.to?.toLocaleDateString() || "ahora"}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => {
                    setDateRange(undefined);
                    table.getColumn("asignacion")?.setFilterValue(undefined);
                  }}
                />
              </Badge>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

// Componente de paginación separado
interface TablePaginationProps {
  table: any;
  pageSize: number;
  setPageSize: (size: number) => void;
  pageIndex: number;
  setPageIndex: (index: number) => void;
}
// Componente de paginación mejorado
const TablePagination = ({
  table,
  pageSize,
  setPageSize,
  pageIndex,
  setPageIndex,
}: TablePaginationProps) => {
  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value, 10);
    setPageSize(newSize);
    setPageIndex(0);
  };

  const filteredRowsCount = table.getFilteredRowModel().rows.length;
  const totalPages = Math.max(1, Math.ceil(filteredRowsCount / pageSize));

  // Calcular el rango actual de registros mostrados
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, filteredRowsCount);

  useEffect(() => {
    if (pageIndex >= totalPages) {
      setPageIndex(Math.max(0, totalPages - 1));
    }
  }, [totalPages, pageIndex, setPageIndex]);

  // Crear array de páginas para paginación numérica
  const getPageNumbers = () => {
    const totalPageNumbers = 5; // Número máximo de botones de página a mostrar

    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    // Calcular qué páginas mostrar basado en la página actual
    let startPage = Math.max(0, pageIndex - Math.floor(totalPageNumbers / 2));
    let endPage = Math.min(totalPages - 1, startPage + totalPageNumbers - 1);

    // Ajustar cuando estamos cerca del final
    if (endPage - startPage < totalPageNumbers - 1) {
      startPage = Math.max(0, endPage - totalPageNumbers + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );
  };

  return (
    <Card className="mt-6 border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Información de selección y paginación */}
          <div className="flex flex-col xs:flex-row items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckSquare className="h-4 w-4 text-primary/70" />
              <span>
                {table.getFilteredSelectedRowModel().rows.length} de{" "}
                {filteredRowsCount} seleccionados
              </span>
            </div>

            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4 text-primary/70" />
              <span>
                Mostrando {filteredRowsCount > 0 ? startRow : 0}-{endRow} de{" "}
                {filteredRowsCount} registros
              </span>
            </div>
          </div>

          {/* Controles de paginación */}
          <div className="flex flex-col xs:flex-row items-center gap-4">
            {/* Selector de filas por página */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Filas por página:
              </span>
              <Select
                value={pageSize.toString()}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="h-8 w-[70px] text-sm">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Navegación de páginas */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPageIndex(0)}
                disabled={pageIndex === 0}
                className="h-8 w-8"
                title="Primera página"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  if (pageIndex > 0) {
                    table.previousPage();
                  }
                }}
                disabled={pageIndex === 0}
                className="h-8 w-8"
                title="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Indicador de página actual (visible en móviles) */}
              <div className="flex md:hidden items-center px-3 h-8 text-sm border rounded">
                <span>
                  {pageIndex + 1} / {totalPages}
                </span>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  if (pageIndex < totalPages - 1) {
                    table.nextPage();
                  }
                }}
                disabled={pageIndex >= totalPages - 1}
                className="h-8 w-8"
                title="Página siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setPageIndex(totalPages - 1)}
                disabled={pageIndex >= totalPages - 1}
                className="h-8 w-8"
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
};

// También actualicemos la función RecruiterTable para integrar los componentes mejorados
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
export function RecruiterTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [currentStatus, setCurrentStatus] = useState("all");
  const [currentRecruiter, setCurrentRecruiter] = useState("all");
  const [currentClient, setCurrentClient] = useState("all");
  const [globalFilter, setGlobalFilter] = useState("");
  const [currentTipo, setCurrentTipo] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [currentOficina, setCurrentOficina] = useState<Oficina | "all">("all");

  useEffect(() => {
    setPageIndex(0);
  }, [columnFilters, globalFilter]);

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
      date.getDate(),
    );

    const fromDate = filterValue.from
      ? new Date(
          filterValue.from.getFullYear(),
          filterValue.from.getMonth(),
          filterValue.from.getDate(),
        )
      : null;

    const toDate = filterValue.to
      ? new Date(
          filterValue.to.getFullYear(),
          filterValue.to.getMonth(),
          filterValue.to.getDate(),
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
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater(table.getState().pagination)
          : updater;

      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize,
      },
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    manualPagination: false,
    pageCount: Math.ceil(data.length / pageSize),
    autoResetPageIndex: true,
    filterFns: {
      filterDateRange: (row: any, id: any, filterValue: any) => {
        const oficina = row.getValue(id);
        if (filterValue === "all" || !filterValue || oficina === null) return true;
        return oficina === filterValue;
      },
    },
  });

  const handleGlobalSearch = (value: string) => {
    setGlobalFilter(value);
  };

  return (
    <div className="w-full max-w-[93vw] space-y-4">
      {/* Panel superior con acciones principales */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Gestión de Vacantes
        </h2>

        <div className="flex items-center gap-2">
          <CreateVacanteForm />
          {/* Selector de visibilidad de columnas */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 flex items-center gap-2"
              >
                <Layers className="h-4 w-4" />
                <span>Columnas</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="max-h-[400px] overflow-y-scroll"
            >
              <DropdownMenuLabel>Mostrar/Ocultar Columnas</DropdownMenuLabel>
              <DropdownMenuSeparator />
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

          <Button size="sm" className="h-9 flex items-center gap-2">
            <Download />
            <span>Exportar</span>
          </Button>
        </div>
      </div>

      {/* Componente de filtros mejorado */}
      <TableFilters
        table={table}
        currentStatus={currentStatus}
        setCurrentStatus={setCurrentStatus}
        currentClient={currentClient}
        setCurrentClient={setCurrentClient}
        currentRecruiter={currentRecruiter}
        setCurrentRecruiter={setCurrentRecruiter}
        onSearchChange={handleGlobalSearch}
        currentTipo={currentTipo}
        setCurrentTipo={setCurrentTipo}
        dateRange={dateRange}
        setDateRange={setDateRange}
        currentOficina={currentOficina}
        setCurrentOficina={setCurrentOficina}
      />

      {/* Tabla con bordes redondeados y sombra */}
      <div className="rounded-md border shadow-sm dark:bg-[#0e0e0e] overflow-hidden">
        <Table className="downloadable-table">
          <TableHeader className="bg-gray-50 dark:bg-slate-900/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="font-medium text-xs uppercase py-3"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
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
                  className="hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <FolderSearch className="h-8 w-8 mb-2 opacity-40" />
                    <h3 className="font-medium">
                      No se encontraron resultados
                    </h3>
                    <p className="text-sm">
                      Intente con diferentes criterios de búsqueda
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Componente de paginación mejorado */}
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
