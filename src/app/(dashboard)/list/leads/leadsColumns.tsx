"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Building, Globe } from "lucide-react";
import { ActionsCell } from "./components/ActionsCell";
import { LeadContactosSheet } from "./components/LeadContactosSheet";
import { LeadChangeStatus } from "./components/LeadChangeStatus";
import { GeneradorDropdownSelect } from "./components/GeneradorDropdownSelect";
import { ChangeDateComponent } from "../reclutamiento/components/AsignacionDatePickerComponent";
import { Lead, User, Person } from "@prisma/client";
import { editLeadById } from "@/actions/leads/actions";
import { toast } from "sonner";

export const leadsColumns: ColumnDef<
  Lead & { generadorLeads: User; contactos: Person[] }
>[] = [
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
      return <GeneradorDropdownSelect row={row} />;
    },
    accessorFn: (row) => row.generadorLeads.name,
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
      const fecha = row.getValue("fechaProspeccion") as Date;

      return (
        <ChangeDateComponent
          fecha={fecha}
          onFechaChange={async (nuevaFecha) => {
            // Aquí implementarías la lógica para actualizar la fecha en tu fuente de datos
            const date = nuevaFecha.toISOString();
            const formData = new FormData();
            formData.append("fechaProspeccion", date);
            try {
              await editLeadById(row.original.id, formData);
              toast.info("Fecha cambiada correctamente");
            } catch (error) {
              console.log(error);
              toast.error("Error al actualizar el lead");
            }
          }}
        />
      );
    },
    accessorFn: (row) => row.fechaProspeccion,
    filterFn: (row, columnId, filterValue) => {
      // Si no hay valor de filtro, mostrar todas las filas
      if (!filterValue) return true;

      // Convertir ambas fechas al mismo formato para comparar
      const rowDate = new Date(row.getValue(columnId));
      const filterDate = new Date(filterValue);

      // Comparar solo año, mes y día (ignorando horas, minutos, etc.)
      return (
        rowDate.getFullYear() === filterDate.getFullYear() &&
        rowDate.getMonth() === filterDate.getMonth() &&
        rowDate.getDate() === filterDate.getDate()
      );
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
    accessorKey: "fechaAConectar",
    header: "Fecha de Coneccion",
    cell: ({ row }) => {
      return (
        <ChangeDateComponent
          fecha={row.original.fechaAConectar}
          onFechaChange={async (nuevaFecha) => {
            // Aquí implementarías la lógica para actualizar de tu fuente de datos
            const date = nuevaFecha.toISOString();
            const formData = new FormData();
            formData.append("fechaAConectar", date);
            try {
              await editLeadById(row.original.id, formData);
              toast.success("Fecha de coneccion actualizada con exito");
            } catch (err) {
              toast.info("Error al editar el lead");
            }
          }}
        />
      );
    },
    accessorFn: (row) => row.fechaAConectar,
    filterFn: (row, columnId, filterValue) => {
      // Si no hay valor de filtro, mostrar todas las filas
      if (!filterValue) return true;

      // Convertir ambas fechas al mismo formato para comparar
      const rowDate = new Date(row.getValue(columnId));
      const filterDate = new Date(filterValue);

      // Comparar solo año, mes y día (ignorando horas, minutos, etc.)
      return (
        rowDate.getFullYear() === filterDate.getFullYear() &&
        rowDate.getMonth() === filterDate.getMonth() &&
        rowDate.getDate() === filterDate.getDate()
      );
    },
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
