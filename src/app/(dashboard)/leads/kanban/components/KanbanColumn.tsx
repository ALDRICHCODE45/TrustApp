"use client";
import { useDroppable } from "@dnd-kit/core";
import { DraggableLeadCard } from "./DraggableLeadCard";
import {
  TagIcon,
  UsersIcon,
  PhoneIcon,
  BuildingIcon,
  CalendarIcon,
  CheckCircleIcon,
  HandshakeIcon,
  BriefcaseIcon,
  CircleX
} from "lucide-react";
import { User, Lead, LeadStatus } from "@prisma/client";
import { LeadWithRelations } from "../page";
import { leadStatusMap } from "@/app/(dashboard)/list/leads/components/LeadChangeStatus";

type KanbanColumnProps = {
  status: LeadStatus;
  leads: LeadWithRelations[];
  setSelectedTask: (task: Lead | null) => void;
  showCreateLeadForm: boolean;
  generadores?: User[];
};

const getColumnIcon = (status: string) => {
  const icons = {
    [LeadStatus.Contacto]: <TagIcon className="h-5 w-5 " />,
    [LeadStatus.SocialSelling]: (
      <UsersIcon className="h-5 w-5 " />
    ),
    [LeadStatus.ContactoCalido]: (
      <PhoneIcon className="h-5 w-5 " />
    ),
    [LeadStatus.Prospecto]: <BuildingIcon className="h-5 w-5 " />,
    [LeadStatus.CitaAgendada]: (
      <CalendarIcon className="h-5 w-5 " />
    ),
    [LeadStatus.CitaValidada]: (
      <CheckCircleIcon className="h-5 w-5 " />
    ),
    [LeadStatus.Cliente]: <HandshakeIcon className="h-5 w-5 " />,
    [LeadStatus.Eliminado]: <CircleX className="size-5 " />
  };
  return (
    icons[status as LeadStatus] || (
      <BriefcaseIcon className="h-5 w-5 text-gray-500" />
    )
  );
};



export const DroppableKanbanColumn = ({
  status,
  leads,
  setSelectedTask,
  generadores = [],
}: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  
  const leadTitle = leadStatusMap[status];
  const leadsColumnIcon = getColumnIcon(status)


  return (
     <div
      ref={setNodeRef}
      className={`w-[320px] flex-shrink-0 border rounded-md h-full flex flex-col ${
        isOver ? "border-slate-200" : "border-slate-200 dar:border-slate-100"
      }`}
    >
      <div className="p-3 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-sm  flex gap-3">
          {leadsColumnIcon} {leadTitle}
          </span>
          <span className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-full">
            {leads.length}
          </span>
        </div>
      </div>
      <div className="p-3 flex-1 overflow-y-auto">
        <div className="space-y-2">
          {leads.map((lead) => (
            <DraggableLeadCard
              key={lead.id}
              lead={lead}
              setSelectedTask={setSelectedTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
};


