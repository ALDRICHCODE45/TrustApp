"use client";
import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BriefcaseIcon,
  CalendarIcon,
  CreditCardIcon,
  LinkIcon,
  Plus,
  UsersIcon,
  BuildingIcon,
  TagIcon,
  PhoneIcon,
  CheckCircleIcon,
  HandshakeIcon,
} from "lucide-react";
import { leadsData, LeadStatus, Lead } from "@/lib/data";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CreateLeadForm } from "../../../list/leads/components/CreateLeadForm";

// Componente para los botones del formulario
type FormButtonsProps = {
  onCancel?: () => void;
  onSave?: () => void;
};

const FormButtons: React.FC<FormButtonsProps> = ({ onCancel, onSave }) => {
  return (
    <div className="flex gap-2 pt-2">
      <Button
        type="button"
        variant="outline"
        className="w-1/2"
        onClick={onCancel}
      >
        Cancelar
      </Button>
      <Button type="button" className="w-1/2" onClick={onSave}>
        Guardar Cambios
      </Button>
    </div>
  );
};

// Componente para la lista de contactos
type ContactListProps = {
  contacts: Array<{ name: string; posicion: string }>;
};

const ContactList: React.FC<ContactListProps> = ({ contacts }) => {
  return (
    <Card className="p-4 space-y-3 bg-muted/50 border-none">
      {/* Título con ícono */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <UsersIcon className="h-5 w-5" />
          <h3 className="text-sm font-medium">Contactos</h3>
        </div>
        <Button variant="ghost" size="sm" className="h-8">
          <Plus className="h-4 w-4 mr-1" />
          Añadir
        </Button>
      </div>

      {/* Lista de contactos */}
      <div className="space-y-2">
        {contacts.map((contact, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 bg-background p-2 rounded-md"
          >
            {/* Avatar */}
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary">
                {contact.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            {/* Detalles del contacto */}
            <div className="flex-1">
              <p className="text-sm font-medium">{contact.name}</p>
              <p className="text-xs text-muted-foreground">
                {contact.posicion}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Componente para el formulario de edición de lead
type LeadEditFormProps = {
  task: Lead;
};

const LeadEditForm: React.FC<LeadEditFormProps> = ({ task }) => {
  return (
    <form className="space-y-4">
      {/* Grupo 1: Empresa y Sector */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="empresa" className="">
            Empresa
          </Label>
          <div className="relative">
            <Input id="empresa" defaultValue={task.empresa} />
            <BriefcaseIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="sector">Sector</Label>
          <div className="relative">
            <Input id="sector" defaultValue={task.sector} />
            <CreditCardIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Generador de Leads */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="generadorLeads">Generador de Leads</Label>
        <div className="relative">
          <Input
            id="generadorLeads"
            defaultValue={task.generadorLeads.name}
            readOnly
          />
          <Avatar className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6">
            <AvatarImage
              src={task.generadorLeads.photo}
              alt={task.generadorLeads.name}
              className="object-cover"
            />
            <AvatarFallback>
              {task.generadorLeads.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Grupo 2: Fecha de Prospección y Enlace */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="fechaProspeccion">Fecha de Prospección</Label>
          <div className="relative">
            <Input
              id="fechaProspeccion"
              defaultValue={task.fechaProspeccion}
              type="date"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="link">Enlace</Label>
          <div className="relative">
            <Input id="link" defaultValue={task.link} />
            <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Contactos */}
      <ContactList contacts={task.contactos} />

      {/* Grupo 3: Fecha para Conectar */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="fechaAConectar">Fecha para Conectar</Label>
          <div className="relative">
            <Input
              id="fechaAConectar"
              defaultValue={task.fechaAConectar}
              type="date"
            />
          </div>
        </div>
      </div>

      {/* Botones */}
      <FormButtons />
    </form>
  );
};

// Componente para la tarjeta de lead (ahora es draggable)
type LeadCardProps = {
  task: Lead;
  setSelectedTask: (task: Lead | null) => void;
  getShortColumnName: (status: string) => string;
};

const DraggableLeadCard: React.FC<LeadCardProps> = ({
  task,
  setSelectedTask,
  getShortColumnName,
}) => {
  // Configuramos el elemento como draggable usando el ID único (empresa)
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.empresa,
    data: {
      task,
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          className={`p-4 cursor-move hover:bg-accent/50 transition-colors shadow-sm hover:shadow-md ${
            isDragging ? "opacity-50" : ""
          }`}
          onClick={() => setSelectedTask(task)}
        >
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <h3 className="text-base font-medium mb-1">{task.empresa}</h3>
              <div className="flex items-center text-xs text-muted-foreground">
                <TagIcon className="h-3 w-3 mr-1" />
                {task.sector}
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {getShortColumnName(task.status)}
            </Badge>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex -space-x-2">
              <Avatar className="h-7 w-7 border-2 border-background">
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                  {task.generadorLeads.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-center text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
              <CalendarIcon className="h-3 w-3 mr-1" />
              {task.fechaAConectar}
            </div>
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Lead</DialogTitle>
          <DialogDescription>
            Completa los campos para actualizar la información del lead.
          </DialogDescription>
        </DialogHeader>
        <LeadEditForm task={task} />
      </DialogContent>
    </Dialog>
  );
};

// Componente para la columna del Kanban
type KanbanColumnProps = {
  status: LeadStatus;
  tasks: Lead[];
  setSelectedTask: (task: Lead | null) => void;
  showCreateLeadForm: boolean;
};

const DroppableKanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  tasks,
  setSelectedTask,
  showCreateLeadForm,
}) => {
  // Configuramos la columna como droppable usando el status como ID
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  // Función para obtener el icono de la columna
  const getColumnIcon = (status: string) => {
    switch (status) {
      case LeadStatus.Contacto:
        return <TagIcon className="h-5 w-5 text-blue-500" />;
      case LeadStatus.SocialSelling:
        return <UsersIcon className="h-5 w-5 text-purple-500" />;
      case LeadStatus.ContactoCalido:
        return <PhoneIcon className="h-5 w-5 text-orange-500" />;
      case LeadStatus.Prospecto:
        return <BuildingIcon className="h-5 w-5 text-amber-500" />;
      case LeadStatus.CitaAgendada:
        return <CalendarIcon className="h-5 w-5 text-indigo-500" />;
      case LeadStatus.CitaValidada:
        return <CheckCircleIcon className="h-5 w-5 text-teal-500" />;
      case LeadStatus.Cliente:
        return <HandshakeIcon className="h-5 w-5 text-green-500" />;
      default:
        return <BriefcaseIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Función para obtener el nombre corto de la columna (para pantallas pequeñas)
  const getShortColumnName = (status: string) => {
    switch (status) {
      case LeadStatus.Contacto:
        return "Contacto";
      case LeadStatus.SocialSelling:
        return "S.S";
      case LeadStatus.ContactoCalido:
        return "C.C";
      case LeadStatus.Prospecto:
        return "Prospecto";
      case LeadStatus.CitaAgendada:
        return "C.A";
      case LeadStatus.CitaValidada:
        return "C.V";
      case LeadStatus.Cliente:
        return "Cliente";
      default:
        return status;
    }
  };

  return (
    <Card
      ref={setNodeRef}
      className={`w-72 flex-shrink-0 shadow-md border-t-4 border-t-primary/20 ${
        isOver ? "border-2 border-primary/50" : ""
      }`}
    >
      <CardHeader className="pb-2 pt-5">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getColumnIcon(status)}
            <span className="hidden md:inline">{status}</span>
            <span className="md:hidden">{getShortColumnName(status)}</span>
          </div>
          <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
            {tasks.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="space-y-3 pr-4">
            {tasks.map((task) => (
              <div
                key={task.empresa}
                className="transform transition-transform duration-200"
              >
                <DraggableLeadCard
                  task={task}
                  setSelectedTask={setSelectedTask}
                  getShortColumnName={getShortColumnName}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
        {showCreateLeadForm && (
          <div className="w-full flex justify-center items-center mt-10">
            <CreateLeadForm />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Componente principal del tablero Kanban
export default function KanbanLeadsBoard() {
  const [selectedTask, setSelectedTask] = useState<Lead | null>(null);
  const [leads, setLeads] = useState<Lead[]>(leadsData);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  );

  // Organiza los leads por estado
  const groupedLeads = Object.values(LeadStatus).reduce(
    (acc, status) => {
      acc[status] = leads.filter((lead) => lead.status === status);
      return acc;
    },
    {} as Record<LeadStatus, Lead[]>,
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const id = active.id as string;

    // Find the lead that is being dragged
    const lead = leads.find((lead) => lead.empresa === id);

    if (lead) {
      setActiveLead(lead);
      setActiveId(id);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Reset active states
    setActiveId(null);
    setActiveLead(null);

    // If there's no target or it's the same column, do nothing
    if (!over) return;

    const leadId = active.id as string;
    const newStatus = over.id as LeadStatus;

    // Verificar si el estado cambió
    const leadToUpdate = leads.find((lead) => lead.empresa === leadId);
    if (leadToUpdate && leadToUpdate.status !== newStatus) {
      // Update the leads array
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.empresa === leadId ? { ...lead, status: newStatus } : lead,
        ),
      );

      // Show a toast notification
      toast.success(`Lead moved to ${newStatus}`);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
    >
      <div className="flex h-full w-full overflow-x-auto p-4">
        <div className="flex space-x-4">
          {Object.entries(groupedLeads).map(([status, tasks], index) => (
            <DroppableKanbanColumn
              key={status}
              status={status as LeadStatus}
              tasks={tasks}
              setSelectedTask={setSelectedTask}
              showCreateLeadForm={index === 0}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeId && activeLead ? (
          <Card className="p-4 w-72 shadow-xl border border-primary/20 bg-background/95 backdrop-blur-sm">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <h3 className="text-base font-medium mb-1">
                  {activeLead.empresa}
                </h3>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TagIcon className="h-3 w-3 mr-1" />
                  {activeLead.sector}
                </div>
              </div>
            </div>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
