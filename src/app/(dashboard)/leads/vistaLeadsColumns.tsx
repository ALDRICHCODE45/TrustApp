"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Lead } from "@/lib/data";
import { ColumnDef } from "@tanstack/react-table";
import { Building, Calendar, Globe } from "lucide-react";
import { LeadContactosSheet } from "../list/leads/components/LeadContactosSheet";
import { LeadChangeStatus } from "../list/leads/components/LeadChangeStatus";
import { ActionsCell } from "../list/leads/components/ActionsCell";

export const vistaLeadsColumns: ColumnDef<Lead>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select All"
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
    accessorKey: "empresa",
    header: "Empresa",
    cell: ({ row }) => {
      const empresa = row.original.empresa;
      return (
        <div className="flex flex-row gap-2 items-center">
          <Building size={15} className="text-black dark:text-white" />
          <span className="text-black dark:text-white">{empresa}</span>
        </div>
      );
    },
  },
  {
    id: "Origen",
    accessorKey: "origen",
    header: "Origen",
  },
  {
    accessorKey: "sector",
    header: "Sector",
  },
  {
    accessorKey: "link",
    header: "Web",
    cell: ({ row }) => {
      const link = row.getValue("link") as string;
      return (
        <div className="flex gap-2 items-center">
          <a href={link} target="_blank" className="underline">
            <Globe size={17} />
          </a>
        </div>
      );
    },
  },
  {
    accessorKey: "fechaProspeccion",
    header: "Fecha Prospeccion",
    cell: ({ row }) => {
      const fecha = row.getValue("fechaProspeccion") as string;
      return (
        <div className="flex flex-row gap-2 items-center">
          <Calendar size={17} />
          <span>{fecha}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "contactos",
    header: "Contactos",
    cell: ({ row }) => (
      <LeadContactosSheet contactos={row.original.contactos} />
    ),
  },
  {
    accessorKey: "fechaAConectar",
    header: "Fecha de Coneccion",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <LeadChangeStatus row={row} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ActionsCell row={row} />;
    },
  },
];
