"use client";
import { useMemo, useCallback, useState } from "react";
import {
  ColumnDef,
  flexRender,
  useReactTable,
  ColumnOrderState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FolderSearch } from "lucide-react";

interface DataGridProps<TData, TValue> {
  table: ReturnType<typeof useReactTable<TData>>;
  columns: ColumnDef<TData, TValue>[];
}

export const DataGrid = <TData, TValue>({
  table,
  columns,
}: DataGridProps<TData, TValue>) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  // Columnas que no se pueden mover
  const nonDraggableColumns = useMemo(() => ["select", "actions"], []);

  // Inicializar columnOrder con las columnas actuales
  const columnOrder = useMemo(() => {
    return table.getAllColumns().map((column) => column.id);
  }, [table]);

  const handleDragStart = useCallback(
    (e: React.DragEvent, columnId: string) => {
      setDraggedColumn(columnId);
      e.dataTransfer.setData("text/plain", columnId);
      e.dataTransfer.effectAllowed = "move";
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    setDraggedColumn(null);
    setDropTarget(null);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, columnId: string) => {
      e.preventDefault();
      if (columnId !== draggedColumn) {
        setDropTarget(columnId);
      }
    },
    [draggedColumn]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent, columnId: string) => {
      e.preventDefault();
      if (columnId !== draggedColumn) {
        setDropTarget(null);
      }
    },
    [draggedColumn]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, dropColumnId: string) => {
      e.preventDefault();
      setDraggedColumn(null);
      setDropTarget(null);
      const draggedColumnId = e.dataTransfer.getData("text/plain");

      if (draggedColumnId === dropColumnId) return;

      const currentOrder = table.getAllColumns().map((column) => column.id);
      const draggedIndex = currentOrder.indexOf(draggedColumnId);
      const dropIndex = currentOrder.indexOf(dropColumnId);

      if (draggedIndex === -1 || dropIndex === -1) return;

      const newColumnOrder = [...currentOrder];
      newColumnOrder.splice(draggedIndex, 1);
      newColumnOrder.splice(dropIndex, 0, draggedColumnId);

      table.setColumnOrder(newColumnOrder);
    },
    [table]
  );

  const handleRowMouseEnter = useCallback((rowId: string) => {
    setHoveredRow(rowId);
  }, []);

  const handleRowMouseLeave = useCallback(() => {
    setHoveredRow(null);
  }, []);

  const handleClearFilters = useCallback(() => {
    table.resetColumnFilters();
  }, [table]);

  // Memoizar las filas para evitar re-renderizaciones innecesarias
  const tableRows = useMemo(() => table.getRowModel().rows, [table]);

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
                        ? (e) => handleDragStart(e, header.id)
                        : undefined
                    }
                    onDragEnd={isDraggable ? handleDragEnd : undefined}
                    onDragOver={
                      isDraggable
                        ? (e) => handleDragOver(e, header.id)
                        : undefined
                    }
                    onDragLeave={
                      isDraggable
                        ? (e) => handleDragLeave(e, header.id)
                        : undefined
                    }
                    onDrop={
                      isDraggable ? (e) => handleDrop(e, header.id) : undefined
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
          {tableRows?.length ? (
            tableRows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={`
                  hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors group
                  ${hoveredRow === row.id ? "bg-muted/30" : ""}
                  ${row.getIsSelected() ? "bg-primary/10" : ""}
                `}
                onMouseEnter={() => handleRowMouseEnter(row.id)}
                onMouseLeave={handleRowMouseLeave}
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
};
