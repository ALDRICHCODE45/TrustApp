"use client";
import { useDraggable } from "@dnd-kit/core";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DialogTrigger } from "@/components/ui/dialog";
import { Lead } from "@prisma/client";
import { LeadWithRelations } from "../page";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { getStatusColor, LeadSheet } from "./SheetLead";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { leadStatusMap } from "@/app/(dashboard)/list/leads/components/LeadChangeStatus";
import { Separator } from "@/components/ui/separator";
import { LeadStatus } from "@prisma/client";

type LeadCardProps = {
  lead: LeadWithRelations;
  setSelectedTask: (task: Lead | null) => void;
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

export const DraggableLeadCard = ({ lead, setSelectedTask }: LeadCardProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: lead.id,
    data: { lead },
  });

  return (
    <Sheet>
      <DialogTrigger asChild>
        <Card
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          className={`p-3 cursor-move bg-white border ${
            isDragging ? "opacity-50 border-slate-300" : "border-gray-200"
          }  hover:shadow-sm transition-all rounded-2xl`}
          onClick={() => setSelectedTask(lead)}
        >
          <div className="space-y-2">
            <div>
              <Badge className={getStatusColor(lead.status)}>
                {leadStatusMap[lead.status]}
              </Badge>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium  text-slate-800">{lead.empresa}</h3>
                <p className="text-md text-slate-500 mt-1">{lead.sector}</p>
              </div>
            </div>
            <div className="pt-1 pb-1">
              <Separator orientation="horizontal" />
            </div>

            <div className="flex items-center justify-between w-full">
              <div className="flex items-center  border-t border-slate-50">
                <div className="flex items-center space-x-1">
                  <Avatar className="size-8">
                    <AvatarFallback className=" bg-blue-100 text-blue-600">
                      {lead.generadorLeads?.name
                        ? lead.generadorLeads.name[0].toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm capitalize text-slate-500">
                    {lead.generadorLeads?.name?.split(" ")[0] || "Usuario"}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-gray-500" />
                  <Badge variant="outline">
                    <p className="text-black">{lead.contactos.length}</p>
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </DialogTrigger>
      <SheetContent>
        <LeadSheet lead={lead} />
      </SheetContent>
    </Sheet>
  );
};
