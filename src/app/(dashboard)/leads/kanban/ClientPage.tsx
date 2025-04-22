"use client";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensors,
  useSensor,
  closestCorners,
} from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { TagIcon } from "lucide-react";
import { toast } from "sonner";
import { KanbanFilters } from "./components/KanbanFilters";
import { DroppableKanbanColumn } from "./components/KanbanColumn";
import { useState } from "react";
import { Lead, LeadStatus, User } from "@prisma/client";
import { LeadWithRelations } from "./page";
import { editLeadById } from "@/actions/leads/actions";

interface Props {
  initialLeads: LeadWithRelations[];
  generadores: User[];
}

export default function KanbanLeadsBoard({ initialLeads, generadores }: Props) {
  const [leads, setLeads] = useState<LeadWithRelations[]>(initialLeads);
  const [selectedTask, setSelectedTask] = useState<Lead | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 10 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
  );

  const groupedLeads = Object.values(LeadStatus).reduce(
    (acc, status) => {
      acc[status] = leads.filter((lead) => lead.status === status);
      return acc;
    },
    {} as Record<LeadStatus, LeadWithRelations[]>,
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const lead = leads.find((lead) => lead.id === active.id);
    if (lead) {
      setActiveLead(lead);
      setActiveId(active.id as string);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    setActiveLead(null);

    if (!over) return;

    const leadId = active.id as string;
    const newStatus = over.id as LeadStatus;

    const leadToUpdate = leads.find((lead) => lead.id === leadId);

    if (leadToUpdate && leadToUpdate.status !== newStatus) {
      // Actualizar optimistamente el estado local
      setLeads((currentLeads) =>
        currentLeads.map((lead) =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead,
        ),
      );

      //Todo: llamar accion para mover lead
      const formData = new FormData();
      formData.append("status", newStatus);

      const promise = editLeadById(leadId, formData);

      toast.promise(promise, {
        loading: "Guardando cambios...",
        success: () => `Lead actualizado a ${newStatus}`,
        error: () => {
          // Revertir el cambio si hay un error
          setLeads((currentLeads) =>
            currentLeads.map((lead) =>
              lead.id === leadId
                ? { ...lead, status: leadToUpdate.status }
                : lead,
            ),
          );
          return `Error al actualizar`;
        },
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <KanbanFilters onFilterChange={() => {}} />

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="flex-1 overflow-x-auto p-4">
          <div className="flex gap-4">
            {Object.entries(groupedLeads).map(([status, leads], index) => (
              <DroppableKanbanColumn
                key={status}
                status={status as LeadStatus}
                leads={leads}
                setSelectedTask={setSelectedTask}
                showCreateLeadForm={index === 0}
                generadores={generadores}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeId && activeLead && (
            <Card className="w-[280px] p-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-sm">{activeLead.empresa}</h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center">
                    <TagIcon className="h-3 w-3 mr-1" />
                    {activeLead.sector}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
