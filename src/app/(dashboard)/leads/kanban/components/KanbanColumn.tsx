"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useDroppable } from "@dnd-kit/core";
import { LeadStatus, Lead } from "@/lib/data";
import { DraggableLeadCard } from "./DraggableLeadCard";
import { CreateLeadForm } from "../../../list/leads/components/CreateLeadForm";
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

type KanbanColumnProps = {
  status: LeadStatus;
  tasks: Lead[];
  setSelectedTask: (task: Lead | null) => void;
  showCreateLeadForm: boolean;
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

const getColumnColor = (status: string): string => {
  const colors = {
    [LeadStatus.Contacto]: "border-blue-500/50",
    [LeadStatus.SocialSelling]: "border-purple-500/50",
    [LeadStatus.ContactoCalido]: "border-orange-500/50",
    [LeadStatus.Prospecto]: "border-amber-500/50",
    [LeadStatus.CitaAgendada]: "border-indigo-500/50",
    [LeadStatus.CitaValidada]: "border-teal-500/50",
    [LeadStatus.Cliente]: "border-green-500/50",
  };
  return colors[status as LeadStatus] || "border-gray-500/50";
};

export const DroppableKanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  tasks,
  setSelectedTask,
  showCreateLeadForm,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <Card
      ref={setNodeRef}
      className={`w-[280px] flex-shrink-0 bg-muted/30 border ${getColumnColor(
        status,
      )} ${isOver ? "ring-2 ring-primary" : ""}`}
    >
      <CardHeader className="p-3 space-y-0.5">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getColumnIcon(status)}
            <span>{status}</span>
          </div>
          <Badge variant="secondary" className="bg-muted">
            {tasks.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-3 pr-2">
            {tasks.map((task) => (
              <DraggableLeadCard
                key={task.empresa}
                task={task}
                setSelectedTask={setSelectedTask}
              />
            ))}
          </div>
        </ScrollArea>
        {showCreateLeadForm && <CreateLeadForm />}
      </CardContent>
    </Card>
  );
};
