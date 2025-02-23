"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  UserRound,
  UserSearch,
  CalendarCheck,
  CalendarClock,
  Globe,
  Award,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ActionsCell } from "./components/ActionsCell";
import { GeneratorDropDown } from "./components/SelectGLDropDown";

const handleCopy = (leadId: string, leadName: string) => {
  navigator.clipboard.writeText(leadId);
  toast("Realizado", {
    description: `Usuario con nombre ${leadName} ha sido copiado`,
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
      const [generador, setNewGenerador] = useState(
        row.original.generadorLeads.name
      );

      const handleGeneratorChange = (newGenerador: string) => {
        setNewGenerador(newGenerador);
      };
      return (
        <GeneratorDropDown
          generador={generador}
          onGeneratorChange={handleGeneratorChange}
        />
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
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {newStatus}
            </Button>
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
            <DropdownMenuItem
              onClick={() => handleStatusChange(LeadStatus.Cliente)}
              className="flex items-center space-x-2"
            >
              <Award size={17} />
              <span>Cliente</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ActionsCell row={row} />;
    },
  },
];
