import { useDraggable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CalendarIcon, TagIcon, User2Icon } from "lucide-react";
import { LeadEditForm } from "./LeadEditForm";
import { Lead, LeadStatus } from "@prisma/client";
import { LeadWithRelations } from "../page";
import { leadStatusMap } from "@/app/(dashboard)/list/leads/components/LeadChangeStatus";

type LeadCardProps = {
  lead: LeadWithRelations;
  setSelectedTask: (task: Lead | null) => void;
};

const getBadgeColor = (status: string): string => {
  const colors = {
    [LeadStatus.Contacto]: "bg-blue-100 text-blue-800",
    [LeadStatus.SocialSelling]: "bg-purple-100 text-purple-800",
    [LeadStatus.ContactoCalido]: "bg-orange-100 text-orange-800",
    [LeadStatus.Prospecto]: "bg-amber-100 text-amber-800",
    [LeadStatus.CitaAgendada]: "bg-indigo-100 text-indigo-800",
    [LeadStatus.CitaValidada]: "bg-teal-100 text-teal-800",
    [LeadStatus.Cliente]: "bg-green-100 text-green-800",
  };
  return colors[status as LeadStatus] || "bg-gray-100 text-gray-800";
};

export const DraggableLeadCard = ({ lead, setSelectedTask }: LeadCardProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: lead.id,
    data: { lead },
  });

  const formatDate = (date?: Date) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat("es", {
      day: "2-digit",
      month: "short",
    }).format(date);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          className={`p-4 cursor-move bg-white hover:shadow-md transition-all border border-slate-200
          ${isDragging ? "opacity-50" : "hover:border-slate-300"} rounded-lg`}
          onClick={() => setSelectedTask(lead)}
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-sm text-black">
                  {lead.empresa}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center">
                  <TagIcon className="h-3 w-3 mr-1" />
                  {lead.sector}
                </p>
              </div>
              <Badge
                className={`text-[10px] font-medium ${getBadgeColor(lead.status)}`}
              >
                {leadStatusMap[lead.status]}
              </Badge>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <div className="flex items-center space-x-1">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[10px] bg-slate-200 text-slate-700">
                    {lead.generadorLeads?.name
                      ? lead.generadorLeads.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[10px] text-slate-500">
                  {lead.generadorLeads?.name?.split(" ")[0] || "Usuario"}
                </span>
              </div>
              <div className="flex items-center text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded">
                <CalendarIcon className="h-3 w-3 mr-1" />
                {lead.fechaAConectar ? formatDate(lead.fechaAConectar) : null}
              </div>
            </div>
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Lead</DialogTitle>
          <DialogDescription>
            Actualiza la información del lead según sea necesario.
          </DialogDescription>
        </DialogHeader>
        <LeadEditForm task={lead} />
      </DialogContent>
    </Dialog>
  );
};
