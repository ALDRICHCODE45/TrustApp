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
import { Vacante } from "@/lib/data";
import { ColumnDef } from "@tanstack/react-table";
import {
  BookCheck,
  Clipboard,
  MoreHorizontal,
  SquarePen,
  Trash2,
  UserPen,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CommentSheet } from "./components/CommentSheet";
import { FinalTernaSheet } from "./components/FinalTernaSheet";
import { PriorityDropdown } from "./components/PriorityDropdown";
import { StatusDropdown } from "./components/StatusDropdown";
import { RecruiterDropDown } from "./components/RecruiterDropdown";
import { TypeDropdown } from "./components/TypeDropDown";

const handleCopyRecruiterName = (leadId: string, leadName: string) => {
  navigator.clipboard.writeText(leadId);
  toast("Lead Id has been copied", {
    description: `Lead of name ${leadName} has been copied`,
  });
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
    accessorKey: "año",
    header: "Año",
  },
  {
    accessorKey: "reclutador",
    header: "Reclutador",
    cell: ({ row }) => {
      const [reclutador, setNewReclutador] = useState(row.original.reclutador);
      const handleReclutadorChange = (newReclutador: string) => {
        setNewReclutador(newReclutador);
      };
      return (
        <RecruiterDropDown
          reclutador={reclutador}
          onReclutadorChange={handleReclutadorChange}
        />
      );
    },
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => {
      const [tipo, setTipo] = useState(row.original.tipo);
      const handleTipoChange = (newTipo: string) => {
        setTipo(newTipo as "Nueva");
      };
      return <TypeDropdown onTipoChange={handleTipoChange} tipo={tipo} />;
    },
  },
  {
    accessorKey: "estado",
    header: "Estatus",
    cell: ({ row }) => {
      const [status, setStatus] = useState(row.original.estado);

      const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus as "Hunting");
        // Aquí puedes agregar lógica para actualizar el estatus en tu backend o estado global
        console.log(`Estatus cambiado a: ${newStatus}`);
      };

      return (
        <StatusDropdown status={status} onStatusChange={handleStatusChange} />
      );
    },
  },
  {
    accessorKey: "puesto",
    header: "Puesto",
  },
  {
    accessorKey: "comentarios",
    header: "Comentarios",
    cell: ({ row }) => <CommentSheet comments={row.original.comentarios} />,
  },
  {
    accessorKey: "tiempoTranscurrido",
    header: "Tiempo",
    cell: ({ row }) => {
      const tiempo = row.original.tiempoTranscurrido;
      return <span>{tiempo} días</span>;
    },
  },
  {
    accessorKey: "prioridad",
    header: "Prioridad",
    cell: ({ row }) => {
      const [priority, setPriority] = useState(row.original.prioridad);

      const handlePriorityChange = (newPriority: string) => {
        setPriority(newPriority as "Alta");
        // Aquí puedes agregar lógica para actualizar la prioridad en tu backend o estado global
        console.log(`Prioridad cambiada a: ${newPriority}`);
      };

      return (
        <PriorityDropdown
          priority={priority}
          onPriorityChange={handlePriorityChange}
        />
      );
    },
  },
  {
    accessorKey: "mesAsignado",
    header: "Mes Asignado",
  },
  {
    accessorKey: "fechaEntrega",
    header: "Fecha de Entrega",
  },
  {
    accessorKey: "fechaUltimaTerna",
    header: "Fecha Terna",
  },
  {
    accessorKey: "duracionTotal",
    header: "Duración Total",
    cell: ({ row }) => {
      const total = row.original.duracionTotal;
      return <span>{total} días</span>;
    },
  },
  {
    accessorKey: "fechaOferta",
    header: "Fecha de Oferta",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.fechaOferta ? (
            <p>{row.original.fechaOferta}</p>
          ) : (
            <p className="text-red-500">N.A</p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "candidatoContratado",
    header: "Candidato Contratado",
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
    header: "Salario",
    cell: ({ row }) => {
      const salario = row.original.salario;
      return <span>${salario}</span>;
    },
  },
  {
    accessorKey: "fechaComision",
    header: "Fecha de Comisión",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.fechaComision ? (
            <p>{row.original.fechaComision}</p>
          ) : (
            <p className="text-red-500">N.A</p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "valorFactura",
    header: "Valor Factura",
  },
  {
    accessorKey: "fee",
    header: "Fee",
    cell: ({ row }) => {
      const fee = row.original.fee;
      return <span>{fee}%</span>;
    },
  },
  {
    accessorKey: "monto",
    header: "Monto",
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
    header: "Perfil Muestra",
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
    id: "actions",
    cell: ({ row }) => {
      const teacherId = row.original.reclutador;
      const teacherName = row.original.estado;
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
              onClick={() => handleCopyRecruiterName(teacherId, teacherName)}
            >
              <Clipboard />
              Copiar Id
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SquarePen />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash2 />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
