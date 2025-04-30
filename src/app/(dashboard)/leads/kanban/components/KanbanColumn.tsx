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
  CircleX,
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

const getHeaderStatus = (status: LeadStatus) => {
  const headerStatus = {
    [LeadStatus.Contacto]: "bg-gray-200 text-black",
    [LeadStatus.Prospecto]: "bg-blue-100 text-blue-800",
    [LeadStatus.ContactoCalido]: "bg-yellow-100 text-yellow-800",
    [LeadStatus.SocialSelling]: "bg-green-100 text-green-800",
    [LeadStatus.CitaValidada]: "bg-purple-100 text-purple-800",
    [LeadStatus.CitaAgendada]: "bg-indigo-100 text-indigo-800",
    [LeadStatus.Cliente]: "bg-emerald-100 text-emerald-800",
    [LeadStatus.Eliminado]: "bg-red-100 text-red-800",
  };
  return headerStatus[status];
};

const getColumnIcon = (status: string) => {
  const icons = {
    [LeadStatus.Contacto]: <TagIcon className="h-5 w-5 " />,
    [LeadStatus.SocialSelling]: <UsersIcon className="h-5 w-5 " />,
    [LeadStatus.ContactoCalido]: <PhoneIcon className="h-5 w-5 " />,
    [LeadStatus.Prospecto]: <BuildingIcon className="h-5 w-5 " />,
    [LeadStatus.CitaAgendada]: <CalendarIcon className="h-5 w-5 " />,
    [LeadStatus.CitaValidada]: <CheckCircleIcon className="h-5 w-5 " />,
    [LeadStatus.Cliente]: <HandshakeIcon className="h-5 w-5 " />,
    [LeadStatus.Eliminado]: <CircleX className="size-5 " />,
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
  const leadsColumnIcon = getColumnIcon(status);

  return (
    <div
      ref={setNodeRef}
      className={`w-[320px] flex-shrink-0 bg-[#f1f5f9] rounded-2xl p-3 h-full flex flex-col ${
        isOver
          ? " border border-dashed border-gray-400"
          : "border-slate-200 dar:border-slate-100"
      }`}
    >
      <div
        className={`p-3 border ${getHeaderStatus(status)} border-slate-200 rounded-full bg-blue-50`}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm  flex gap-3 text-black">
            {leadsColumnIcon} {leadTitle}
          </span>
          <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
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
