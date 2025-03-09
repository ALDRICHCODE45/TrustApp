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
import { Button } from "./ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";

export interface TableProps {}
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pageSize, setPageSize] = useState<number>(10); // Estado para el tamaño de página
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
    },
  });

  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value, 10);
    setPageSize(newSize);
    table.setPageSize(newSize); // Actualiza el tamaño de página en la tabla
  };

  // Función para descargar la tabla como PDF
  const downloadTableAsPDF = () => {
    const tableElement = document.querySelector(
      ".downloadable-table"
    ) as HTMLElement;
    if (!tableElement) return;

    html2canvas(tableElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      // Crear un nuevo documento PDF
      const pdf = new jsPDF("p", "mm", "a4"); // Orientación vertical (portrait), tamaño A4
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Agregar el encabezado
      const companyName = "Trust People Company";
      pdf.setFontSize(18);
      pdf.setTextColor("#333333");
      pdf.text(companyName, pageWidth / 2, 20, { align: "center" }); // Centrar el texto

      // Agregar una línea divisoria
      pdf.setLineWidth(0.5);
      pdf.line(10, 25, pageWidth - 10, 25); // Línea horizontal

      // Calcular las dimensiones de la imagen para centrarla
      const imgWidth = 180; // Ancho de la tabla en el PDF
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgX = (pageWidth - imgWidth) / 2; // Centrar horizontalmente
      const imgY = 35; // Espacio desde la parte superior

      // Agregar la imagen de la tabla al PDF
      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth, imgHeight);

      // Agregar un pie de página
      const footerText = "Generado automáticamente por Trust People Company";
      pdf.setFontSize(10);
      pdf.setTextColor("#666666");
      pdf.text(footerText, pageWidth / 2, pageHeight - 10, { align: "center" });

      // Guardar el archivo PDF
      pdf.save("tabla.pdf");
    });
  };

  return (
    <div className="dark:bg-[#0e0e0e] w-full max-w-[93vw]">
      {/* FILTRO POR EMAIL */}
      <div className="flex items-center py-4 dark:bg-[#0e0e0e]">
        <Input
          placeholder="Filtrar..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button variant="outline" onClick={downloadTableAsPDF} className="ml-2">
          <Download />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columnas
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
                            header.getContext()
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
                        cell.getContext()
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* PAGINACION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 sm:px-4 sm:py-2"
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 sm:px-4 sm:py-2"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
