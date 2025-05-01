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

const getColumnIcon = (status: string) => {
  const icons = {
    [LeadStatus.Contacto]: (
      <TagIcon className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
    ),
    [LeadStatus.SocialSelling]: (
      <UsersIcon className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
    ),
    [LeadStatus.ContactoCalido]: (
      <PhoneIcon className="h-5 w-5 text-amber-500 dark:text-amber-400" />
    ),
    [LeadStatus.Prospecto]: (
      <BuildingIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
    ),
    [LeadStatus.CitaAgendada]: (
      <CalendarIcon className="h-5 w-5 text-purple-500 dark:text-purple-400" />
    ),
    [LeadStatus.CitaValidada]: (
      <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
    ),
    [LeadStatus.Cliente]: (
      <HandshakeIcon className="h-5 w-5 text-rose-500 dark:text-rose-400" />
    ),
    [LeadStatus.Eliminado]: (
      <CircleX className="h-5 w-5 text-red-500 dark:text-red-400" />
    ),
  };
  return (
    icons[status as LeadStatus] || (
      <BriefcaseIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
    )
  );
};

// Count badge color based on status
const getBadgeColor = (status: string) => {
  const colorMap = {
    [LeadStatus.Contacto]:
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300",
    [LeadStatus.SocialSelling]:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300",
    [LeadStatus.ContactoCalido]:
      "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300",
    [LeadStatus.Prospecto]:
      "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
    [LeadStatus.CitaAgendada]:
      "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
    [LeadStatus.CitaValidada]:
      "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
    [LeadStatus.Cliente]:
      "bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-300",
    [LeadStatus.Eliminado]:
      "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300",
  };
  return (
    colorMap[status as LeadStatus] ||
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
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
      className={`w-[320px] flex-shrink-0 bg-[#f1f5f9] dark:bg-gray-800 rounded-3xl p-3 h-full flex flex-col ${
        isOver
          ? "border-2 border-dashed border-blue-400 dark:border-blue-500"
          : "border border-slate-200 dark:border-gray-700"
      }`}
    >
      <div
        className={`p-3 bg-white dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md`}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center gap-2 text-gray-800 ">
            {leadsColumnIcon} {leadTitle}
          </span>
          <span
            className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${getBadgeColor(status)}`}
          >
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
