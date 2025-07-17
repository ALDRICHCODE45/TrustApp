"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import {
  BookCheck,
  BriefcaseBusiness,
  ChevronDown,
  ChevronUp,
  Info,
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
import { Prisma } from "@prisma/client";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { es, id } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="w-full">
              {row.original.fechaAsignacion
                ? format(row.original.fechaAsignacion, "EEE d/M/yy", {
                    locale: es,
                  })
                : "N/A"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Fecha Asignacion</p>
          </TooltipContent>
        </Tooltip>
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
    id: "fechaEntrega",
    accessorKey: "fechaEntrega",
    header: ({ column }) => (
      <SortableHeader column={column} title="Fecha Entrega" />
    ),
    cell: ({ row }) => {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="w-full">
              {row.original.fechaEntrega
                ? format(row.original.fechaEntrega, "EEE d/M/yy", {
                    locale: es,
                  })
                : "N/A"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Fecha Entrega</p>
          </TooltipContent>
        </Tooltip>
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
    accessorFn: (row) => row.reclutador.id,
  },
  {
    id: "tipo",
    accessorKey: "tipo",
    header: ({ column }) => <SortableHeader column={column} title="Tipo" />,
    cell: ({ row }) => {
      //return <TypeDropdown row={row} />;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {/* <Button variant="outline" className="w-full">
              {row.original.tipo}
            </Button> */}
            <Badge variant="outline" className="gap-1.5">
              {row.original.tipo === "Nueva" ? (
                <span
                  className="size-1.5 rounded-full bg-emerald-500"
                  aria-hidden="true"
                ></span>
              ) : row.original.tipo === "Recompra" ? (
                <span
                  className="size-1.5 rounded-full bg-blue-500"
                  aria-hidden="true"
                ></span>
              ) : (
                <span
                  className="size-1.5 rounded-full bg-red-500"
                  aria-hidden="true"
                ></span>
              )}
              {row.original.tipo}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tipo de vacante</p>
          </TooltipContent>
        </Tooltip>
      );
    },
    accessorFn: (row) => row.tipo,
  },
  {
    id: "cliente",
    accessorKey: "cliente",
    header: ({ column }) => <SortableHeader column={column} title="Cliente" />,
    cell: ({ row }) => {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="w-full">
              {row.original.cliente.cuenta}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Cliente</p>
          </TooltipContent>
        </Tooltip>
      );
    },
    accessorFn: (row) => row.cliente.cuenta,
  },
  {
    id: "estado",
    accessorKey: "estado",
    header: ({ column }) => <SortableHeader column={column} title="Estado" />,

    cell: ({ row }) => {
      //return <StatusDropdown row={row} />;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="w-full">
              {row.original.estado}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Estado de la vacante</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "posicion",
    header: ({ column }) => <SortableHeader column={column} title="Posicion" />,
    cell: ({ row }) => {
      //return <PosicionPopOver row={row} />;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="flex items-center gap-2" variant="outline">
              <BriefcaseBusiness size={15} />
              <div className="max-w-[100px] truncate">
                {row.original.posicion}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="h-6 w-6 p-0">
                    <Info size={16} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-52">
                  <div className="grid gap-1">
                    <p className="text-sm">{row.original.posicion}</p>
                  </div>
                </PopoverContent>
              </Popover>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Posicion de la vacante</p>
          </TooltipContent>
        </Tooltip>
      );
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
          fecha={row.original.fechaUltimaTerna}
          onFechaChange={(nuevaFecha) => {
            // Aquí implementarías la lógica para actualizar la fecha en tu fuente de datos
            console.log("Fecha actualizada:", nuevaFecha);
          }}
        />
      );
    },
  },
  {
    id: "tiempoTranscurrido",
    header: ({ column }) => (
      <SortableHeader column={column} title="Tiempo trranscurrido" />
    ),
    cell: ({ row }) => {
      const tiempo = row.original.tiempoTranscurrido;
      return (
        <div className="flex items-center justify-center">
          <Button variant="outline" className="w-full">
            <p>
              {tiempo ? (
                <span>{tiempo} dias</span>
              ) : (
                <span className="text-red-500">N/A</span>
              )}
            </p>
          </Button>
        </div>
      );
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
          fecha={row.original.fechaOferta}
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
    header: "Contratado",
    cell: ({ row }) => (
      <Button variant="outline" className="w-full">
        {row.original.candidatoContratado ? (
          <p>{row.original.candidatoContratado.name}</p>
        ) : (
          <p className="text-red-500">N.A</p>
        )}
      </Button>
    ),
  },
  {
    accessorKey: "salario",
    header: ({ column }) => <SortableHeader column={column} title="Salario" />,
    cell: ({ row }) => {
      const salario = row.original.salario;
      return (
        <div className="flex items-center justify-center">
          <Button variant="outline" className="w-full">
            <p>
              {salario ? (
                <span>${salario}</span>
              ) : (
                <span className="text-red-500">N/A</span>
              )}
            </p>
          </Button>
        </div>
      );
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
          fecha={row.original.fechaComision}
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
      const fechaAsignacion = row.original.fechaAsignacion;
      const estado = row.original.estado;
      const fechaOferta = row.original.fechaOferta;

      if (!fechaAsignacion) {
        return (
          <div className="flex items-center justify-center">
            <Button variant="outline" className="w-full">
              <p>
                <span className="text-red-500">N/A</span>
              </p>
            </Button>
          </div>
        );
      }

      // Calcular la fecha final según el estado
      let fechaFinal: Date;
      if (estado === "Placement" && fechaOferta) {
        fechaFinal = fechaOferta;
      } else {
        fechaFinal = new Date();
      }

      // Calcular la diferencia en días
      const tiempoTranscurrido = Math.floor(
        (fechaFinal.getTime() - fechaAsignacion.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      return (
        <div className="flex items-center justify-center">
          <Button variant="outline" className="w-full">
            <p>
              <span>{tiempoTranscurrido} días</span>
            </p>
          </Button>
        </div>
      );
    },
  },
  {
    id: "oficina",
    accessorKey: "oficina",
    header: ({ column }) => <SortableHeader column={column} title="Oficina" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          <Button variant="outline" className="w-full">
            <p>
              {oficinaMap[row.original.reclutador?.Oficina] || "Sin oficina"}
            </p>
          </Button>
        </div>
      );
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

const oficinaMap = {
  Oficina1: "Oficina 1",
  Oficina2: "Oficina 2",
};
