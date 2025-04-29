'use client'
import { useDraggable } from "@dnd-kit/core";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Lead } from "@prisma/client";
import { LeadWithRelations } from "../page";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { LeadSheet } from "./LeadEditForm";


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
    <Sheet>
      <DialogTrigger asChild>
        <div
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          className={`p-3 cursor-move bg-white border ${
            isDragging ? "opacity-50 border-slate-300" : "border-slate-100"
          } rounded-md hover:shadow-sm transition-all`}
          onClick={() => setSelectedTask(lead)}
        >
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-sm text-slate-800">
                  {lead.empresa}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {lead.sector}
                </p>
              </div>
            </div>
            <div className="flex items-center pt-2 border-t border-slate-50">
              <div className="flex items-center space-x-1">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-[10px] bg-slate-100 text-slate-600">
                    {lead.generadorLeads?.name
                      ? lead.generadorLeads.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-slate-500">
                  {lead.generadorLeads?.name?.split(" ")[0] || "Usuario"}
                </span>
              </div>
            </div>
          </div>

        </div>
      </DialogTrigger>
      <SheetContent>
        <LeadSheet
          lead={lead} 
        />
      </SheetContent>
    </Sheet>
  );
};
