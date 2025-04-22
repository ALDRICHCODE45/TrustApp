"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { User, Lead, LeadStatus } from "@prisma/client";
import { CreateLeadForm } from "@/app/(dashboard)/list/leads/components/CreateLeadForm";
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
    [LeadStatus.Contacto]: <TagIcon className="h-5 w-5 text-blue-500" />,
    [LeadStatus.SocialSelling]: (
      <UsersIcon className="h-5 w-5 text-purple-500" />
    ),
    [LeadStatus.ContactoCalido]: (
      <PhoneIcon className="h-5 w-5 text-orange-500" />
    ),
    [LeadStatus.Prospecto]: <BuildingIcon className="h-5 w-5 text-amber-500" />,
    [LeadStatus.CitaAgendada]: (
      <CalendarIcon className="h-5 w-5 text-indigo-500" />
    ),
    [LeadStatus.CitaValidada]: (
      <CheckCircleIcon className="h-5 w-5 text-teal-500" />
    ),
    [LeadStatus.Cliente]: <HandshakeIcon className="h-5 w-5 text-green-500" />,
  };
  return (
    icons[status as LeadStatus] || (
      <BriefcaseIcon className="h-5 w-5 text-gray-500" />
    )
  );
};

const getColumnBackground = (status: string): string => {
  const colors = {
    [LeadStatus.Contacto]: "bg-blue-50 border-blue-200",
    [LeadStatus.SocialSelling]: "bg-purple-50 border-purple-200",
    [LeadStatus.ContactoCalido]: "bg-orange-50 border-orange-200",
    [LeadStatus.Prospecto]: "bg-amber-50 border-amber-200",
    [LeadStatus.CitaAgendada]: "bg-indigo-50 border-indigo-200",
    [LeadStatus.CitaValidada]: "bg-teal-50 border-teal-200",
    [LeadStatus.Cliente]: "bg-green-50 border-green-200",
  };
  return colors[status as LeadStatus] || "bg-gray-50 border-gray-200";
};

const getHeaderBackground = (status: string): string => {
  const colors = {
    [LeadStatus.Contacto]: "bg-blue-100",
    [LeadStatus.SocialSelling]: "bg-purple-100",
    [LeadStatus.ContactoCalido]: "bg-orange-100",
    [LeadStatus.Prospecto]: "bg-amber-100",
    [LeadStatus.CitaAgendada]: "bg-indigo-100",
    [LeadStatus.CitaValidada]: "bg-teal-100",
    [LeadStatus.Cliente]: "bg-green-100",
  };
  return colors[status as LeadStatus] || "bg-gray-100";
};

export const DroppableKanbanColumn = ({
  status,
  leads,
  setSelectedTask,
  showCreateLeadForm,
  generadores = [],
}: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <Card
      ref={setNodeRef}
      className={`w-[340px] flex-shrink-0 rounded-xl shadow-sm ${getColumnBackground(status)} 
      ${isOver ? "ring-2 ring-primary ring-offset-2" : ""}`}
    >
      <CardHeader className={`p-3 ${getHeaderBackground(status)} rounded-t-xl`}>
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getColumnIcon(status)}
            <span className="font-normal dark:text-black">
              {leadStatusMap[status]}
            </span>
          </div>
          <Badge
            variant="secondary"
            className="bg-white/80 text-slate-800 font-medium"
          >
            {leads.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-4">
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-4 pr-2">
            {leads.map((lead) => (
              <DraggableLeadCard
                key={lead.id}
                lead={lead}
                setSelectedTask={setSelectedTask}
              />
            ))}
          </div>
        </ScrollArea>
        <div className="w-full flex justify-center items-center mt-4">
          {showCreateLeadForm && <CreateLeadForm generadores={generadores} />}
        </div>
      </CardContent>
    </Card>
  );
};
