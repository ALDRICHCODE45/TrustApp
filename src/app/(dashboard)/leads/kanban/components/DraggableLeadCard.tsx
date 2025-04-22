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
import { CalendarIcon, TagIcon } from "lucide-react";
import { LeadEditForm } from "./LeadEditForm";
import { Lead } from "@prisma/client";
import { LeadWithRelations } from "../page";
import { leadStatusMap } from "@/app/(dashboard)/list/leads/components/LeadChangeStatus";

type LeadCardProps = {
  lead: LeadWithRelations;
  setSelectedTask: (task: Lead | null) => void;
};

export const DraggableLeadCard = ({ lead, setSelectedTask }: LeadCardProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: lead.id,
    data: { lead },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          className={`p-3 cursor-move bg-background hover:shadow-md transition-all ${
            isDragging ? "opacity-50" : ""
          }`}
          onClick={() => setSelectedTask(lead)}
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-sm leading-none">
                  {lead.empresa}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <TagIcon className="h-3 w-3 mr-1" />
                  {lead.sector}
                </p>
              </div>
              <Badge variant="secondary" className="text-[10px]">
                {leadStatusMap[lead.status]}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-[10px] bg-primary/10">
                  {lead.generadorLeads.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center text-[10px] text-muted-foreground">
                <CalendarIcon className="h-3 w-3 mr-1" />
                {lead.fechaAConectar?.getDay()}
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
