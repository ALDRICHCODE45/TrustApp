"use client";

import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Clock, CheckCircle, Users, Calendar } from "lucide-react";
import { TaskStatus, User, Prisma } from "@prisma/client";
import {
  toggleTaskStatus,
  deleteTask,
  editTask,
  createTask,
} from "@/actions/tasks/actions";
import { toast } from "sonner";
import { TaskCard } from "./TaskCard";
import { AddTaskDialog } from "./AddTaskDialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Tipos
export type TaskWithUsers = Prisma.TaskGetPayload<{
  include: {
    assignedTo: true;
    notificationRecipients: true;
    linkedInteraction: {
      include: {
        contacto: true;
      };
    };
  };
}>;

interface EditData {
  title?: string;
  description?: string;
  dueDate?: Date;
}

interface Column {
  id: TaskStatus;
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface Props {
  user: User;
  initialTasks: TaskWithUsers[];
  sharedTasks?: TaskWithUsers[]; // Tareas compartidas contigo
}

const columns: Column[] = [
  {
    id: "Pending",
    title: "Pendientes",
    icon: <Clock className="w-4 h-4" />,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-900/10",
  },
  {
    id: "Done",
    title: "Completadas",
    icon: <CheckCircle className="w-4 h-4" />,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/10",
  },
];

// Componente simplificado para tareas compartidas
const SharedTaskCard = ({ task }: { task: TaskWithUsers }) => {
  const getDueDateStatus = () => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (task.status === "Done") {
      return {
        color: "text-green-600",
        label: "Completada",
        bgColor: "bg-green-100 dark:bg-green-900/20",
        percentage: "100%",
      };
    }

    if (diffDays < 0)
      return {
        color: "text-red-600",
        label: "Vencida",
        bgColor: "bg-red-100 dark:bg-red-900/20",
        percentage: "90%",
      };
    if (diffDays === 0)
      return {
        color: "text-orange-600",
        label: "Hoy",
        bgColor: "bg-orange-100 dark:bg-orange-900/20",
        percentage: "75%",
      };
    if (diffDays === 1)
      return {
        color: "text-yellow-600",
        label: "Mañana",
        bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
        percentage: "50%",
      };
    return {
      color: "text-blue-600",
      label: `${diffDays} días`,
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      percentage: "25%",
    };
  };

  const dueDateStatus = getDueDateStatus();

  return (
    <Card className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200">
      <div className="space-y-4">
        {/* Header con título y progreso */}
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm leading-tight line-clamp-2">
            {task.title}
          </h4>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
            {task.description}
          </p>

          {/* Indicador de progreso */}
          <div className="flex items-center justify-between">
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${dueDateStatus.bgColor} ${dueDateStatus.color}`}
            >
              {dueDateStatus.label}
            </div>
            <div className={`text-sm font-semibold ${dueDateStatus.color}`}>
              {dueDateStatus.percentage}
            </div>
          </div>
        </div>

        {/* Footer con creador y fecha */}
        <div className="flex items-center justify-between">
          {/* Fecha */}
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {format(new Date(task.dueDate), "d MMM", { locale: es })}
            </span>
          </div>

          {/* Creador */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Por: {task.assignedTo.name}
            </span>
            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Users className="w-3 h-3 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const TaskKanbanBoard = ({
  user,
  initialTasks,
  sharedTasks = [],
}: Props) => {
  const [tasks, setTasks] = useState<TaskWithUsers[]>(initialTasks);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Actualizar tasks cuando cambie initialTasks
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  // Filtrar tareas por estado
  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  // Manejar drag and drop
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const task = tasks.find((t) => t.id === draggableId);
    if (!task) return;

    // Si el movimiento es dentro de la misma columna (reordenamiento)
    if (destination.droppableId === source.droppableId) {
      const newTasks = Array.from(tasks);
      const sourceColumnTasks = newTasks.filter(
        (t) => t.status === source.droppableId
      );
      const otherTasks = newTasks.filter(
        (t) => t.status !== source.droppableId
      );

      // Reordenar dentro de la columna
      const [movedTask] = sourceColumnTasks.splice(source.index, 1);
      sourceColumnTasks.splice(destination.index, 0, movedTask);

      // Combinar todas las tareas manteniendo el orden
      const reorderedTasks = [...otherTasks, ...sourceColumnTasks];

      setTasks(reorderedTasks);
      toast.success("Orden actualizado");
      return;
    }

    // Si el movimiento es entre columnas diferentes (cambio de estado)
    const newStatus = destination.droppableId as TaskStatus;

    if (task.status !== newStatus) {
      // Actualizar optimisticamente el estado local
      const updatedTasks = tasks.map((t) =>
        t.id === draggableId ? { ...t, status: newStatus } : t
      );
      setTasks(updatedTasks);

      try {
        await toggleTaskStatus(user.id, draggableId);
        toast.success("Estado actualizado");
      } catch (error) {
        // Revertir cambio si hay error
        setTasks(tasks);
        toast.error("Error al actualizar");
      }
    }
  };

  // Función para cambiar el estado de una tarea
  const toggleActivityStatus = async (taskId: string) => {
    try {
      const promise = toggleTaskStatus(user.id, taskId);
      toast.promise(promise, {
        loading: "Actualizando...",
        success: "Estado actualizado",
        error: "Error al actualizar",
      });

      // Actualizar estado local optimistamente
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: task.status === "Pending" ? "Done" : "Pending",
              }
            : task
        )
      );
    } catch (error) {
      toast.error("Error al actualizar");
    }
  };

  // Función para eliminar una tarea
  const deleteActivity = async (taskId: string) => {
    try {
      const result = await deleteTask(user.id, taskId);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      toast.success("Tarea eliminada");
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  // Función para editar una tarea
  const onEdit = async (id: string, data: EditData) => {
    const formData = new FormData();
    formData.append("title", data.title!);
    formData.append("description", data.description!);
    formData.append("dueDate", data.dueDate?.toISOString()!);
    formData.append("userId", user.id);

    try {
      const promise = editTask(id, formData);
      toast.promise(promise, {
        loading: "Actualizando...",
        success: "Tarea editada",
        error: "Error al editar",
      });

      // Actualizar estado local optimistamente
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id
            ? {
                ...task,
                title: data.title || task.title,
                description: data.description || task.description,
                dueDate: data.dueDate || task.dueDate,
              }
            : task
        )
      );
    } catch (error) {
      toast.error("Error al editar");
    }
  };

  // Función para agregar una nueva tarea
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
      activityData.notifyOnComplete.toString()
    );
    activityData.notificationRecipients.forEach((recipientId) => {
      formData.append("notificationRecipients", recipientId);
    });

    try {
      const { ok, message } = await createTask(formData);
      if (!ok) {
        toast.error(message);
        return;
      }

      toast.success("Tarea creada");

      // Recargar para obtener las tareas ordenadas correctamente
      window.location.reload();
    } catch (error) {
      toast.error("Error al crear");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header minimalista */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm px-3 py-1.5 font-medium">
            {tasks.length} tareas
          </Badge>
          <Badge
            variant="secondary"
            className="text-sm px-3 py-1.5 font-medium"
          >
            {getTasksByStatus("Pending").length} pendientes
          </Badge>
          <Badge variant="default" className="text-sm px-3 py-1.5 font-medium">
            {getTasksByStatus("Done").length} completadas
          </Badge>
        </div>

        <AddTaskDialog
          onAddActivity={addActivity}
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      </div>

      {/* Kanban Board con 3 columnas */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columnas de tareas propias (con drag & drop) */}
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.id);

            return (
              <div key={column.id} className="space-y-4">
                {/* Header de columna */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${column.bgColor}`}>
                      {column.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                        {column.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {columnTasks.length}{" "}
                        {columnTasks.length === 1 ? "tarea" : "tareas"}
                      </p>
                    </div>
                  </div>

                  {column.id === "Pending" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setIsAddDialogOpen(true)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Contenido de la columna */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      className={`transition-colors rounded-lg ${
                        snapshot.isDraggingOver
                          ? "bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-600"
                          : ""
                      }`}
                    >
                      <ScrollArea className="h-[75vh] w-full rounded-lg">
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="min-h-[60vh] p-2"
                        >
                          <div className="space-y-3">
                            {columnTasks.map((task, index) => (
                              <Draggable
                                key={task.id}
                                draggableId={task.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`${
                                      snapshot.isDragging
                                        ? "rotate-2 shadow-xl opacity-95 scale-105"
                                        : ""
                                    } transition-all duration-200`}
                                  >
                                    <TaskCard
                                      activity={task}
                                      onToggleStatus={toggleActivityStatus}
                                      onDelete={deleteActivity}
                                      onEdit={onEdit}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>

                          {columnTasks.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                              <div
                                className={`p-4 rounded-lg ${column.bgColor} mb-3`}
                              >
                                {column.icon}
                              </div>
                              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                                No hay tareas {column.title.toLowerCase()}
                              </p>
                              {column.id === "Pending" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-sm"
                                  onClick={() => setIsAddDialogOpen(true)}
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Crear primera tarea
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}

          {/* Tercera columna: Tareas compartidas (sin drag & drop) */}
          <div className="space-y-4">
            {/* Header de columna compartidas */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/10">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                    Compartidas
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {sharedTasks.length}{" "}
                    {sharedTasks.length === 1 ? "tarea" : "tareas"}
                  </p>
                </div>
              </div>
            </div>

            {/* Contenido de tareas compartidas */}
            <ScrollArea className="h-[75vh] w-full rounded-lg">
              <div className="min-h-[60vh] p-2">
                <div className="space-y-3">
                  {sharedTasks.map((task) => (
                    <SharedTaskCard key={task.id} task={task} />
                  ))}
                </div>

                {sharedTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 mb-3">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No tienes tareas compartidas
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};
