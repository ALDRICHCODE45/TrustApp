"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Candidato, Vacante } from "@/lib/data";
import { ColumnDef } from "@tanstack/react-table";
import {
  Ban,
  BookCheck,
  Clipboard,
  FileText,
  Lightbulb,
  Mail,
  MessageCircleOff,
  MoreHorizontal,
  RefreshCcw,
  Search,
  SquarePen,
  SquarePlus,
  Trash2,
  User,
  UserPen,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const handleCopyRecruiterName = (leadId: string, leadName: string) => {
  navigator.clipboard.writeText(leadId);
  toast("Lead Id has been copied", {
    description: `Lead of name ${leadName} has been copied`,
  });
};

const CommentSheet = ({ comments }: { comments: string[] }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Comentarios
        </Button>
      </SheetTrigger>
      <SheetContent className="p-4">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-lg">Comentarios</SheetTitle>
        </SheetHeader>
        <div className="space-y-2">
          {comments.map((comentario, index) => (
            <Card key={index} className="shadow-sm">
              <CardHeader className="p-3">
                <h3 className="font-semibold text-sm">
                  Comentario {index + 1}
                </h3>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {comentario}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

const FinalTernaSheet = ({ ternaFinal }: { ternaFinal: Candidato[] }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Terna Final
        </Button>
      </SheetTrigger>
      <SheetContent className="p-4">
        <SheetHeader className="mb-10"></SheetHeader>
        <div className="space-y-3">
          {ternaFinal.map((candidato, index) => (
            <Card
              key={index}
              className="shadow-sm rounded-lg p-4 bg-white dark:bg-gray-800"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={candidato.foto} alt={candidato.nombre} />
                    <AvatarFallback>{candidato.nombre[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    {candidato.nombre}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {candidato.telefono}
                </p>
              </div>

              <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400 ml-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <p>{candidato.correo}</p>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <a
                    href={candidato.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Ver CV
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
const PriorityDropdown = ({
  priority,
  onPriorityChange,
}: {
  priority: string;
  onPriorityChange: (newPriority: string) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {priority}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onPriorityChange("Alta")}>
          Alta
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onPriorityChange("Media")}>
          Media
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onPriorityChange("Baja")}>
          Baja
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const StatusDropdown = ({
  status,
  onStatusChange,
}: {
  status: string;
  onStatusChange: (newStatus: string) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {status}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onStatusChange("Hunting")}>
          <Users />
          Hunting
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange("Cancelada")}>
          <Ban />
          Cancelada
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange("Entrevistas")}>
          <Search />
          Entrevistas
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange("Perdida")}>
          <MessageCircleOff />
          Perdida
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange("Placement")}>
          <Lightbulb />
          Placement
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const RecruiterDropDown = ({
  reclutador,
  onReclutadorChange,
}: {
  reclutador: string;
  onReclutadorChange: (newReclutador: string) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {reclutador}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onReclutadorChange("Cesar Romero")}>
          <User />
          Cesar Romero
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onReclutadorChange("Aylin Perez")}>
          <User />
          Aylin Perez
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onReclutadorChange("Rodrigo Herrera")}>
          <User />
          Rodrigo Herrera
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onReclutadorChange("Manuel Morales")}>
          <User />
          Manuel Morales
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onReclutadorChange("Melissa Flores")}>
          <User />
          Melissa Flores
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const TypeDropdown = ({
  tipo,
  onTipoChange,
}: {
  tipo: string;
  onTipoChange: (newReclutador: string) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {tipo}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onTipoChange("Nueva")}>
          <SquarePlus />
          Nueva
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onTipoChange("Recompra")}>
          <RefreshCcw />
          Recompra
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
    accessorKey: "monto",
    header: "Monto",
  },
  {
    accessorKey: "valorFactura",
    header: "Valor Factura",
  },
  {
    accessorKey: "porcentajeComision",
    header: "Comisión",
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
