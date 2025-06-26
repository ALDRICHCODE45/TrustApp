"use client";
import Confetti from "react-confetti";
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
import { TagIcon, X } from "lucide-react";
import { toast } from "sonner";
import { KanbanFilters, FilterState } from "./components/KanbanFilters";
import { DroppableKanbanColumn } from "./components/KanbanColumn";
import { useState, useEffect } from "react";
import { Lead, LeadStatus, SubSector, User } from "@prisma/client";
import { LeadWithRelations } from "./page";
import { editLeadById } from "@/actions/leads/actions";
import { useWindowSize } from "@/components/providers/ConfettiProvider";
import { format, isSameDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  ContactoCalidoDialog,
  ContactoCalidoFormData,
} from "./components/ContactoCalidoDialog";
import { getAllSubSectores } from "@/actions/subsectores/actions";

interface Props {
  initialLeads: LeadWithRelations[];
  generadores: User[];
}

const getSubSectores = async () => {
  const subSectores = await getAllSubSectores();
  return subSectores;
};

export default function KanbanLeadsBoard({ initialLeads, generadores }: Props) {
  const { width, height } = useWindowSize();

  const [showConfetti, setShowConfetti] = useState(false);
  const [leads, setLeads] = useState<LeadWithRelations[]>(initialLeads);
  const [filteredLeads, setFilteredLeads] =
    useState<LeadWithRelations[]>(initialLeads);
  const [, setSelectedTask] = useState<Lead | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeLead, setActiveLead] = useState<LeadWithRelations | null>(null);
  const [subSectores, setSubSectores] = useState<SubSector[]>([]);

  useEffect(() => {
    const fetchSubSectores = async () => {
      const subSectores = await getSubSectores();
      setSubSectores(subSectores);
    };
    fetchSubSectores();
  }, []);

  // Estados para el dialog de ContactoCalido
  const [showContactoCalidoDialog, setShowContactoCalidoDialog] =
    useState(false);
  const [pendingLeadUpdate, setPendingLeadUpdate] = useState<{
    leadId: string;
    newStatus: LeadStatus;
    leadToUpdate: LeadWithRelations;
  } | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    generadorId: null,
    fechaCreacion: { from: null, to: null },
    oficina: null,
    searchTerm: "",
  });

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 10 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  );

  useEffect(() => {
    let result = [...leads];
    // Filter by search term (empresa)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(
        (lead) =>
          lead.empresa.toLowerCase().includes(searchLower) ||
          lead.sector.nombre.toLowerCase().includes(searchLower)
      );
    }

    // Filter by generator
    if (filters.generadorId) {
      result = result.filter(
        (lead) => lead.generadorId === filters.generadorId
      );
    }

    // Filter by office
    if (filters.oficina) {
      result = result.filter(
        (lead) => lead.generadorLeads.Oficina === filters.oficina
      );
    }

    // Filter by prospection date
    if (filters.fechaCreacion?.from || filters.fechaCreacion?.to) {
      result = result.filter((lead) => {
        if (!lead.createdAt) return false;
        const leadDate = new Date(lead.createdAt);
        const fromDate = filters.fechaCreacion?.from
          ? new Date(filters.fechaCreacion.from)
          : null;
        const toDate = filters.fechaCreacion?.to
          ? new Date(filters.fechaCreacion.to)
          : null;

        if (fromDate && toDate) {
          return leadDate >= fromDate && leadDate <= toDate;
        } else if (fromDate) {
          return leadDate >= fromDate;
        } else if (toDate) {
          return leadDate <= toDate;
        }
        return true;
      });
    }

    setFilteredLeads(result);
  }, [filters, leads]);

  const groupedLeads = Object.values(LeadStatus).reduce((acc, status) => {
    acc[status] = filteredLeads.filter((lead) => lead.status === status);
    return acc;
  }, {} as Record<LeadStatus, LeadWithRelations[]>);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const clearSingleFilter = (filterKey: keyof FilterState) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: null,
    }));
  };

  // Funciones para manejar el dialog de ContactoCalido
  const handleContactoCalidoConfirm = async (
    formData: ContactoCalidoFormData
  ) => {
    if (pendingLeadUpdate) {
      // Crear FormData con TODOS los datos incluyendo el nuevo status
      const formDataToSend = new FormData();
      formDataToSend.append("numero_empleados", formData.numeroEmpleados);
      formDataToSend.append("ubicacion", formData.ubicacion);
      formDataToSend.append("subSectorId", formData.subsector);
      formDataToSend.append("status", pendingLeadUpdate.newStatus);

      // Buscar el subsector seleccionado para incluir el objeto completo
      const selectedSubSector = subSectores.find(
        (sub) => sub.id === formData.subsector
      );

      // Actualizar el estado local optimistamente con todos los cambios
      setLeads((currentLeads) =>
        currentLeads.map((lead) =>
          lead.id === pendingLeadUpdate.leadId
            ? {
                ...lead,
                status: pendingLeadUpdate.newStatus,
                numero_empleados:
                  formData.numeroEmpleados === "500+"
                    ? 500
                    : parseInt(formData.numeroEmpleados.split("-")[0]) ||
                      lead.numero_empleados,
                ubicacion: formData.ubicacion,
                subSectorId: formData.subsector,
                SubSector: selectedSubSector || null,
              }
            : lead
        )
      );

      // Hacer una sola llamada que actualice todo
      const promise = editLeadById(pendingLeadUpdate.leadId, formDataToSend);

      toast.promise(promise, {
        loading: "Guardando cambios...",
        success: () =>
          `Lead actualizado a Contacto Cálido con información adicional`,
        error: () => {
          // Revertir el cambio si hay un error
          setLeads((currentLeads) =>
            currentLeads.map((lead) =>
              lead.id === pendingLeadUpdate.leadId
                ? { ...lead, status: pendingLeadUpdate.leadToUpdate.status }
                : lead
            )
          );
          return `Error al actualizar`;
        },
      });

      setShowContactoCalidoDialog(false);
      setPendingLeadUpdate(null);
    }
  };

  const handleContactoCalidoCancel = () => {
    setShowContactoCalidoDialog(false);
    setPendingLeadUpdate(null);
  };

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
      // Si se intenta mover a ContactoCalido, mostrar el dialog
      if (newStatus === LeadStatus.ContactoCalido) {
        setPendingLeadUpdate({
          leadId,
          newStatus,
          leadToUpdate,
        });
        setShowContactoCalidoDialog(true);
        return;
      }

      // Para otros estados, proceder normalmente
      await updateLeadStatus(leadId, newStatus, leadToUpdate);
    }
  };

  const updateLeadStatus = async (
    leadId: string,
    newStatus: LeadStatus,
    leadToUpdate: LeadWithRelations
  ) => {
    // Actualizar optimistamente el estado local
    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );

    // llamar accion para ACTUALIZAR lead
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
            lead.id === leadId ? { ...lead, status: leadToUpdate.status } : lead
          )
        );
        return `Error al actualizar`;
      },
    });

    if (newStatus === LeadStatus.Asignadas) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 10000);
    }
  };

  // Contar el total de leads y filtrarlos
  const totalLeads = leads.length;
  const totalFilteredLeads = filteredLeads.length;

  return (
    <div className="flex flex-col  h-[calc(100vh-170px)]">
      {showConfetti && (
        <Confetti
          numberOfPieces={350}
          wind={0.1}
          initialVelocityY={3}
          width={width}
          height={height}
          gravity={0.5}
        />
      )}

      <KanbanFilters
        onFilterChange={handleFilterChange}
        generadores={generadores}
        initialLeads={initialLeads}
      />

      {/* Filter status indicator */}
      {filters.generadorId ||
      filters.fechaCreacion?.from ||
      filters.fechaCreacion?.to ||
      filters.oficina ||
      filters.searchTerm ? (
        <div className="px-4 py-2 flex flex-wrap gap-2 text-black text-sm items-center">
          <span>
            Mostrando {totalFilteredLeads} de {totalLeads} leads
          </span>

          {filters.searchTerm && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 px-3 py-1"
            >
              <span>Búsqueda: {filters.searchTerm}</span>
              <X
                className="size-4 ml-1 cursor-pointer hover:text-red-500"
                onClick={() => clearSingleFilter("searchTerm")}
              />
            </Badge>
          )}

          {filters.generadorId && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 px-3 py-1"
            >
              <span>
                Generador:{" "}
                {generadores.find((g) => g.id === filters.generadorId)?.name}
              </span>
              <X
                className="size-4 ml-1 cursor-pointer hover:text-red-500"
                onClick={() => clearSingleFilter("generadorId")}
              />
            </Badge>
          )}

          {filters.oficina && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 px-3 py-1"
            >
              <span>Oficina: {filters.oficina}</span>
              <X
                className="size-4 ml-1 cursor-pointer hover:text-red-500"
                onClick={() => clearSingleFilter("oficina")}
              />
            </Badge>
          )}

          {filters.fechaCreacion?.from || filters.fechaCreacion?.to ? (
            <Badge
              variant="outline"
              className="flex items-center gap-1 px-3 py-1"
            >
              <span>
                Fecha:{" "}
                {filters.fechaCreacion?.from && filters.fechaCreacion?.to
                  ? `${format(
                      new Date(filters.fechaCreacion.from),
                      "dd/MM/yyyy"
                    )} - ${format(
                      new Date(filters.fechaCreacion.to),
                      "dd/MM/yyyy"
                    )}`
                  : filters.fechaCreacion?.from
                  ? `Desde ${format(
                      new Date(filters.fechaCreacion.from),
                      "dd/MM/yyyy"
                    )}`
                  : `Hasta ${format(
                      new Date(filters.fechaCreacion.to!),
                      "dd/MM/yyyy"
                    )}`}
              </span>
              <X
                className="size-4 ml-1 cursor-pointer hover:text-red-500"
                onClick={() => clearSingleFilter("fechaCreacion")}
              />
            </Badge>
          ) : null}
        </div>
      ) : null}

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="flex-1 overflow-x-auto scroll-hide pt-4 h-[calc(80vh-1400px)]">
          <div className="flex gap-14 h-full">
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
                    {activeLead.sector.nombre}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </DragOverlay>
      </DndContext>

      {/* Dialog para ContactoCalido */}
      <ContactoCalidoDialog
        open={showContactoCalidoDialog}
        onOpenChange={setShowContactoCalidoDialog}
        lead={pendingLeadUpdate?.leadToUpdate || null}
        onConfirm={handleContactoCalidoConfirm}
        onCancel={handleContactoCalidoCancel}
        subSectores={subSectores}
      />
    </div>
  );
}
