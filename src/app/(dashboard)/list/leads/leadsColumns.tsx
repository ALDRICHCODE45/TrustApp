"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Lead } from "@/lib/data";
import { ColumnDef } from "@tanstack/react-table";
import { Building, Calendar, Globe } from "lucide-react";
import { ActionsCell } from "./components/ActionsCell";
import { GeneratorDropDown } from "./components/SelectGLDropDown";
import { LeadContactosSheet } from "./components/LeadContactosSheet";
import { LeadChangeStatus } from "./components/LeadChangeStatus";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export const leadsColumns: ColumnDef<Lead>[] = [
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
          <Building
            size={15}
            className="hidden md:block text-black dark:text-white"
          />
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
    id: "generadorLeads",
    accessorKey: "generadorLeads",
    header: "Generador",
    cell: ({ row }) => {
      return <GeneratorDropDown row={row} />;
    },
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
    header: "Fecha Prospección",
    cell: ({ row }) => {
      const fecha = row.getValue("fechaProspeccion") as string;

      return (
        <div className="flex flex-row gap-2 items-center">
          {/* Icono del calendario */}
          <Calendar size={17} className="hidden md:block" />

          {/* Fecha visible en desktop */}
          <span className="hidden md:block">{fecha}</span>

          {/* Popover para mobile */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Calendar size={17} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4">
              <p className="text-sm font-medium">Fecha de Prospección:</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Lun {fecha}
              </p>
            </PopoverContent>
          </Popover>
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
    cell: ({ row }) => {
      const fecha = row.original.fechaAConectar;
      return (
        <>
          <div className="flex flex-row gap-2 items-center">
            {/* Icono del calendario */}
            <Calendar size={17} className="hidden md:block" />

            {/* Fecha visible en desktop */}
            <span className="hidden md:block">{fecha}</span>

            {/* Popover para mobile */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Calendar size={17} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4">
                <p className="text-sm font-medium">Fecha a conectar:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Lun {fecha}
                </p>
              </PopoverContent>
            </Popover>
          </div>
        </>
      );
    },
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
