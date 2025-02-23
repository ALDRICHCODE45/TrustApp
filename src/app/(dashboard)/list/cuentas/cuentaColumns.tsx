"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Cuenta } from "@/lib/data";
import { ColumnDef } from "@tanstack/react-table";
import { Files, MoreHorizontal, SquarePen } from "lucide-react";
import { toast } from "sonner";

export const cuentaColumns: ColumnDef<Cuenta>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fecha",
    header: "Fecha",
  },
  {
    accessorKey: "concepto",
    header: "Concepto",
  },
  {
    accessorKey: "detalle",
    header: "Detalle",
  },
  {
    accessorKey: "subtotal",
    header: "Subtotal",
    cell: ({ row }) => {
      const subtotal = row.original.subtotal;
      return <span className="font-semibold">${subtotal}</span>;
    },
  },
  {
    accessorKey: "iva",
    header: "Iva",
    cell: ({ row }) => {
      const iva = row.original.iva;
      return <span className="font-semibold">${iva}</span>;
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const total = row.original.total;
      return <span className="font-semibold">${total}</span>;
    },
  },
  {
    id: "actions",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open Menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                toast("Realizado", {
                  description: "Datos copiados al portapapeles",
                  action: {
                    label: "OK",
                    onClick: () => console.log(""),
                  },
                });
              }}
            >
              <Files />
              Copiar datos
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <SquarePen />
              Editar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
