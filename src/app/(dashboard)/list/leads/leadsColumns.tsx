"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Globe } from "lucide-react";
import { ActionsCell } from "./components/ActionsCell";
import { LeadContactosSheet } from "./components/LeadContactosSheet";
import { LeadChangeStatus } from "./components/LeadChangeStatus";
import { GeneradorDropdownSelect } from "./components/GeneradorDropdownSelect";
import { LeadWithRelations } from "../../leads/kanban/page";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

// Declaración de módulo corregida
declare module "@tanstack/react-table" {
  interface FilterFns {
    filterDateRange: FilterFn<LeadWithRelations>;
  }
}

const oficinaMap = {
  Oficina1: "Oficina 1",
  Oficina2: "Oficina 2",
};

// Función para crear las columnas con la función de actualización
export const createLeadsColumns = (
  updateLeadInState?: (
    leadId: string,
    updates: Partial<LeadWithRelations>
  ) => void
): ColumnDef<LeadWithRelations>[] => [
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
    enableHiding: false,
  },
  {
    accessorKey: "empresa",
    header: "Empresa",
    cell: ({ row }) => {
      const empresa = row.original.empresa;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">{empresa}</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Nombre de la empresa</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    id: "Origen",
    accessorKey: "origen",
    header: "Origen",
    cell: ({ row }) => {
      const origen = row.original.origen.nombre;

      return (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">{origen}</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Origen del lead</p>
            </TooltipContent>
          </Tooltip>
        </>
      );
    },
    accessorFn: (row) => row.origen.id,
    filterFn: (row, _id, filterValue) => {
      const origenId = row.original.origen.id;
      if (filterValue === "all" || !filterValue) return true;
      return origenId === filterValue;
    },
  },
  {
    accessorKey: "sector",
    header: "Sector",
    cell: ({ row }) => {
      const sector = row.original.sector.nombre;
      return (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">{sector}</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sector del lead</p>
            </TooltipContent>
          </Tooltip>
        </>
      );
    },
  },
  {
    id: "generadorLeads",
    accessorKey: "generadorLeads",
    header: "Generador",
    cell: ({ row }) => {
      return <GeneradorDropdownSelect row={row} />;
    },
    accessorFn: (row) => row.generadorLeads.id,
  },
  {
    accessorKey: "link",
    header: "Web",
    cell: ({ row }) => {
      let link = row.getValue("link") as string;
      // Asegúrate de que empiece con "http" o "https"
      if (!/^https?:\/\//i.test(link)) {
        link = `https://${link}`;
      }
      return (
        <div className="flex gap-2 items-center justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={link} target="_blank" className="underline">
                <Globe size={17} />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{link}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Creación",
    cell: ({ row }) => {
      // La fecha viene en UTC desde la base de datos
      const fechaUTC = new Date(row.original.createdAt);

      return (
        <div className="text-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">
                {format(fechaUTC, "eee dd/MM/yyyy", { locale: es })}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Fecha de creación del lead</p>
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
    accessorFn: (row) => {
      // La fecha viene en UTC desde la base de datos
      const fechaUTC = new Date(row.createdAt);
      // Convertir a fecha local para el filtrado
      return new Date(
        fechaUTC.toLocaleString("en-US", { timeZone: "America/Mexico_City" })
      );
    },
    filterFn: "filterDateRange",
  },
  {
    accessorKey: "contactos",
    header: "Contactos",
    cell: ({ row }) => (
      <LeadContactosSheet
        contactos={row.original.contactos}
        leadId={row.original.id}
        empresaName={row.original.empresa}
        updateLeadInState={updateLeadInState}
      />
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <LeadChangeStatus row={row} />;
    },
    filterFn: (row, _id, filterValue) => {
      const status = row.original.status;
      if (filterValue === "all" || !filterValue) return true;
      return status === filterValue;
    },
  },
  {
    accessorKey: "oficina",
    header: () => <div className="text-center">Oficina</div>,
    cell: ({ row }) => {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">
              {
                oficinaMap[
                  row.original.generadorLeads.Oficina as keyof typeof oficinaMap
                ]
              }
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Oficina del lead</p>
          </TooltipContent>
        </Tooltip>
      );
    },
    accessorFn: (row) => {
      return row.generadorLeads.Oficina || null;
    },
    filterFn: (row, id, filterValue) => {
      const oficina = row.getValue(id);
      if (filterValue === "all" || !filterValue) return true;
      return oficina === filterValue;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return <ActionsCell row={row} />;
    },
  },
];

// Exportar las columnas por defecto para compatibilidad
export const leadsColumns = createLeadsColumns();
