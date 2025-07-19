"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  Building,
  FileText,
  AlertCircle,
  CheckCircle2,
  Plus,
  MessageSquareOff,
  MessageSquare,
  Download,
  MoreVertical,
  Edit,
  Trash,
  UserPlus,
  UserCheck,
  Mail,
  Phone,
  X,
  Loader2,
  Filter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KanbanFilters, FilterState } from "./KanbanFilters";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { updateVacancyStatus } from "@/actions/vacantes/actions";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  KeyboardSensor,
  DragOverlay as DragOverlayComponent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { VacancyWithRelations } from "./ReclutadorColumns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Role } from "@prisma/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { User, Client } from "@prisma/client";
import Link from "next/link";

// Types
interface ColumnProps {
  id: string;
  title: string;
  vacantes: VacancyWithRelations[];
  onVacanteClick: (vacante: VacancyWithRelations) => void;
  user_logged: {
    name: string;
    email: string;
    role: Role;
    image: string;
  };
}

interface VacanteCardProps {
  vacante: VacancyWithRelations;
  onClick: () => void;
  isDragging?: boolean;
}

interface DetailsSectionProps {
  vacante: VacancyWithRelations;
  user_logged: {
    name: string;
    email: string;
    role: Role;
    image: string;
  };
}

interface CandidatesSectionProps {
  vacante: VacancyWithRelations;
}

interface CommentsSectionProps {
  vacante: VacancyWithRelations;
}

interface DocumentsSectionProps {
  vacante: VacancyWithRelations;
}

// Utility Functions
const getTipoColor = (tipo: string) => {
  switch (tipo) {
    case "Nueva":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "Garantia":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case "QuickMeeting":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Hunting":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    case "Entrevistas":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "Placement":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Perdida":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "Cancelada":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

// Nueva función para calcular días transcurridos desde la asignación
const calculateDaysFromAssignment = (fechaAsignacion: Date): number => {
  const today = new Date();
  const assignmentDate = new Date(fechaAsignacion);
  const diffTime = today.getTime() - assignmentDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Nueva función para calcular días restantes hasta la entrega
const calculateDaysToDelivery = (fechaEntrega: Date | null): number => {
  if (!fechaEntrega) return 0;

  const today = new Date();
  const deliveryDate = new Date(fechaEntrega);
  const diffTime = deliveryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Nueva función para obtener el color de progreso basado en los días restantes
const getProgressColor = (daysRemaining: number): string => {
  if (daysRemaining < 0) {
    // Días de retraso - rojo intenso
    return "bg-red-600";
  } else if (daysRemaining <= 3) {
    // Crítico - rojo
    return "bg-red-500";
  } else if (daysRemaining <= 7) {
    // Urgente - naranja
    return "bg-orange-500";
  } else if (daysRemaining <= 14) {
    // Precaución - amarillo
    return "bg-yellow-500";
  } else {
    // Seguro - verde
    return "bg-green-500";
  }
};

//Nuava funcion para obtener los dias de diferencia entre la fecha de asignacion y la fecha de entrega
const getDaysDifference = (
  fechaAsignacion: Date,
  fechaEntrega: Date
): number => {
  const fechaAsignacionDate = new Date("2024-07-01");
  const fechaEntregaDate = new Date("2024-07-10");

  const diferenciaMs =
    fechaEntregaDate.getTime() - fechaAsignacionDate.getTime();
  const diferenciaDias = diferenciaMs / (1000 * 60 * 60 * 24);
  return diferenciaDias;
};

// Nueva función para obtener el porcentaje de progreso
const getProgressPercentage = (
  daysTranscurred: number,
  daysRemaining: number
): number => {
  const totalDays = daysTranscurred + Math.max(0, daysRemaining);
  if (totalDays === 0) return 0;

  const percentage = (daysTranscurred / totalDays) * 100;
  return Math.min(100, Math.max(0, percentage));
};

// Nueva función para obtener el texto del estado del progreso
const getProgressStatusText = (
  daysRemaining: number
): { text: string; color: string } => {
  if (daysRemaining < 0) {
    return {
      text: `${Math.abs(daysRemaining)} días de retraso`,
      color: "text-red-600 font-semibold",
    };
  } else if (daysRemaining === 0) {
    return {
      text: "Vence hoy",
      color: "text-red-600 font-semibold",
    };
  } else if (daysRemaining <= 3) {
    return {
      text: `${daysRemaining} días restantes`,
      color: "text-red-600 font-semibold",
    };
  } else if (daysRemaining <= 7) {
    return {
      text: `${daysRemaining} días restantes`,
      color: "text-orange-600 font-medium",
    };
  } else {
    return {
      text: `${daysRemaining} días restantes`,
      color: "text-green-600",
    };
  }
};

// Draggable Vacante Card Component
const DraggableVacanteCard: React.FC<VacanteCardProps> = ({
  vacante,
  onClick,
  isDragging = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: vacante.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
    zIndex: isDragging || isSortableDragging ? 1000 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group"
    >
      <Card
        className={`cursor-grab active:cursor-grabbing hover:shadow-lg transition-all duration-200 rounded-2xl border-2 ${
          isDragging || isSortableDragging
            ? "border-blue-400 shadow-xl scale-105"
            : "border-slate-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
        } bg-white dark:bg-gray-800 relative`}
        onClick={onClick}
      >
        {/* Indicador visual cuando se arrastra sobre esta tarjeta */}
        <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-blue-400 bg-blue-50/20 dark:bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

        <CardHeader className="p-4 pb-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <h3 className="font-semibold text-base truncate max-w-[150px]">
                    {vacante.posicion.length > 30
                      ? `${vacante.posicion.slice(0, 30)}...`
                      : vacante.posicion}
                  </h3>
                  {vacante.posicion.length > 30 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 p-0"
                          aria-label="Ver posición completa"
                          tabIndex={0}
                        >
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="max-w-xs">
                        <span className="text-sm break-words">
                          {vacante.posicion}
                        </span>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
                {/* Indicador de retraso - debajo del nombre */}
                {(() => {
                  const daysRemaining = calculateDaysToDelivery(
                    vacante.fechaEntrega
                  );
                  if (daysRemaining < 0) {
                    return (
                      <div className="flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-xs text-red-600 font-semibold ml-1">
                          ¡Retraso!
                        </span>
                      </div>
                    );
                  }
                  return null;
                })()}
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Building className="h-4 w-4 mr-1" />
                  <span className="truncate">
                    {vacante.cliente?.cuenta || "Sin cliente"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge
                  variant="outline"
                  className={
                    getTipoColor(vacante.tipo) + " ml-2 whitespace-nowrap"
                  }
                >
                  {vacante.tipo}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 pt-0 pb-2">
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={vacante.reclutador?.image || ""}
                  alt={vacante.reclutador?.name || "Reclutador"}
                  className="h-full w-full object-cover"
                />
                <AvatarFallback>
                  {vacante.reclutador?.name?.charAt(0) || "R"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                {vacante.reclutador.name.length > 10
                  ? `${vacante.reclutador.name.slice(0, 10)}...`
                  : vacante.reclutador.name}
              </span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                {vacante.fechaEntrega?.toLocaleDateString() || "Sin fecha"}
              </span>
            </div>
          </div>

          {/* Barra de progreso visual */}
          {(() => {
            const daysTranscurred = calculateDaysFromAssignment(
              vacante.fechaAsignacion
            );
            const daysRemaining = calculateDaysToDelivery(vacante.fechaEntrega);
            const progressPercentage = getProgressPercentage(
              daysTranscurred,
              daysRemaining
            );
            const progressColor = getProgressColor(daysRemaining);

            return (
              <div className="mt-3">
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${progressColor} transition-all duration-300`}
                    style={{
                      width: `${progressPercentage}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{daysTranscurred}d transcurridos</span>
                  {daysRemaining < 0 ? (
                    <span className="text-red-600 font-semibold">
                      {Math.abs(daysRemaining)}d retraso
                    </span>
                  ) : (
                    <span>{daysRemaining}d restantes</span>
                  )}
                </div>
              </div>
            );
          })()}
        </CardContent>
        <CardFooter className="px-4 pt-2 pb-4 flex items-center justify-between border-t border-slate-100 dark:border-gray-700">
          <Badge variant="outline" className={getEstadoColor(vacante.estado)}>
            {vacante.estado}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>
              {calculateDaysFromAssignment(vacante.fechaAsignacion)} días
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

// Kanban Column Component
const DroppableColumn: React.FC<ColumnProps> = ({
  id,
  title,
  vacantes,
  onVacanteClick,
  user_logged,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-[320px] flex-shrink-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-3 h-full flex flex-col border-2 transition-all duration-200 ${
        isOver
          ? "border-blue-400 bg-blue-50/50 dark:bg-blue-900/20"
          : "border-slate-200 dark:border-gray-700"
      } shadow-lg`}
    >
      <div className="p-4 bg-white dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm mb-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm text-normal  text-gray-800 dark:text-black">
            {title}
          </h2>
          <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
            {vacantes.length}
          </span>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-3 px-2">
          <SortableContext
            items={vacantes.map((v) => v.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            {vacantes.map((vacante) => (
              <Dialog key={vacante.id}>
                <DialogTrigger asChild>
                  <div>
                    <DraggableVacanteCard
                      vacante={vacante}
                      onClick={() => onVacanteClick(vacante)}
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl">
                      {vacante.posicion}
                    </DialogTitle>
                  </DialogHeader>
                  <VacanteTabs vacante={vacante} user_logged={user_logged} />
                </DialogContent>
              </Dialog>
            ))}
          </SortableContext>
          {/* Área de drop vacía al final de la columna */}
          {vacantes.length === 0 && (
            <div className="h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Arrastra vacantes aquí
              </span>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

const DetailsSection: React.FC<DetailsSectionProps> = ({
  vacante,
  user_logged,
}) => (
  <div className="space-y-6 mt-4">
    <div className="bg-muted/30 p-4 rounded-lg border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={vacante.reclutador?.image || ""}
              alt={vacante.reclutador?.name || "Reclutador"}
              className="w-full h-full object-cover"
            />
            <AvatarFallback>
              {vacante.reclutador?.name?.charAt(0) || "R"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-muted-foreground">Reclutador asignado</p>
            <p className="font-normal text-md text-gray-700 dark:text-muted-foreground">
              {vacante.reclutador?.name || "Sin reclutador"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className={getTipoColor(vacante.tipo)}>{vacante.tipo}</Badge>
          <Badge variant="outline">
            {vacante.cliente?.cuenta || "Sin cliente"}
          </Badge>
        </div>
      </div>
      {/* Información de cliente y tiempos */}
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3 space-y-3">
          <div className="flex items-center">
            <Building className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Cliente:</span>
            <span className="ml-2 font-normal text-md text-gray-700 dark:text-muted-foreground">
              {vacante.cliente?.cuenta || "Sin cliente"}
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Fecha entrega:
            </span>
            <span className="ml-2 font-normal text-md text-gray-700 dark:text-muted-foreground ">
              {vacante?.fechaEntrega
                ? format(vacante.fechaEntrega, "EE, dd MMMM yyyy", {
                    locale: es,
                  })
                : "Sin fecha"}
            </span>
          </div>
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Fecha asignación:
            </span>
            <span className="ml-2 font-normal text-md text-gray-700 dark:text-muted-foreground">
              {vacante.fechaAsignacion
                ? format(vacante.fechaAsignacion, "EE, dd MMMM yyyy", {
                    locale: es,
                  })
                : "Sin fecha"}
            </span>
          </div>
        </div>
        <div className="col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">
                  Tiempo transcurrido:
                </span>
                <span className="font-normal text-xs text-gray-700 dark:text-muted-foreground">
                  (Placement)
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-6 px-2">
              <span className="font-normal text-md text-gray-700 dark:text-muted-foreground">
                {calculateDaysFromAssignment(vacante.fechaAsignacion)} días
              </span>
            </Button>
          </div>
          <div className="pt-2">
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(
                  calculateDaysToDelivery(vacante.fechaEntrega)
                )}`}
                style={{
                  width: `${getProgressPercentage(
                    calculateDaysFromAssignment(vacante.fechaAsignacion),
                    calculateDaysToDelivery(vacante.fechaEntrega)
                  )}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0</span>
              <span>
                {getDaysDifference(
                  vacante.fechaAsignacion,
                  vacante.fechaEntrega || new Date()
                )}
                d
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* Información financiera */}
    <div>
      <h4 className="text-sm font-medium uppercase text-muted-foreground mb-3 flex items-center">
        <FileText className="h-4 w-4 mr-2" />
        Información financiera
      </h4>
      <div className="grid grid-cols-3 gap-4">
        <Card className="overflow-hidden">
          <div className="h-1 bg-blue-500"></div>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Salario</div>
            <div className="text-2xl font-semibold mt-1">
              $
              {vacante.salario?.toLocaleString() || (
                <span className="">N/A</span>
              )}
            </div>
          </CardContent>
        </Card>
        {user_logged.role === Role.Admin && (
          <>
            <Card className="overflow-hidden">
              <div className="h-1 bg-purple-500"></div>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">Fee</div>
                <div className="text-2xl font-semibold mt-1">
                  {vacante.fee || "N/A"}%
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <div className="h-1 bg-green-500"></div>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">
                  Valor factura
                </div>
                <div className="text-2xl font-semibold mt-1">
                  ${vacante.valorFactura?.toLocaleString() || "N/A"}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
    {/* Candidato contratado (condicional) */}
    {vacante.candidatoContratado && (
      <Card className="overflow-hidden border-green-200 dark:border-green-800">
        <div className="h-1 bg-green-500"></div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-medium">Candidato contratado</h4>
                <p className="text-muted-foreground text-sm">
                  {vacante.candidatoContratado.name}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-1" />
              Ver CV
            </Button>
          </div>
        </CardContent>
      </Card>
    )}
  </div>
);

const CandidatesSection: React.FC<CandidatesSectionProps> = ({ vacante }) => (
  <div className="space-y-6 mt-4">
    {/* Existing candidates section content */}
    {/* ... (Keep the existing candidates section content) ... */}
    {vacante.ternaFinal && vacante.ternaFinal.length > 0 ? (
      <div className="space-y-6 mt-4 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-muted-foreground">
            Terna final
          </h4>
          <Badge variant="outline" className="px-3 py-1 bg-background">
            {vacante.ternaFinal.length} candidato(s)
          </Badge>
        </div>
        {/* Lista de candidatos */}
        <div className="space-y-3">
          {vacante.ternaFinal.map((candidato, index) => (
            <Card
              key={index}
              className="group hover:shadow-sm transition-shadow duration-200"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {/* Avatar compacto */}
                  <div className="relative">
                    <Avatar className="h-11 w-11">
                      <AvatarImage
                        src={
                          typeof candidato.cv === "string"
                            ? candidato.cv
                            : (candidato.cv as any)?.url || "" || ""
                        }
                        alt={candidato.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                        {candidato.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {/* Indicador de estado minimalista */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>

                  {/* Información del candidato */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-foreground mb-1 truncate">
                          {candidato.name}
                        </h3>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">
                              {candidato.email || "Sin email"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{candidato.phone || "Sin teléfono"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Dropdown de acciones */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-40 z-[9999]"
                        >
                          {candidato.cv?.url && (
                            <DropdownMenuItem
                              asChild
                              className="cursor-pointer"
                            >
                              <Link
                                href={candidato.cv.url || ""}
                                target="_blank"
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Ver CV
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="cursor-pointer">
                            <UserCheck className="h-4 w-4 mr-2" />
                            Seleccionar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                {/* Información de estado */}
                <div className="mt-3 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      Candidato #{index + 1}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      En terna final
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground bg-muted/10 rounded-lg mt-4">
        <AlertCircle className="h-10 w-10 mb-4 text-muted-foreground/60" />
        <p className="text-base font-medium mb-2">
          No hay candidatos en la terna final
        </p>
        <p className="text-sm text-center max-w-sm">
          Cuando se agreguen candidatos a la terna final, aparecerán aquí para
          su revisión.
        </p>
        <Button className="mt-4" variant="outline" size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Agregar candidatos
        </Button>
      </div>
    )}
  </div>
);

const CommentsSection: React.FC<CommentsSectionProps> = ({ vacante }) => (
  <div className="space-y-6 mt-4">
    {/* Existing comments section content */}{" "}
    {/* ... (Keep the existing comments section content) ... */}
    <div className="space-y-6 mt-4 h-[300px] overflow-auto p-3">
      {/* Encabezado con título y botón de añadir */}{" "}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium uppercase text-muted-foreground flex items-center">
          <MessageSquare className="h-4 w-4 mr-2" /> Historial de comentarios
        </h4>
        <Button size="sm" variant="outline" className="h-8">
          <Plus className="h-4 w-4 mr-2" /> Añadir comentario
        </Button>
      </div>
      {/* Contenido de los comentarios */}
      {vacante.Comments && vacante.Comments.length > 0 ? (
        <div className="space-y-4">
          {/* Barra de tiempo para comentarios */}
          <div className="relative pb-2">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border"></div>

            {vacante.Comments.map((comentario, index) => (
              <div key={comentario.id} className="relative mb-6 last:mb-0">
                {/* Indicador de tiempo */}
                <div className="absolute left-4 top-0 -translate-x-1/2 w-2 h-2 rounded-full bg-primary z-10"></div>

                <Card className={`ml-8 ${index === 0 ? "border-primary" : ""}`}>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={comentario.author.image || ""}
                            alt={comentario.author.name}
                            className="w-full h-full object-cover"
                          />
                          <AvatarFallback>
                            {comentario.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium leading-none">
                            {comentario.author.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {comentario.author.role || "Reclutador"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {format(comentario.createdAt, "EE, dd MMMM yyyy", {
                            locale: es,
                          })}
                        </Badge>
                        {index === 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Más reciente
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-sm">{comentario.content}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 bg-muted/30 rounded-lg border border-dashed">
          <MessageSquareOff className="h-10 w-10 mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">No hay comentarios todavía</p>
          <Button variant="outline" size="sm" className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Añadir el primer comentario
          </Button>
        </div>
      )}
    </div>
  </div>
);

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ vacante }) => (
  <div className="space-y-6 mt-4">
    {/* Existing documents section content */}
    {/* ... (Keep the existing documents section content) ... */}
    <div className="space-y-6 mt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Documentos</h3>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> <span>Añadir documento</span>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Documento 1 */}
        <Card className="group hover:shadow-md transition-all duration-200">
          <CardContent className="p-5">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="z-[9999]">
                    <DropdownMenuItem className="cursor-pointer">
                      <Download />
                      <span>Descargar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500 cursor-pointer ">
                      <Trash />
                      <span>Eliminar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <div className="font-medium text-lg mb-1">Checklist</div>
                <div className="text-sm text-muted-foreground">
                  Actualizado el 26 Feb, 2025
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="outline"
                  className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                >
                  PDF
                </Badge>
                <span className="text-xs text-muted-foreground">2.4 MB</span>
              </div>

              <Button variant="outline" size="sm">
                <Download />
                <span>Descargar</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Documento 2 */}
        <Card className="group hover:shadow-md transition-all duration-200">
          <CardContent className="p-5">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="z-[9999]">
                    <DropdownMenuItem className="cursor-pointer">
                      <Download />
                      <span>Descargar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600 dark:text-red-400 cursor-pointer">
                      <Trash />
                      <span>Eliminar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <div className="font-medium text-lg mb-1">
                  Muestra de perfil
                </div>
                <div className="text-sm text-muted-foreground">
                  Actualizado el 1 Mar, 2025
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="outline"
                  className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                >
                  DOCX
                </Badge>
                <span className="text-xs text-muted-foreground">1.8 MB</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span>Descargar</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Añadir documento (card) */}
        <Card className="border-dashed hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200 cursor-pointer">
          <CardContent className="p-5 flex flex-col items-center justify-center h-full text-center">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4">
              <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-medium mb-2">Añadir nuevo documento</h4>
            <p className="text-sm text-muted-foreground">
              Sube archivos PDF, DOCX, XLSX o imágenes
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Documentos recientes (sección opcional) */}
    </div>
  </div>
);

const VacanteTabs: React.FC<{
  vacante: VacancyWithRelations;
  user_logged: {
    name: string;
    email: string;
    role: Role;
    image: string;
  };
}> = ({ vacante, user_logged }) => (
  <Tabs defaultValue="detalles">
    <TabsList className="grid w-full grid-cols-4">
      <TabsTrigger value="detalles">Detalles</TabsTrigger>
      <TabsTrigger value="candidatos">Terna Final</TabsTrigger>
      <TabsTrigger value="comentarios">Comentarios</TabsTrigger>
      <TabsTrigger value="documentos">Documentos</TabsTrigger>
    </TabsList>
    <TabsContent value="detalles">
      <DetailsSection vacante={vacante} user_logged={user_logged} />
    </TabsContent>
    <TabsContent value="candidatos">
      <CandidatesSection vacante={vacante} />
    </TabsContent>
    <TabsContent value="comentarios">
      <CommentsSection vacante={vacante} />
    </TabsContent>
    <TabsContent value="documentos">
      <DocumentsSection vacante={vacante} />
    </TabsContent>
  </Tabs>
);

interface KanbanBoardPageProps {
  initialVacantes: VacancyWithRelations[];
  user_logged: {
    name: string;
    email: string;
    role: Role;
    image: string;
  };
  reclutadores: User[];
  clientes: Client[];
}

export const KanbanBoardPage = ({
  initialVacantes,
  user_logged,
  reclutadores,
  clientes,
}: KanbanBoardPageProps) => {
  const [allVacantes, setAllVacantes] =
    useState<VacancyWithRelations[]>(initialVacantes);
  const [filteredVacantes, setFilteredVacantes] =
    useState<VacancyWithRelations[]>(initialVacantes);
  const [selectedVacante, setSelectedVacante] =
    useState<VacancyWithRelations | null>(null);
  const [mobileView, setMobileView] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFilteringVacantes, setIsFilteringVacantes] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    reclutadorId: null,
    clienteId: null,
    tipo: null,
    fechaAsignacion: { from: null, to: null },
    año: null,
    mes: null,
    rangoMeses: { from: null, to: null },
  });

  // Meses del año para referencia
  const months = [
    { value: 1, label: "Enero" },
    { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" },
    { value: 6, label: "Junio" },
    { value: 7, label: "Julio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" },
    { value: 12, label: "Diciembre" },
  ];

  const getMonthName = (monthValue: number) => {
    return months.find((m) => m.value === monthValue)?.label;
  };

  // Configurar sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Función para aplicar filtros con debouncing
  const applyFilters = (
    vacantes: VacancyWithRelations[],
    filterState: FilterState
  ) => {
    let filtered = [...vacantes];

    // Filtro por término de búsqueda (posición)
    if (filterState.searchTerm) {
      filtered = filtered.filter((v) =>
        v.posicion.toLowerCase().includes(filterState.searchTerm.toLowerCase())
      );
    }

    // Filtro por reclutador
    if (filterState.reclutadorId) {
      filtered = filtered.filter(
        (v) => v.reclutadorId === filterState.reclutadorId
      );
    }

    // Filtro por cliente
    if (filterState.clienteId) {
      filtered = filtered.filter((v) => v.clienteId === filterState.clienteId);
    }

    // Filtro por tipo
    if (filterState.tipo) {
      filtered = filtered.filter((v) => v.tipo === filterState.tipo);
    }

    // Filtro por rango de fechas de asignación
    if (filterState.fechaAsignacion.from || filterState.fechaAsignacion.to) {
      filtered = filtered.filter((v) => {
        const fechaAsignacion = new Date(v.fechaAsignacion);
        const from = filterState.fechaAsignacion.from;
        const to = filterState.fechaAsignacion.to;

        if (from && to) {
          return fechaAsignacion >= from && fechaAsignacion <= to;
        } else if (from) {
          return fechaAsignacion >= from;
        } else if (to) {
          return fechaAsignacion <= to;
        }
        return true;
      });
    }

    // Filtro por año
    if (filterState.año) {
      filtered = filtered.filter((v) => {
        const year = new Date(v.fechaAsignacion).getFullYear();
        return year === filterState.año;
      });
    }

    // Filtro por mes
    if (filterState.mes) {
      filtered = filtered.filter((v) => {
        const month = new Date(v.fechaAsignacion).getMonth() + 1;
        return month === filterState.mes;
      });
    }

    // Filtro por rango de meses
    if (filterState.rangoMeses.from || filterState.rangoMeses.to) {
      filtered = filtered.filter((v) => {
        const month = new Date(v.fechaAsignacion).getMonth() + 1;
        const from = filterState.rangoMeses.from;
        const to = filterState.rangoMeses.to;

        if (from && to) {
          return month >= from && month <= to;
        } else if (from) {
          return month >= from;
        } else if (to) {
          return month <= to;
        }
        return true;
      });
    }

    return filtered;
  };

  // Manejar cambios en los filtros con loading state
  const handleFilterChange = async (newFilters: FilterState) => {
    setIsFilteringVacantes(true);
    setFilters(newFilters);

    // Simular un pequeño delay para mejor UX
    await new Promise((resolve) => setTimeout(resolve, 100));

    const filtered = applyFilters(allVacantes, newFilters);
    setFilteredVacantes(filtered);
    setIsFilteringVacantes(false);
  };

  // Usar filtered vacantes en lugar de las originales
  const validVacantes = filteredVacantes.filter((vacante) => {
    if (!vacante.reclutador) {
      console.warn(`Vacante ${vacante.id} no tiene reclutador asignado`);
      return false;
    }
    return true;
  });

  // Función para actualizar vacantes después de cambios
  const updateVacantes = (updatedVacantes: VacancyWithRelations[]) => {
    setAllVacantes(updatedVacantes);
    const filtered = applyFilters(updatedVacantes, filters);
    setFilteredVacantes(filtered);
  };

  const columns = [
    { id: "QuickMeeting", title: "Quick Meeting" },
    { id: "Hunting", title: "Hunting" },
    { id: "Entrevistas", title: "Entrevistas" },
    { id: "Placement", title: "Placement" },
    { id: "Perdida", title: "Perdida" },
    { id: "Cancelada", title: "Cancelada" },
  ];

  // Función para manejar el inicio del drag
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // Función para manejar el final del drag
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Encontrar la vacante activa
    const activeVacante = validVacantes.find(
      (v) => v.id.toString() === activeId
    );
    if (!activeVacante) return;

    // Buscar la tarjeta objetivo
    const overVacante = validVacantes.find((v) => v.id.toString() === overId);

    // Verificar si se está moviendo a una nueva columna
    const targetColumn = columns.find((col) => col.id === overId);

    // Si se arrastra directamente sobre una columna
    if (targetColumn && activeVacante.estado !== targetColumn.id) {
      // Movimiento entre columnas
      try {
        setIsUpdating(true);

        // Actualizar el estado en el backend
        const result = await updateVacancyStatus(
          activeId,
          targetColumn.id as any
        );

        if (result.ok) {
          // Actualizar el estado local
          const updatedVacantes = allVacantes.map((v: VacancyWithRelations) =>
            v.id.toString() === activeId
              ? { ...v, estado: targetColumn.id as any }
              : v
          );
          updateVacantes(updatedVacantes);

          toast.success(`Vacante actualizada a ${targetColumn.title}`);
        } else {
          toast.error(result.message || "Error al actualizar la vacante");
        }
      } catch (error) {
        console.error("Error updating vacancy status:", error);
        toast.error("Error al actualizar el estado de la vacante");
      } finally {
        setIsUpdating(false);
      }
    } else if (overVacante) {
      // Se arrastra sobre otra tarjeta
      if (activeVacante.estado !== overVacante.estado) {
        // Movimiento entre columnas a través de una tarjeta
        try {
          setIsUpdating(true);

          const result = await updateVacancyStatus(
            activeId,
            overVacante.estado as any
          );

          if (result.ok) {
            const updatedVacantes = allVacantes.map((v: VacancyWithRelations) =>
              v.id.toString() === activeId
                ? { ...v, estado: overVacante.estado as any }
                : v
            );
            updateVacantes(updatedVacantes);

            const targetColumnTitle =
              columns.find((col) => col.id === overVacante.estado)?.title ||
              overVacante.estado;

            toast.success(`Vacante actualizada a ${targetColumnTitle}`);
          } else {
            toast.error(result.message || "Error al actualizar la vacante");
          }
        } catch (error) {
          console.error("Error updating vacancy status:", error);
          toast.error("Error al actualizar el estado de la vacante");
        } finally {
          setIsUpdating(false);
        }
      } else {
        // Reordenamiento dentro de la misma columna
        const activeVacanteIndex = validVacantes.findIndex(
          (v) => v.id.toString() === activeId
        );
        const overVacanteIndex = validVacantes.findIndex(
          (v) => v.id.toString() === overId
        );

        if (activeVacanteIndex !== overVacanteIndex) {
          const newVacantes = arrayMove(
            validVacantes,
            activeVacanteIndex,
            overVacanteIndex
          );
          updateVacantes(newVacantes);
        }
      }
    } else if (targetColumn && activeVacante.estado === targetColumn.id) {
      // Arrastrar sobre una columna vacía en la misma columna
      // No hacer nada ya que está en la misma columna
    }
  };

  // Función para manejar el drag over (para mejor UX)
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Encontrar la vacante activa
    const activeVacante = validVacantes.find(
      (v) => v.id.toString() === activeId
    );
    if (!activeVacante) return;

    // Buscar la tarjeta objetivo
    const overVacante = validVacantes.find((v) => v.id.toString() === overId);

    // Verificar si se está moviendo a una nueva columna
    const targetColumn = columns.find((col) => col.id === overId);

    if (targetColumn && activeVacante.estado !== targetColumn.id) {
      // Arrastrar sobre una columna diferente
      // La columna se resaltará automáticamente gracias al isOver del useDroppable
    } else if (overVacante && activeVacante.estado !== overVacante.estado) {
      // Arrastrar sobre una tarjeta en una columna diferente
      // Esto permitirá el movimiento entre columnas
    } else if (overVacante && activeVacante.estado === overVacante.estado) {
      // Arrastrar sobre una tarjeta en la misma columna
      // Esto permitirá el reordenamiento
    }
  };

  // Obtener la vacante activa para el overlay
  const activeVacante = activeId
    ? validVacantes.find((v) => v.id.toString() === activeId)
    : null;

  const isAnyFilterApplied =
    filters.searchTerm ||
    filters.reclutadorId ||
    filters.clienteId ||
    filters.tipo ||
    filters.fechaAsignacion.from ||
    filters.fechaAsignacion.to ||
    filters.año ||
    filters.mes ||
    filters.rangoMeses.from ||
    filters.rangoMeses.to;

  return (
    <>
      <KanbanFilters
        reclutadores={reclutadores}
        clientes={clientes}
        vacantes={allVacantes}
        onFilterChange={handleFilterChange}
      />
      <div className="flex flex-col h-[calc(100vh-200px)]">
        {/* Filter status indicator */}
        {isAnyFilterApplied && (
          <div className="px-6 py-3 flex flex-wrap gap-2 text-sm items-center border-b bg-muted/30">
            <span className="text-muted-foreground">
              Mostrando {validVacantes.length} de {allVacantes.length} vacantes
            </span>
          </div>
        )}

        {/* Loading indicator for filtering */}
        {isFilteringVacantes && (
          <div className="px-6 py-2 flex items-center justify-center bg-muted/20 border-b">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Aplicando filtros...</span>
            </div>
          </div>
        )}

        {isUpdating && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-3">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-gray-700 dark:text-gray-300">
                Actualizando vacante...
              </span>
            </div>
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToWindowEdges]}
        >
          <ScrollArea className="flex-1 pt-4">
            <div className="flex gap-14 h-full">
              {validVacantes.length === 0 ? (
                <div className="flex-1 flex items-center justify-center h-full  hhh-[calc(100vh-300px)]">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                      <Filter className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No se encontraron vacantes
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      No hay vacantes que coincidan con los filtros aplicados.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleFilterChange({
                          searchTerm: "",
                          reclutadorId: null,
                          clienteId: null,
                          tipo: null,
                          fechaAsignacion: { from: null, to: null },
                          año: null,
                          mes: null,
                          rangoMeses: { from: null, to: null },
                        })
                      }
                    >
                      Limpiar filtros
                    </Button>
                  </div>
                </div>
              ) : (
                columns.map(
                  (column) =>
                    (mobileView === null || mobileView === column.id) && (
                      <div
                        className="h-[calc(100vh-330px)] flex flex-col"
                        key={column.id}
                      >
                        <DroppableColumn
                          user_logged={user_logged}
                          key={column.id}
                          id={column.id}
                          title={column.title}
                          vacantes={validVacantes.filter(
                            (v) => v.estado === column.id
                          )}
                          onVacanteClick={setSelectedVacante}
                        />
                      </div>
                    )
                )
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeVacante ? (
              <DraggableVacanteCard
                vacante={activeVacante}
                onClick={() => {}}
                isDragging={true}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </>
  );
};
