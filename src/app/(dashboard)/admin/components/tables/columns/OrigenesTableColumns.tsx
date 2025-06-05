"use client";
import { LeadOrigen } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { OrigenActionsCell } from "./OrigenActionsCell";

export const origenColumns: ColumnDef<LeadOrigen>[] = [
  {
    id: "Selecciona",
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
    accessorKey: "nombre",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          Nombre
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <>
          <Button variant="outline">{row.original.nombre}</Button>
        </>
      );
    },
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          Origen ID
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <>
          <Button variant="outline">{row.original.id}</Button>
        </>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return <OrigenActionsCell row={row} />;
    },
  },
];
