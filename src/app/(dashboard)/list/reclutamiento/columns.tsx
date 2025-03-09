"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Vacante } from "@/lib/data";
import { ColumnDef } from "@tanstack/react-table";
import {
  BookCheck,
  ChevronDown,
  ChevronUp,
  SortAsc,
  UserPen,
} from "lucide-react";
import { CommentSheet } from "./components/CommentSheet";
import { FinalTernaSheet } from "./components/FinalTernaSheet";
import { StatusDropdown } from "./components/StatusDropdown";
import { RecruiterDropDown } from "./components/RecruiterDropdown";
import { TypeDropdown } from "./components/TypeDropDown";
import { ActionsRecruitment } from "./components/ActionsRecruitment";
import { PosicionPopOver } from "./components/PosicionPopOver";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Componente para headers ordenables
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
export const vacantesColumns: ColumnDef<Vacante>[] = [
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
    id: "mesAño",
    header: ({ column }) => (
      <SortableHeader column={column} title="Asignación" />
    ),
    accessorKey: "fechaAsignacion", // Usa la fecha completa como fuente
    cell: ({ row }) => {
      const fecha = row.original.fechaAsignacion as Date;
      return (
        <>
          <Button variant="outline">
            <span>{format(fecha, "EEE dd/MM/yy", { locale: es })} </span>
          </Button>
        </>
      );
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
  },
  {
    id: "tipo",
    accessorKey: "tipo",
    header: ({ column }) => <SortableHeader column={column} title="Tipo" />,
    cell: ({ row }) => {
      return <TypeDropdown row={row} />;
    },
  },
  {
    id: "cliente",
    accessorKey: "cliente",
    header: ({ column }) => <SortableHeader column={column} title="Cliente" />,
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
    cell: ({ row }) => <CommentSheet comments={row.original.comentarios} />,
  },
  {
    accessorKey: "fechaUltimaTerna",
    header: ({ column }) => (
      <SortableHeader column={column} title="Fecha Terna" />
    ),
    cell: ({ row }) => {
      const fecha = row.original.fechaUltimaTerna;
      return (
        <>
          {fecha ? (
            <Button variant="outline">
              <span>{format(fecha, "EEE dd/MM/yy", { locale: es })}</span>
            </Button>
          ) : (
            <Button variant="outline">
              <span className="text-red-500">N.A</span>
            </Button>
          )}
        </>
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
      const fecha = row.original.fechaOferta;
      return (
        <div>
          {fecha ? (
            <Button variant="outline">
              <span>{format(fecha, "EEE dd/MM/yy", { locale: es })}</span>
            </Button>
          ) : (
            <Button variant="outline">
              <p className="text-red-500">N.A</p>
            </Button>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "candidatoContratado",
    header: "Finalista",
    cell: ({ row }) => (
      <div>
        {row.original.candidatoContratado ? (
          <p>{row.original.candidatoContratado.nombre}</p>
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
      const fecha = row.original.fechaComision;
      return (
        <div>
          {fecha ? (
            <Button variant="outline">
              <span> {format(fecha, "EEE dd/MM/yy", { locale: es })} </span>
            </Button>
          ) : (
            <Button variant="outline">
              <span className="text-red-500">N.A</span>
            </Button>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "valorFactura",
    header: ({ column }) => (
      <SortableHeader column={column} title="Valor factura" />
    ),
  },
  {
    accessorKey: "fee",
    header: ({ column }) => <SortableHeader column={column} title="Fee" />,
    cell: ({ row }) => {
      const fee = row.original.fee;
      return <span>{fee}%</span>;
    },
  },
  {
    accessorKey: "monto",
    header: ({ column }) => <SortableHeader column={column} title="Monto" />,
  },
  {
    accessorKey: "checklist",
    header: "Checklist",
    cell: ({ row }) => (
      <a
        href={row.original.checklist}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="outline">
          <BookCheck />
        </Button>
      </a>
    ),
  },
  {
    accessorKey: "muestraPerfil",
    header: "Job Description",
    cell: ({ row }) => (
      <a
        href={row.original.muestraPerfil}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="outline">
          <UserPen />
        </Button>
      </a>
    ),
  },
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
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      return <ActionsRecruitment row={row} />;
    },
  },
];
