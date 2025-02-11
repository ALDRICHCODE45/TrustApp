"use client";
import { Badge } from "@/components/ui/badge";
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
import { Lead, LeadStatus } from "@/lib/data";
import { ColumnDef } from "@tanstack/react-table";
import {
  Building,
  Calendar,
  User,
  Contact,
  BriefcaseBusiness,
  MoreHorizontal,
  Clipboard,
  UserRound,
  UserSearch,
  CalendarCheck,
  CalendarClock,
  SquarePen,
  Trash2,
  Globe,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const handleCopyTeacherId = (leadId: string, leadName: string) => {
  navigator.clipboard.writeText(leadId);
  toast("Lead Id has been copied", {
    description: `Lead of name ${leadName} has been copied`,
  });
};

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
          <Building size={15} className="text-black dark:text-white" />
          <span className="text-black dark:text-white">{empresa}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "sector",
    header: "Sector",
  },
  {
    accessorKey: "generadorLeads",
    header: "Generador",
    cell: ({ row }) => {
      const user = row.getValue("generadorLeads") as string;
      return (
        <div className="flex gap-2 items-center">
          <User size={17} />
          <span>{user}</span>
        </div>
      );
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
    accessorKey: "contacto",
    header: "Contacto",
    cell: ({ row }) => {
      const contact = row.getValue("contacto") as string;
      return (
        <div className="flex flex-row gap-2 items-center">
          <Contact size={17} />
          <span>{contact}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "posicion",
    header: "Posicion",
    cell: ({ row }) => {
      const posicion = row.getValue("posicion") as string;
      return (
        <div className="flex flex-row gap-2 items-center">
          <BriefcaseBusiness size={17} />
          <span>{posicion}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "fechaAConectar",
    header: "Fecha de Coneccion",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as LeadStatus;
      const [newStatus, setStatus] = useState(status);

      const handleStatusChange = (newStatus: LeadStatus) => {
        setStatus(newStatus);
        // Aquí se puede realizar cualquier acción adicional, como hacer una llamada a la API para actualizar el estado
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Badge
              variant="outline"
              className="text-xs px-2 py-1 rounded-md border border-neutral-500 bg-transparent text-neutral-800 dark:text-neutral-200 dark:border-neutral-400 "
            >
              <span>{newStatus}</span>
            </Badge>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => handleStatusChange(LeadStatus.Contacto)}
              className="flex items-center space-x-2"
            >
              <Contact className="h-5 w-5 " />
              <span>Contacto</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(LeadStatus.SocialSelling)}
              className="flex items-center space-x-2"
            >
              <UserRound className="h-5 w-5 " />
              <span>Social Selling</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(LeadStatus.ContactoCalido)}
              className="flex items-center space-x-2"
            >
              <UserSearch className="h-5 w-5 " />
              <span>Contacto Calido</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(LeadStatus.Prospecto)}
              className="flex items-center space-x-2"
            >
              <CalendarCheck className="h-5 w-5 " />
              <span>Prospecto</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(LeadStatus.CitaAgendada)}
              className="flex items-center space-x-2"
            >
              <CalendarClock className="h-5 w-5" />
              <span>Cita Agendada</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(LeadStatus.CitaValidada)}
              className="flex items-center space-x-2"
            >
              <Calendar className="h-5 w-5" />
              <span>Cita Validada</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const teacherId = row.original.generadorLeads;
      const teacherName = row.original.generadorLeads;
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
              onClick={() => handleCopyTeacherId(teacherId, teacherName)}
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
