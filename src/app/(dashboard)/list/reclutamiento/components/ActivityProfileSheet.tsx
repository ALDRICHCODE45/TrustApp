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
import { Prisma, Task, TaskStatus, User } from "@prisma/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertTriangle,
  CalendarIcon,
  CheckCircle,
  CircleCheck,
  ClipboardList,
  Clock,
  Edit,
  MoreVertical,
  Plus,
  SquarePen,
  Trash2,
  XCircle,
  X,
  BellRing,
} from "lucide-react";
import { useState, useEffect } from "react";
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
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  createTask,
  deleteTask,
  editTask,
  toggleTaskStatus,
} from "@/actions/tasks/actions";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

// Interfaces
export interface Activity {
  id: number;
  title: string;
  dueDate: string;
  description: string;
  completed: boolean;
}
interface EditData {
  title?: string;
  description?: string;
  dueDate?: Date;
}
export type TaskWithUsers = Prisma.TaskGetPayload<{
  include: {
    assignedTo: true;
    notificationRecipients: true;
  };
}>;

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

const EditActivityDialog = ({
  activityId,
  onEdit,
  activity,
}: {
  activityId: string;
  onEdit: (id: string, EditData: EditData) => void;
  activity: TaskWithUsers;
}) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(activity.title || "");
  const [description, setDescription] = useState(activity.description || "");
  const [date, setDate] = useState<Date | undefined>(
    new Date(activity.dueDate) || new Date(),
  );

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

    if (!description.trim()) {
      toast.error("Por favor añade una description para la tarea");
      return;
    }

    if (!date) {
      toast.error("Por favor, selecciona una fecha límite");
      return;
    }

    // Formatear la fecha a YYYY-MM-DD para consistencia con el formato existente
    const formattedDate = format(date, "yyyy-MM-dd");

    onEdit(activityId, { description, title, dueDate: date });

    // Limpiar el formulario
    setTitle("");
    setDescription("");
    setDate(new Date());
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full">
        <div className="flex items-center pl-2">
          <Edit className="mr-2" size={15} />
          <span className="text-sm">Editar </span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md z-[888]">
        <DialogHeader>
          <DialogTitle>Nueva actividad</DialogTitle>
          <DialogDescription>
            Edita los campos correspondientes
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
            <Button type="submit">Editar tarea</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Componente para el diálogo de eliminación
const DeleteActivityDialog = ({
  activityId,
  onDelete,
}: {
  activityId: string;
  onDelete: (id: string) => void;
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

const ActivityActions = ({
  activity,
  onToggleStatus,
  onDelete,
  onEdit,
}: {
  activity: TaskWithUsers;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, editData: EditData) => void;
}) => {
  const isTaskDone = activity.status === "Done";
  const [alertOpen, setAlertOpen] = useState(false);

  const handleToggleStatus = () => {
    setAlertOpen(false);
    onToggleStatus(activity.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <span className="sr-only">Abrir Menú</span>
          <MoreVertical className="text-black" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[50]" align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                setAlertOpen(true);
              }}
              className="cursor-pointer"
            >
              {isTaskDone ? (
                <>
                  <XCircle className="size-4" />
                  Marcar como pendiente
                </>
              ) : (
                <>
                  <CircleCheck className="size-4" />
                  Completar
                </>
              )}
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isTaskDone ? "¿Marcar como pendiente?" : "¿Completar tarea?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isTaskDone
                  ? "¿Estás seguro de que quieres marcar esta tarea como pendiente?"
                  : "¿Estás seguro de que quieres marcar esta tarea como completada?"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleToggleStatus}>
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <DropdownMenuSeparator />
        <EditActivityDialog
          activityId={activity.id}
          onEdit={onEdit}
          activity={activity}
        />
        <DeleteActivityDialog activityId={activity.id} onDelete={onDelete} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ActivityCard = ({
  activity,
  onToggleStatus,
  onDelete,
  onEdit,
}: {
  activity: TaskWithUsers;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, editData: EditData) => void;
}) => {
  const isTaskDone = activity.status === TaskStatus.Done;

  // Función para calcular días restantes y determinar el estilo
  const getDueDateStyle = () => {
    if (isTaskDone) {
      return {
        borderColor: "border-l-emerald-400",
        bgColor: "",
        textColor: "",
      };
    }

    // Calcular días restantes
    const today = new Date();
    const dueDate = new Date(activity.dueDate);
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Asignar colores según días restantes
    if (daysLeft > 5) {
      return {
        borderColor: "border-l-blue-500",
        bgColor: "",
        textColor: "",
      };
    } else if (daysLeft >= 3) {
      return {
        borderColor: "border-l-amber-400",
        bgColor: "",
        textColor: "",
      };
    } else {
      return {
        borderColor: "border-l-red-500",
        bgColor: "bg-red-50",
        textColor: "text-red-700",
      };
    }
  };

  const styles = getDueDateStyle();

  return (
    <Card className={`p-3 border-l-4 ${styles.borderColor} ${styles.bgColor}`}>
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <h4
            className={`font-medium ${isTaskDone ? "line-through text-muted-foreground" : styles.textColor}`}
          >
            {activity.title}
          </h4>
          <p
            className={`text-sm ${isTaskDone ? "line-through text-muted-foreground/70" : "text-muted-foreground"} mt-1`}
          >
            {activity.description}
          </p>
          {isTaskDone ? (
            <div className="flex items-center gap-2 mt-2">
              <Clock className="w-4 h-4 text-muted-foreground/70" />
              <span className="text-xs text-muted-foreground/70">
                Completada
              </span>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <FormattedDate dateString={activity.dueDate.toISOString()} />
              {styles.textColor === "text-red-700" && (
                <div className="flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-medium text-red-500">
                    Urgente
                  </span>
                </div>
              )}
            </div>
          )}
          {activity.notificationRecipients.length > 0 ? (
            <div className="flex -space-x-[0.650rem] mt-3">
              {activity.notificationRecipients.map((user) => (
                <Tooltip key={user.id}>
                  <TooltipTrigger>
                    <Link href={`/profile/${user.id}`}>
                      <img
                        className="ring-background rounded-full ring-2"
                        src={
                          user.image ??
                          `https://gremcorpsarpg.com/images/avatars/default.jpg `
                        }
                        width={28}
                        height={28}
                        alt="Avatar 01"
                      />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>{user.name}</span>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          ) : null}
        </div>
        <ActivityActions
          activity={activity}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      </div>
    </Card>
  );
};

// Componente de mensaje vacío
const EmptyState = ({ type }: { type: TaskStatus }) => {
  return (
    <div className="flex flex-col items-center justify-center h-60 text-center">
      {type === "Pending" ? (
        <CheckCircle className="h-10 w-10 text-primary/50 mb-2" />
      ) : (
        <ClipboardList className="h-10 w-10 text-primary/50 mb-2" />
      )}
      <p className="text-muted-foreground">
        No hay actividades {type === "Pending" ? "pendientes" : "completadas"}
      </p>
    </div>
  );
};

// Componente de lista de actividades CORREGIDO
const ActivitiesList = ({
  activities,
  onToggleStatus,
  onDelete,
  onEdit,
}: {
  activities: TaskWithUsers[];
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, editData: EditData) => void;
}) => {
  return (
    <div className="h-[500px] w-full">
      <ScrollArea className="h-full w-full rounded-md border">
        <div className="p-4 space-y-3">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <ActivityCard
                onEdit={onEdit}
                key={activity.id}
                activity={activity}
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
              />
            ))
          ) : (
            <EmptyState
              type={activities[0]?.status === "Done" ? "Done" : "Pending"}
            />
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
// Componente principal
export const ActivityProfileSheet = ({
  user,
  tasks,
}: {
  user: User;
  tasks: TaskWithUsers[];
}) => {
  // Función para cambiar el estado de una actividad
  const toggleActivityStatus = async (taskId: string) => {
    try {
      const promise = toggleTaskStatus(user.id, taskId);
      toast.promise(promise, {
        loading: "Loading...",
        success: (data) => {
          return `Tarea editada correctamente`;
        },
        error: "Error al editar la tarea, revisa los logs",
      });
    } catch (error) {
      toast.error("Error al editar la tarea");
    }
  };

  // Función para eliminar una actividad
  const deleteActivity = async (taskId: string) => {
    try {
      const result = await deleteTask(user.id, taskId);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success("Tarea eliminada correctamente");
    } catch (error) {
      toast.error("Error al eliminar la tarea");
    }
  };

  // Filtrar actividades
  const pendingActivities = tasks.filter(
    (activity) => activity.status === "Pending",
  );
  const completedActivities = tasks.filter(
    (activity) => activity.status === "Done",
  );

  const addActivity = async (activityData: {
    title: string;
    description: string;
    dueDate: Date;
    notifyOnComplete: boolean;
    notificationRecipients: string[];
  }) => {
    const formData = new FormData();
    formData.append("title", activityData.title);
    formData.append("description", activityData.description);
    formData.append("dueDate", activityData.dueDate.toISOString());
    formData.append("userId", user.id);
    formData.append(
      "notifyOnComplete",
      activityData.notifyOnComplete.toString(),
    );
    activityData.notificationRecipients.forEach((recipientId) => {
      formData.append("notificationRecipients", recipientId);
    });
    console.log("Client Data: ", { formData });

    try {
      const { ok, message } = await createTask(formData);
      if (!ok) {
        toast.error(message);
        console.log(message);
        return;
      }
      toast.success("Tarea creada satisfactoriamente!!");
    } catch (error) {
      toast.error("Error al crear la task");
    }
  };

  const onEdit = async (id: string, data: EditData) => {
    const formData = new FormData();

    formData.append("title", data.title!);
    formData.append("description", data.description!);
    formData.append("dueDate", data.dueDate?.toISOString()!);
    formData.append("userId", user.id);

    try {
      const promise = editTask(id, formData);
      toast.promise(promise, {
        loading: "Loading...",
        success: () => {
          return `Tarea editada correctamente`;
        },
        error: "Error al editar la tarea",
      });
    } catch (error) {
      console.log(error);
      toast.error("Error editando la tarea");
    }
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
                onEdit={onEdit}
              />
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              <ActivitiesList
                activities={completedActivities}
                onToggleStatus={toggleActivityStatus}
                onDelete={deleteActivity}
                onEdit={onEdit}
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
  onAddActivity: (activity: {
    title: string;
    description: string;
    dueDate: Date;
    notifyOnComplete: boolean;
    notificationRecipients: string[];
  }) => void;
}

export const AddActivityDialog = ({
  onAddActivity,
}: AddActivityDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Cargar usuarios para el selector
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

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

    if (!description.trim()) {
      toast.error("Por favor añade una description para la tarea");
      return;
    }

    if (!date) {
      toast.error("Por favor, selecciona una fecha límite");
      return;
    }

    onAddActivity({
      title,
      description,
      dueDate: date,
      notifyOnComplete: notificationsEnabled,
      notificationRecipients: selectedUsers,
    });

    // Limpiar el formulario
    setTitle("");
    setDescription("");
    setDate(new Date());
    setNotificationsEnabled(false);
    setSelectedUsers([]);
    setOpen(false);
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

            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
                  <Switch
                    id="notifications"
                    className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                    aria-describedby={`$notifications-description`}
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                  <div className="flex grow items-center gap-3">
                    <BellRing />
                    <div className="grid grow gap-2">
                      <Label htmlFor="notifications">
                        Notificar{" "}
                        <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
                          (Al completar)
                        </span>
                      </Label>
                      <p
                        id={`$notifications-description`}
                        className="text-muted-foreground text-xs"
                      >
                        Al activar esta opcion los usuarios seran notificados
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {notificationsEnabled && (
                <div className="space-y-2">
                  <Label>Destinatarios de la notificación</Label>
                  <Select
                    onValueChange={(value) => {
                      if (!selectedUsers.includes(value)) {
                        setSelectedUsers([...selectedUsers, value]);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar usuarios" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedUsers.map((userId) => {
                        const user = users.find((u) => u.id === userId);
                        return (
                          <Badge
                            key={userId}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {user?.name}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() =>
                                setSelectedUsers(
                                  selectedUsers.filter((id) => id !== userId),
                                )
                              }
                            />
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
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
