"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import {
  BookCheck,
  ChevronDown,
  ChevronUp,
  SortAsc,
  UserPen,
} from "lucide-react";
import { ChangeDateComponent } from "../../list/reclutamiento/components/AsignacionDatePickerComponent";
import { RecruiterDropDown } from "../../list/reclutamiento/components/RecruiterDropdown";
import { ClientesDropDown } from "../../list/reclutamiento/components/ClientesDropdown";
import { TypeDropdown } from "../../list/reclutamiento/components/TypeDropDown";
import { StatusDropdown } from "../../list/reclutamiento/components/StatusDropdown";
import { PosicionPopOver } from "../../list/reclutamiento/components/PosicionPopOver";
import { CommentSheet } from "../../list/reclutamiento/components/CommentSheet";
import { FinalTernaSheet } from "../../list/reclutamiento/components/FinalTernaSheet";
import { ActionsRecruitment } from "../../list/reclutamiento/components/ActionsRecruitment";
import { Prisma, Vacancy } from "@prisma/client";

export type VacancyWithRelations = Prisma.VacancyGetPayload<{
  include: {
    reclutador: true;
    cliente: true;
    candidatoContratado: true;
    ternaFinal: true;
    Comments: {
      include: {
        author: true;
      };
    };
  };
}>;

// headers ordenables
const SortableHeader = ({ column, title }: { column: any; title: string }) => {
  return (
    <div
      className="flex items-center cursor-pointer"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      {column.getIsSorted() === "asc" ? (
        <ChevronUp className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === "desc" ? (
        <ChevronDown className="ml-2 h-4 w-4" />
      ) : (
        <SortAsc className="ml-2 h-4 w-4 " />
      )}
    </div>
  );
};
export const reclutadorColumns: ColumnDef<VacancyWithRelations>[] = [
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
    id: "asignacion",
    header: "Asignacion",
    accessorKey: "fechaAsignacion",
    cell: ({ row }) => {
      return (
        <ChangeDateComponent
          fecha={row.original.fechaAsignacion}
          onFechaChange={(nuevaFecha) => {
            // Aquí implementarías la lógica para actualizar la fecha en tu fuente de datos
            console.log("Fecha actualizada:", nuevaFecha);
          }}
        />
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || (!filterValue.from && !filterValue.to)) {
        return true;
      }

      const cellValue = row.getValue(columnId);
      if (!cellValue) return false;

      let date: Date;
      if (typeof cellValue === "string") {
        date = new Date(cellValue);
      } else if (cellValue instanceof Date) {
        date = cellValue;
      } else {
        return false;
      }

      const dateOnly = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );

      const fromDate = filterValue.from
        ? new Date(
            filterValue.from.getFullYear(),
            filterValue.from.getMonth(),
            filterValue.from.getDate()
          )
        : null;

      const toDate = filterValue.to
        ? new Date(
            filterValue.to.getFullYear(),
            filterValue.to.getMonth(),
            filterValue.to.getDate()
          )
        : null;

      if (fromDate && toDate) {
        return dateOnly >= fromDate && dateOnly <= toDate;
      } else if (fromDate) {
        return dateOnly >= fromDate;
      } else if (toDate) {
        return dateOnly <= toDate;
      }

      return true;
    },
  },
  {
    id: "reclutador",
    accessorKey: "reclutador",
    header: ({ column }) => (
      <SortableHeader column={column} title="Reclutador" />
    ),
    cell: ({ row }) => {
      return <RecruiterDropDown row={row} />;
    },
    accessorFn: (row) => row.reclutador.id,
  },
  {
    id: "tipo",
    accessorKey: "tipo",
    header: ({ column }) => <SortableHeader column={column} title="Tipo" />,
    cell: ({ row }) => {
      return <TypeDropdown row={row} />;
    },
    accessorFn: (row) => row.tipo,
  },
  {
    id: "cliente",
    accessorKey: "cliente",
    header: ({ column }) => <SortableHeader column={column} title="Cliente" />,
    cell: ({ row }) => {
      return <ClientesDropDown row={row} />;
    },
    accessorFn: (row) => row.cliente.cuenta,
  },
  {
    id: "estado",
    accessorKey: "estado",
    header: ({ column }) => <SortableHeader column={column} title="Estado" />,

    cell: ({ row }) => {
      return <StatusDropdown row={row} />;
    },
  },
  {
    id: "posicion",
    accessorKey: "puesto",
    header: ({ column }) => <SortableHeader column={column} title="Posicion" />,
    cell: ({ row }) => {
      return <PosicionPopOver row={row} />;
    },
  },
  {
    id: "comentarios",
    accessorKey: "comentarios",
    header: "Comentarios",
    cell: ({ row }) => <CommentSheet comments={row.original.Comments} />,
  },
  {
    accessorKey: "fechaUltimaTerna",
    header: ({ column }) => (
      <SortableHeader column={column} title="Fecha Terna" />
    ),
    cell: ({ row }) => {
      return (
        <ChangeDateComponent
          fecha={row.original.fechaAsignacion}
          onFechaChange={(nuevaFecha) => {
            // Aquí implementarías la lógica para actualizar la fecha en tu fuente de datos
            console.log("Fecha actualizada:", nuevaFecha);
          }}
        />
      );
    },
  },
  {
    accessorKey: "tiempoTranscurrido",
    header: ({ column }) => (
      <SortableHeader column={column} title="Tiempo trranscurrido" />
    ),

    cell: ({ row }) => {
      const tiempo = row.original.tiempoTranscurrido;
      return <span>{tiempo} días</span>;
    },
  },
  {
    accessorKey: "fechaOferta",
    header: ({ column }) => (
      <SortableHeader column={column} title="Fecha oferta" />
    ),
    cell: ({ row }) => {
      return (
        <ChangeDateComponent
          fecha={row.original.fechaAsignacion}
          onFechaChange={(nuevaFecha) => {
            // Aquí implementarías la lógica para actualizar la fecha en tu fuente de datos
            console.log("Fecha actualizada:", nuevaFecha);
          }}
        />
      );
    },
  },
  {
    accessorKey: "candidatoContratado",
    header: "Finalista",
    cell: ({ row }) => (
      <div>
        {row.original.candidatoContratado ? (
          <p>{row.original.candidatoContratado.name}</p>
        ) : (
          <p className="text-red-500">N.A</p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "salario",
    header: ({ column }) => <SortableHeader column={column} title="Salario" />,
    cell: ({ row }) => {
      const salario = row.original.salario;
      return <span>${salario}</span>;
    },
  },
  {
    accessorKey: "fechaComision",
    header: ({ column }) => (
      <SortableHeader column={column} title="Fecha comision" />
    ),
    cell: ({ row }) => {
      return (
        <ChangeDateComponent
          fecha={row.original.fechaAsignacion}
          onFechaChange={(nuevaFecha) => {
            // Aquí implementarías la lógica para actualizar la fecha en tu fuente de datos
            console.log("Fecha actualizada:", nuevaFecha);
          }}
        />
      );
    },
  },
  // {
  //   accessorKey: "checklist",
  //   header: "Checklist",
  //   cell: ({ row }) => (
  //     <a
  //       href={row.original.checklist}
  //       target="_blank"
  //       rel="noopener noreferrer"
  //     >
  //       <Button variant="outline">
  //         <BookCheck />
  //       </Button>
  //     </a>
  //   ),
  // },
  // {
  //   accessorKey: "muestraPerfil",
  //   header: "Job Description",
  //   cell: ({ row }) => (
  //     <a
  //       href={row.original.muestraPerfil}
  //       target="_blank"
  //       rel="noopener noreferrer"
  //     >
  //       <Button variant="outline">
  //         <UserPen />
  //       </Button>
  //     </a>
  //   ),
  // },
  {
    accessorKey: "ternaFinal",
    header: "Terna Final",
    cell: ({ row }) => <FinalTernaSheet ternaFinal={row.original.ternaFinal} />,
  },
  {
    accessorKey: "duracionTotal",

    header: ({ column }) => (
      <SortableHeader column={column} title="Duración Total" />
    ),
    cell: ({ row }) => {
      const total = row.original.duracionTotal;
      return <span>{total} días</span>;
    },
  },
  {
    id: "oficina",
    accessorKey: "oficina",
    header: ({ column }) => <SortableHeader column={column} title="Oficina" />,
    cell: ({ row }) => {
      return <span>{row.original.reclutador?.Oficina || "Sin oficina"}</span>;
    },
    accessorFn: (row) => row.reclutador?.Oficina,
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      return <ActionsRecruitment row={row} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
];
