import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LeadStatus } from "@prisma/client";
import { Row } from "@tanstack/react-table";
import {
  Award,
  CalendarCheck,
  CalendarClock,
  CircleX,
  Contact,
  UserCheck,
  UserRound,
  UserSearch,
} from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { editLeadById } from "@/actions/leads/actions";
import { toast } from "sonner";
import { LeadWithRelations } from "@/app/(dashboard)/leads/kanban/page";

const allowLeadStatus = [
  {
    title: "¿Estás seguro?",
    description: "¿Quieres cambiar el status a Contacto?",
    onConfirmValule: LeadStatus.Contacto,
    status: "Contacto",
    icon: Contact,
  },
  {
    title: "¿Estás seguro?",
    description: "¿Quieres cambiar el status a Cita agendada?",
    onConfirmValule: LeadStatus.CitaAgendada,
    status: "Cita Agendata",
    icon: CalendarClock,
  },
  {
    title: "¿Estás seguro?",
    description: "¿Quieres cambiar el status a Cita Validada?",
    onConfirmValule: LeadStatus.CitaValidada,
    oficeNumber: "Cita Validada",
    status: "Cita Validada",
    icon: CalendarCheck,
  },

  {
    title: "¿Estás seguro?",
    description: "¿Quieres cambiar el status a Contacto Calido?",
    onConfirmValule: LeadStatus.ContactoCalido,
    oficeNumber: "Contacto Calido",

    status: "Contacto Calido",
    icon: UserSearch,
  },
  {
    title: "¿Estás seguro?",
    description: "¿Quieres cambiar el status a Prospecto?",
    onConfirmValule: LeadStatus.Prospecto,
    oficeNumber: "Prospecto",
    status: "Prospecto",
    icon: CalendarCheck,
  },
  {
    title: "¿Estás seguro?",
    description: "¿Quieres cambiar el status a Social Selling?",
    onConfirmValule: LeadStatus.SocialSelling,
    oficeNumber: "Social Selling",
    status: "Social Selling",
    icon: UserRound,
  },

  {
    title: "¿Estás seguro?",
    description: "¿Quieres cambiar el status a Cita Atendida?",
    onConfirmValule: LeadStatus.CitaAtendida,
    oficeNumber: "Cita Atendida",
    status: "Cita Atendida",
    icon: UserCheck,
  },
  {
    title: "¿Estás seguro?",
    description: "¿Quieres cambiar el status a Cliente?",
    onConfirmValule: LeadStatus.Asignadas,
    oficeNumber: "Cliente",
    status: "Cliente",
    icon: Award,
  },
  {
    title: "¿Estás seguro?",
    description: "¿Quieres cambiar el status a StandBy este Lead?",
    onConfirmValule: LeadStatus.StandBy,
    oficeNumber: "StandBy",
    status: "StandBy",
    icon: CircleX,
  },
];

export const leadStatusMap: Record<LeadStatus, string> = {
  ContactoCalido: "Contacto Calido",
  SocialSelling: "Social Selling",
  CitaValidada: "Cita Validada",
  CitaAgendada: "Cita Agendada",
  Asignadas: "Asignadas",
  Contacto: "Contacto",
  Prospecto: "Prospecto",
  StandBy: "StandBy",
  CitaAtendida: "Cita Atendida",
};

export const LeadChangeStatus = ({ row }: { row: Row<LeadWithRelations> }) => {
  const status = row.original.status;
  const valueToDisplay = leadStatusMap[status];

  const handleStatusChange = async (newStatus: LeadStatus) => {
    const leadId: string = row.original.id;
    const formData: FormData = new FormData();
    formData.append("status", newStatus);
    console.log({ formData });

    try {
      await editLeadById(leadId, formData);
      toast.info("Status del lead modificado con exito");
    } catch (error) {
      toast.error("Error al cambiar de status");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {valueToDisplay}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {allowLeadStatus.map((status) => (
          <ConfirmDialog
            key={status.status}
            title={status.title}
            description={status.description}
            onConfirm={() => handleStatusChange(status.onConfirmValule)}
            trigger={
              <div className="cursor-pointer">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={(e) => {
                    // Prevenir que el DropdownMenu se cierre automáticamente
                    e.preventDefault();
                  }}
                >
                  <status.icon className="mr-2 size-4" />
                  {status.status}
                </DropdownMenuItem>
              </div>
            }
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
