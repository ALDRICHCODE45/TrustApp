"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/lib/data";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  CalendarIcon,
  CheckCircle,
  CircleCheck,
  ClipboardList,
  Clock,
  MoreVertical,
  Plus,
  SquarePen,
  Trash2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { cn } from "../../../../../lib/utils";
import { Calendar } from "@/components/ui/calendar";

// Interfaces
export interface Activity {
  id: number;
  title: string;
  dueDate: string;
  description: string;
  completed: boolean;
}

// Componente para formatear fechas
const FormattedDate = ({ dateString }: { dateString: string }) => {
  const formatDate = (date: string) => {
    return format(new Date(date), "d 'de' MMMM, yyyy", { locale: es });
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">
        {formatDate(dateString)}
      </span>
    </div>
  );
};

// Componente para el diálogo de eliminación
const DeleteActivityDialog = ({
  activityId,
  onDelete,
}: {
  activityId: number;
  onDelete: (id: number) => void;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="cursor-pointer text-destructive"
        >
          <Trash2 size={4} />
          Eliminar
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent className="z-[999]">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => onDelete(activityId)}>
            Sí, eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Componente para el menú de acciones
const ActivityActions = ({
  activity,
  onToggleStatus,
  onDelete,
}: {
  activity: Activity;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <span className="sr-only">Abrir Menú</span>
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[50]" align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => onToggleStatus(activity.id)}
          className="cursor-pointer"
        >
          {activity.completed ? (
            <>
              <XCircle />
              Marcar como pendiente
            </>
          ) : (
            <>
              <CircleCheck />
              Completar
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <SquarePen />
          Editar
        </DropdownMenuItem>
        <DeleteActivityDialog activityId={activity.id} onDelete={onDelete} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Componente de Card de Actividad
const ActivityCard = ({
  activity,
  onToggleStatus,
  onDelete,
}: {
  activity: Activity;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
}) => {
  const borderColor = activity.completed
    ? "border-l-emerald-400"
    : "border-l-amber-400";

  return (
    <Card
      className={`p-3 border-l-4 ${borderColor} hover:bg-muted/50 transition-colors`}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <h4
            className={`font-medium ${activity.completed ? "line-through text-muted-foreground" : ""}`}
          >
            {activity.title}
          </h4>
          <p
            className={`text-sm ${activity.completed ? "line-through text-muted-foreground/70" : "text-muted-foreground"} mt-1`}
          >
            {activity.description}
          </p>
          {activity.completed ? (
            <div className="flex items-center gap-2 mt-2">
              <Clock className="w-4 h-4 text-muted-foreground/70" />
              <span className="text-xs text-muted-foreground/70">
                Completada
              </span>
            </div>
          ) : (
            <FormattedDate dateString={activity.dueDate} />
          )}
        </div>
        <ActivityActions
          activity={activity}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      </div>
    </Card>
  );
};

// Componente de mensaje vacío
const EmptyState = ({ type }: { type: "pending" | "completed" }) => {
  return (
    <div className="flex flex-col items-center justify-center h-60 text-center">
      {type === "pending" ? (
        <CheckCircle className="h-10 w-10 text-primary/50 mb-2" />
      ) : (
        <ClipboardList className="h-10 w-10 text-primary/50 mb-2" />
      )}
      <p className="text-muted-foreground">
        No hay actividades {type === "pending" ? "pendientes" : "completadas"}
      </p>
    </div>
  );
};

// Componente de lista de actividades
const ActivitiesList = ({
  activities,
  onToggleStatus,
  onDelete,
}: {
  activities: Activity[];
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
}) => {
  return (
    <ScrollArea className="max-h-[500px] rounded-md border p-2 overflow-y-auto">
      <div className="space-y-3">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
            />
          ))
        ) : (
          <EmptyState
            type={activities[0]?.completed ? "completed" : "pending"}
          />
        )}
      </div>
    </ScrollArea>
  );
};

// Componente principal
export const ActivityProfileSheet = ({ user }: { user: User }) => {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      title: "Finalizar proyecto de React",
      dueDate: "2025-02-15",
      description:
        "Completar la implementación del dashboard y los tests finales.",
      completed: false,
    },
    {
      id: 2,
      title: "Estudiar para el examen de matemáticas",
      dueDate: "2025-02-18",
      description: "Revisar álgebra, cálculo y geometría analítica.",
      completed: false,
    },
    {
      id: 3,
      title: "Entregar app",
      dueDate: "2025-02-18",
      description: "Revisar álgebra, cálculo y geometría analítica.",
      completed: false,
    },
    {
      id: 4,
      title: "Preparar exposición de historia",
      dueDate: "2025-02-20",
      description:
        "Investigar sobre la Revolución Francesa y elaborar diapositivas.",
      completed: false,
    },
    {
      id: 5,
      title: "Redactar ensayo de literatura",
      dueDate: "2025-02-22",
      description: "Analizar la obra 'Cien años de soledad' y su impacto.",
      completed: false,
    },
    {
      id: 6,
      title: "Estudiar para el examen de química",
      dueDate: "2025-02-25",
      description: "Revisar estructura molecular y tabla periódica.",
      completed: false,
    },
    {
      id: 7,
      title: "Finalizar proyecto de programación",
      dueDate: "2025-02-28",
      description: "Completar la interfaz de usuario y optimizar el backend.",
      completed: false,
    },
    {
      id: 8,
      title: "Revisar notas de biología",
      dueDate: "2025-03-02",
      description: "Estudiar ecosistemas y cadenas tróficas.",
      completed: true,
    },
    {
      id: 9,
      title: "Hacer práctica de estadística",
      dueDate: "2025-03-05",
      description:
        "Resolver problemas de distribución normal y regresión lineal.",
      completed: false,
    },
    {
      id: 10,
      title: "Organizar documentos",
      dueDate: "2025-03-07",
      description: "Clasificar notas y documentos importantes.",
      completed: true,
    },
  ]);

  // Función para cambiar el estado de una actividad
  const toggleActivityStatus = (id: number) => {
    setActivities(
      activities.map((activity) =>
        activity.id === id
          ? { ...activity, completed: !activity.completed }
          : activity,
      ),
    );
    toast.info("Estado de tarea actualizado correctamente");
  };

  // Función para eliminar una actividad
  const deleteActivity = (id: number) => {
    setActivities(activities.filter((activity) => activity.id !== id));
    toast("Tarea eliminada correctamente");
  };

  // Filtrar actividades
  const pendingActivities = activities.filter(
    (activity) => !activity.completed,
  );
  const completedActivities = activities.filter(
    (activity) => activity.completed,
  );

  const addActivity = (activityData: Omit<Activity, "id" | "completed">) => {
    // Encontrar el ID más alto para crear uno nuevo (incrementado en 1)
    const maxId =
      activities.length > 0
        ? Math.max(...activities.map((activity) => activity.id))
        : 0;

    const newActivity: Activity = {
      ...activityData,
      id: maxId + 1,
      completed: false,
    };

    setActivities([newActivity, ...activities]);
  };

  return (
    <div className="mt-4 md:mt-0">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            <span>Actividades</span>
            {pendingActivities.length > 0 && (
              <Badge variant="secondary">{pendingActivities.length}</Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Actividades de {user?.name}</SheetTitle>
            <SheetDescription>
              Gestiona las actividades y tareas pendientes.
            </SheetDescription>
          </SheetHeader>

          <Tabs defaultValue="pending" className="mt-6">
            <TabsList className="w-full grid grid-cols-2 h-full">
              <TabsTrigger value="pending" className="text-xs md:text-base">
                Pendientes ({pendingActivities.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs md:text-base">
                Completadas ({completedActivities.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-4">
              <ActivitiesList
                activities={pendingActivities}
                onToggleStatus={toggleActivityStatus}
                onDelete={deleteActivity}
              />
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              <ActivitiesList
                activities={completedActivities}
                onToggleStatus={toggleActivityStatus}
                onDelete={deleteActivity}
              />
            </TabsContent>
          </Tabs>

          <SheetFooter className="flex flex-row justify-between items-center w-full mt-6">
            <AddActivityDialog onAddActivity={addActivity} />
            <SheetClose asChild>
              <Button size="sm">
                <span className="text-xs md:text-base">Cerrar</span>
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

// Componente AddActivityDialog.tsx
interface AddActivityDialogProps {
  onAddActivity: (activity: Omit<Activity, "id" | "completed">) => void;
}

export const AddActivityDialog = ({
  onAddActivity,
}: AddActivityDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Por favor, añade un título para la tarea");
      return;
    }

    if (!date) {
      toast.error("Por favor, selecciona una fecha límite");
      return;
    }

    // Formatear la fecha a YYYY-MM-DD para consistencia con el formato existente
    const formattedDate = format(date, "yyyy-MM-dd");

    onAddActivity({
      title,
      description,
      dueDate: formattedDate,
    });

    // Limpiar el formulario
    setTitle("");
    setDescription("");
    setDate(new Date());
    setOpen(false);

    toast.success("Tarea creada correctamente");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          <span className="text-xs md:text-base">Agregar Actividad</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md z-[888]">
        <DialogHeader>
          <DialogTitle>Nueva actividad</DialogTitle>
          <DialogDescription>
            Crea una nueva tarea o actividad para tu lista.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-left">
                Título
              </Label>
              <Input
                id="title"
                placeholder="Ej: Terminar proyecto de React"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-left">
                Descripción
              </Label>
              <Textarea
                id="description"
                placeholder="Describe los detalles de la tarea..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3 resize-none min-h-[80px]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dueDate" className="text-left">
                Fecha límite
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon />
                    {date ? (
                      format(date, "d 'de' MMMM, yyyy", { locale: es })
                    ) : (
                      <span>Selecciona una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[900]">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Crear tarea</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
