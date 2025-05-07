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
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Layers,
  Trash2,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Oficina, Role, User, UserState } from "@prisma/client";
import CreateProfile from "../components/CreateProfile";
import { toast } from "sonner";
import { desactivateUsers } from "@/actions/users/delete-users";

export interface TableProps {}
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  searchColumn?: string;
  title?: string;
}

export function UsersTable<TData extends User, TValue>({
  columns,
  data,
  searchPlaceholder = "Buscar por correo...",
  searchColumn = "email",
  title = "Usuarios",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pageSize, setPageSize] = useState<number>(10);
  const [globalFilter, setGlobalFilter] = useState("");
  const [currentOficina, setCurrentOficina] = useState("all");
  const [currentRole, setCurrentRole] = useState("all");
  const [currentUserState, setCurrentUserState] = useState("all");

  const [deleteLoading, setDeleteLoading] = useState(false);

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value, 10);
    setPageSize(newSize);
    table.setPageSize(newSize);
  };

  // Calcula la página actual y el total de páginas
  const totalPages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  // Calcula el rango de filas mostradas
  const startRow =
    table.getState().pagination.pageIndex *
      table.getState().pagination.pageSize +
    1;
  const endRow = Math.min(
    startRow + table.getState().pagination.pageSize - 1,
    table.getFilteredRowModel().rows.length,
  );

  const handleDelete = async () => {
    setDeleteLoading(true);
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const ids = selectedRows.map((row) => row.original.id);

    try {
      await desactivateUsers(ids);
      toast.success("Usuarios desactivados correctamente");
    } catch (error) {
      toast.error("Error al desactivar usuarios");
    } finally {
      setDeleteLoading(false);
    }
  };

  const hasSelectedRows = table.getFilteredSelectedRowModel().rows.length > 0;

  return (
    <Card className="w-full shadow-sm border-0 max-w-[93vw]">
      <CardContent className="p-4 md:p-6">
        {/* Encabezado de la tabla con título y contador */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">{title}</h2>
            <p className="text-muted-foreground text-sm">
              Mostrando {startRow}-{endRow} de{" "}
              {table.getFilteredRowModel().rows.length} registros
            </p>
          </div>

          {/* Badge para filas seleccionadas */}
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Badge
              variant="outline"
              className="mt-2 sm:mt-0 px-3 py-1.5 bg-primary/10"
            >
              {table.getFilteredSelectedRowModel().rows.length} seleccionados
            </Badge>
          )}
        </div>

        {/* Barra de herramientas */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center mb-4">
          {/* Buscador */}
          <div className="flex-grow relative ]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9 w-1/3"
            />
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            {hasSelectedRows && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete()}
                className="flex items-center gap-1 cursor-pointer"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <Loader2 className="animate-spin size-4" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                Desactivar {table.getFilteredSelectedRowModel().rows.length}{" "}
                {table.getFilteredSelectedRowModel().rows.length === 1
                  ? "usuario"
                  : "usuarios"}
              </Button>
            )}

            <CreateProfile />

            {/* Controlador de columnas visibles */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Layers className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Columnas</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="max-h-[400px] overflow-y-auto w-56"
              >
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        onSelect={(e) => {
                          // Prevenir que el DropdownMenu se cierre automáticamente
                          e.preventDefault();
                        }}
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

            {/* Aquí se pueden agregar más acciones de tabla según sea necesario */}

            {/* Menú de filtros */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Filtros</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuSeparator />
                {/* Filtro de Oficina */}
                <div className="p-2">
                  <p className="text-sm font-medium mb-2">Oficina</p>

                  <Select
                    value={currentOficina}
                    onValueChange={(value) => {
                      if (value === "all") {
                        table.getColumn("oficina")?.setFilterValue(undefined);
                        setCurrentOficina("all");
                        return;
                      }
                      setCurrentOficina(value);
                      table.getColumn("oficina")?.setFilterValue(value);
                    }}
                  >
                    <SelectTrigger className="h-9 text-sm w-full">
                      <SelectValue placeholder="Todas las oficinas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">Todas las oficinas</SelectItem>
                        <SelectItem value={Oficina.Oficina1}>
                          Oficina 1
                        </SelectItem>
                        <SelectItem value={Oficina.Oficina2}>
                          Oficina 2
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-2">
                  <Select
                    value={currentUserState}
                    onValueChange={(value) => {
                      if (value === "all") {
                        table.getColumn("status")?.setFilterValue(undefined);
                        setCurrentUserState("all");
                        return;
                      }
                      setCurrentUserState(value);
                      table.getColumn("status")?.setFilterValue(value);
                    }}
                  >
                    <p className="text-sm font-medium mb-2">State</p>

                    <SelectTrigger className="h-9 text-sm w-full">
                      <SelectValue placeholder="Todos los Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">Todos los estados</SelectItem>

                        <SelectItem value={UserState.ACTIVO}>Activo</SelectItem>
                        <SelectItem value={UserState.INACTIVO}>
                          Inactivo
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Aquí puedes agregar más filtros según sea necesario */}
                <div className="p-2">
                  <Select
                    value={currentRole}
                    onValueChange={(value) => {
                      if (value === "all") {
                        table.getColumn("role")?.setFilterValue(undefined);
                        setCurrentOficina("all");
                        return;
                      }
                      setCurrentRole(value);
                      table.getColumn("role")?.setFilterValue(value);
                    }}
                  >
                    <p className="text-sm font-medium mb-2">Role</p>

                    <SelectTrigger className="h-9 text-sm w-full">
                      <SelectValue placeholder="Todos los Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">Todos los Roles</SelectItem>

                        <SelectItem value={Role.Admin}>Admin</SelectItem>
                        <SelectItem value={Role.GL}>
                          Generador de Leads
                        </SelectItem>
                        <SelectItem value={Role.MK}>Marketing</SelectItem>
                        <SelectItem value={Role.reclutador}>
                          Reclutador
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                {/* Por ejemplo, filtro de estado, fecha, etc. */}
                <DropdownMenuSeparator />

                {/* Botones de acción para los filtros */}
                <div className="flex justify-end gap-2 p-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setCurrentOficina("all");
                      table.getColumn("oficina")?.setFilterValue(undefined);
                      // Resetear otros filtros aquí
                    }}
                  >
                    Limpiar
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tabla principal */}
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="downloadable-table min-w-full">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="bg-muted/50 hover:bg-muted"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="font-medium text-muted-foreground"
                      >
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
                      className="h-24 text-center text-muted-foreground"
                    >
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Paginación */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          {/* Selector de filas por página */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Mostrar</span>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-16 h-8">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">por página</span>
          </div>

          {/* Información de página */}
          <div className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </div>

          {/* Botones de paginación */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8"
            >
              <span className="sr-only">Primera página</span>
              <ChevronLeft className="h-4 w-4" />
              <ChevronLeft className="h-4 w-4 -ml-2" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8"
            >
              <span className="sr-only">Página anterior</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8"
            >
              <span className="sr-only">Página siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8"
            >
              <span className="sr-only">Última página</span>
              <ChevronRight className="h-4 w-4" />
              <ChevronRight className="h-4 w-4 -ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
