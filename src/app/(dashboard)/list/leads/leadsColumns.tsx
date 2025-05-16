"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Globe } from "lucide-react";
import { ActionsCell } from "./components/ActionsCell";
import { LeadContactosSheet } from "./components/LeadContactosSheet";
import { LeadChangeStatus } from "./components/LeadChangeStatus";
import { GeneradorDropdownSelect } from "./components/GeneradorDropdownSelect";
import { LeadWithRelations } from "../../leads/kanban/page";
import { Button } from "@/components/ui/button";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

export const leadsColumns: ColumnDef<LeadWithRelations>[] = [
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
      return <span>{empresa}</span>;
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
          <Button variant="outline">{origen}</Button>
        </>
      );
    },
  },
  {
    accessorKey: "sector",
    header: "Sector",
    cell: ({ row }) => {
      const sector = row.original.sector.nombre;
      return (
        <>
          <Button variant="outline">{sector}</Button>
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
        <div className="flex gap-2 items-center">
          <a href={link} target="_blank" className="underline">
            <Globe size={17} />
          </a>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Fecha Creación",
    cell: ({ row }) => {
      const fecha = row.original.createdAt;
      return (
        <div className="text-center">
          <Button variant="outline">
            {format(new Date(fecha), "eee dd/MM/yyyy", { locale: es })}
          </Button>
        </div>
      );
    },
    accessorFn: (row) => new Date(row.createdAt),
    // Usar la función de filtro directamente en lugar de referirla por nombre
    filterFn: (row, columnId, filterValue) => {
      // Si no hay valor de filtro, mostrar todas las filas
      if (!filterValue) return true;

      // Obtener la fecha de los datos de la fila
      const rowDate = row.getValue(columnId) as Date;
      const rowDateObj = rowDate instanceof Date ? rowDate : new Date(rowDate);

      // Asegurar que el valor del filtro es un objeto Date
      const filterDate =
        filterValue instanceof Date ? filterValue : new Date(filterValue);

      // Comparar solo año, mes y día usando isSameDay de date-fns
      return isSameDay(rowDateObj, filterDate);
    },
  },
  {
    accessorKey: "contactos",
    header: "Contactos",
    cell: ({ row }) => (
      <LeadContactosSheet
        contactos={row.original.contactos}
        leadId={row.original.id}
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
    header: () => null,
    cell: () => null,
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
