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
import { Lead } from "@/lib/data";
import { LeadEditForm } from "./LeadEditForm";

type LeadCardProps = {
  task: Lead;
  setSelectedTask: (task: Lead | null) => void;
};

export const DraggableLeadCard: React.FC<LeadCardProps> = ({
  task,
  setSelectedTask,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.empresa,
    data: { task },
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
          onClick={() => setSelectedTask(task)}
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-sm leading-none">
                  {task.empresa}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <TagIcon className="h-3 w-3 mr-1" />
                  {task.sector}
                </p>
              </div>
              <Badge variant="secondary" className="text-[10px]">
                {task.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-[10px] bg-primary/10">
                  {task.generadorLeads.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center text-[10px] text-muted-foreground">
                <CalendarIcon className="h-3 w-3 mr-1" />
                {task.fechaAConectar}
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
        <LeadEditForm task={task} />
      </DialogContent>
    </Dialog>
  );
};
