"use client";
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
  Role,
  User,
  UsersData,
  Vacante,
} from "../../../../../lib/data";
import { Layers, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "../../../../../components/DateRangePicker";

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
}

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
}: TableFiltersProps) => {
  const recruites = UsersData.filter((user) => user.rol === Role.reclutador);

  // Función para aplicar el filtro de fecha

  // Función para aplicar el filtro de fecha
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);

    if (!range || (!range.from && !range.to)) {
      // Si no hay rango, eliminar el filtro
      table.getColumn("asignacion")?.setFilterValue(undefined);
      return;
    }

    // Aplicar el filtro al rango seleccionado
    // Importante: utilizamos filterFn directo en vez de usar setFilterValue con una función
    table.getColumn("asignacion")?.setFilterValue(range);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Filtros de Búsqueda</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Filtro de búsqueda general */}
          <div className="space-y-2">
            <Label htmlFor="global-search">Búsqueda General</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="global-search"
                placeholder="Buscar en todas las columnas..."
                className="pl-8"
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Filtro de Estado */}
          <div className="space-y-2">
            <Label htmlFor="status-filter">Estado de la Vacante</Label>
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
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Estado</SelectLabel>
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

          {/* Filtro de Cliente */}
          <div className="space-y-2">
            <Label htmlFor="client-filter">Cliente</Label>
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
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Clientes</SelectLabel>
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
            <Label htmlFor="recruiter-filter">Reclutador</Label>
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
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar reclutador" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Reclutadores</SelectLabel>
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

          <div className="space-y-2">
            <Label htmlFor="recruiter-filter">Tipo</Label>
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
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar reclutador" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tipo</SelectLabel>
                  <SelectItem value="all">Todos tipos</SelectItem>
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
            <Label htmlFor="date-range-filter">Fecha de Asignación</Label>
            <DateRangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              placeholder="Rango de fechas"
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
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
    setPageIndex(0); // Resetear a la primera página cuando cambia el tamaño
  };

  // Calcular el número total de filas filtradas
  const filteredRowsCount = table.getFilteredRowModel().rows.length;
  // Calcular el número de páginas basado en los datos filtrados
  const totalPages = Math.max(1, Math.ceil(filteredRowsCount / pageSize));

  // Asegurar que el índice de página no sea mayor que el número total de páginas
  useEffect(() => {
    if (pageIndex >= totalPages) {
      setPageIndex(Math.max(0, totalPages - 1));
    }
  }, [totalPages, pageIndex, setPageIndex]);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
      {/* Parte izquierda: Contador de filas seleccionadas */}
      <div className="flex-1 text-xs sm:text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} de{" "}
        {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
      </div>

      {/* Parte central: Selector de filas por página */}
      <div className="flex items-center gap-2 mr-4">
        <span className="text-xs sm:text-sm text-muted-foreground">
          Filas por página:
        </span>
        <Select
          value={pageSize.toString()}
          onValueChange={handlePageSizeChange}
        >
          <SelectTrigger className="w-[70px] sm:w-[80px]">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Parte derecha: Botones de paginación */}
      <div className="flex items-center justify-end space-x-2 py-2 sm:py-4">
        <div className="text-sm flex items-center gap-1 mr-2">
          <span>Página</span>
          <strong>
            {Math.min(pageIndex + 1, totalPages)} de {totalPages}
          </strong>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (pageIndex > 0) {
              table.previousPage();
            }
          }}
          disabled={pageIndex === 0}
          className="px-3 py-1 sm:px-4 sm:py-2"
        >
          Anterior
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (pageIndex < totalPages - 1) {
              table.nextPage();
            }
          }}
          disabled={pageIndex >= totalPages - 1}
          className="px-3 py-1 sm:px-4 sm:py-2"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};

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

  useEffect(() => {
    setPageIndex(0);
  }, [columnFilters, globalFilter]);

  const dateRangeFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
    // Si no hay un rango de fechas, no filtramos
    if (!filterValue || (!filterValue.from && !filterValue.to)) {
      return true;
    }

    // Obtenemos el valor de la celda (fecha)
    const cellValue = row.getValue(columnId);

    // Si el valor es nulo o no definido, no pasará el filtro
    if (!cellValue) return false;

    // Convertimos a fecha si es string (importante para manejar diferentes formatos)
    let date: Date;
    if (typeof cellValue === "string") {
      // Intentamos parsear la fecha si viene como string
      date = new Date(cellValue);
    } else if (cellValue instanceof Date) {
      date = cellValue;
    } else {
      // Si no podemos manejar el formato, no pasa el filtro
      return false;
    }

    // Ajustamos la comparación para evitar problemas con horas/minutos/segundos
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

    // Aplicamos la lógica de filtrado según el rango
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
      // Actualizamos el estado de paginación cuando cambia
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
    // Aseguramos que getPaginationRowModel se llame con los parámetros correctos
    pageCount: Math.ceil(data.length / pageSize),
    autoResetPageIndex: true,
    filterFns: {
      dateRange: dateRangeFilterFn,
    },
  });

  const handleGlobalSearch = (value: string) => {
    setGlobalFilter(value);
  };
  return (
    <div className="dark:bg-[#0e0e0e] w-full max-w-[93vw]">
      {/* Componente de filtros */}
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
      />

      {/* Selector de visibilidad de columnas */}
      <div className="flex justify-end mb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span>Columnas</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="max-h-[400px] overflow-y-scroll"
          >
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

      {/* Tabla */}
      <div className="rounded-md border dark:bg-[#0e0e0e] overflow-x-auto">
        <Table className="downloadable-table">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="">
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  className="h-24 text-center"
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Componente de paginación */}
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
