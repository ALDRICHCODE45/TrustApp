"use client";
import { useMemo, useCallback, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
} from "lucide-react";

interface TablePaginationProps {
  table: any;
  pageSize: number;
  setPageSize: (size: number) => void;
  pageIndex: number;
  setPageIndex: (index: number) => void;
}

export const TablePagination = ({
  table,
  pageSize,
  setPageSize,
  pageIndex,
  setPageIndex,
}: TablePaginationProps) => {
  const handlePageSizeChange = useCallback(
    (value: string) => {
      const newSize = parseInt(value, 10);
      setPageSize(newSize);
      setPageIndex(0);
    },
    [setPageSize, setPageIndex]
  );

  const filteredRowsCount = useMemo(
    () => table.getFilteredRowModel().rows.length,
    [table]
  );

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredRowsCount / pageSize)),
    [filteredRowsCount, pageSize]
  );

  // Calcular el rango actual de registros mostrados
  const startRow = useMemo(
    () => pageIndex * pageSize + 1,
    [pageIndex, pageSize]
  );
  const endRow = useMemo(
    () => Math.min((pageIndex + 1) * pageSize, filteredRowsCount),
    [pageIndex, pageSize, filteredRowsCount]
  );

  useEffect(() => {
    if (pageIndex >= totalPages) {
      setPageIndex(Math.max(0, totalPages - 1));
    }
  }, [totalPages, pageIndex, setPageIndex]);

  // Crear array de páginas para paginación numérica
  const getPageNumbers = useCallback(() => {
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
      (_, i) => startPage + i
    );
  }, [totalPages, pageIndex]);

  const goToFirstPage = useCallback(() => {
    setPageIndex(0);
  }, [setPageIndex]);

  const goToPreviousPage = useCallback(() => {
    if (pageIndex > 0) {
      table.previousPage();
    }
  }, [pageIndex, table]);

  const goToNextPage = useCallback(() => {
    if (pageIndex < totalPages - 1) {
      table.nextPage();
    }
  }, [pageIndex, totalPages, table]);

  const goToLastPage = useCallback(() => {
    setPageIndex(totalPages - 1);
  }, [setPageIndex, totalPages]);

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
                onClick={goToFirstPage}
                disabled={pageIndex === 0}
                className="h-8 w-8"
                title="Primera página"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousPage}
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
                onClick={goToNextPage}
                disabled={pageIndex >= totalPages - 1}
                className="h-8 w-8"
                title="Página siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={goToLastPage}
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
