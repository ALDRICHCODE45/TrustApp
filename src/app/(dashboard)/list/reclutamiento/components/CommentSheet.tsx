"use client";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  Clock,
  MessageCircleMore,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  AlertCircle,
  BellRing,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { z } from "zod";
import { User } from "@prisma/client";
import { toast } from "sonner";
import { useComments } from "@/hooks/useComments";
import { CommentWithRelations, CreateCommentData } from "@/types/comment";

// Schema para validación del formulario
const comentarioFormSchema = z
  .object({
    texto: z
      .string()
      .min(1, {
        message: "El comentario no puede estar vacío.",
      })
      .max(1000, {
        message: "El comentario no puede exceder 1000 caracteres.",
      }),
    esTarea: z.boolean(),
    // Campos específicos para tareas
    tituloTarea: z.string().optional(),
    descripcionTarea: z.string().optional(),
    fechaEntrega: z.date().optional(),
    notificarAlCompletar: z.boolean().optional(),
    destinatariosNotificacion: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      // Si es una tarea, los campos específicos son obligatorios
      if (data.esTarea) {
        return (
          data.tituloTarea &&
          data.tituloTarea.trim().length > 0 &&
          data.descripcionTarea &&
          data.descripcionTarea.trim().length > 0 &&
          data.fechaEntrega
        );
      }
      return true;
    },
    {
      message:
        "Los campos título, descripción y fecha son obligatorios para las tareas.",
      path: ["tituloTarea"],
    }
  );

// Tipo derivado del schema
type ComentarioFormData = z.infer<typeof comentarioFormSchema>;

interface CommentFormProps {
  isEditing?: boolean;
  comentarioInicial?: CommentWithRelations | null;
  onSubmitSuccess?: () => void;
  vacancyId?: string; // ID de la vacante a la que pertenece el comentario
}

export const CommentSheet = ({
  vacancyId,
  vacancyOwnerId,
}: {
  vacancyId: string;
  vacancyOwnerId: string;
}) => {
  const { comments, isLoading, error, addComment, deleteComment } =
    useComments(vacancyId);
  const [commentToDelete, setCommentToDelete] =
    useState<CommentWithRelations | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = (comment: CommentWithRelations) => {
    setCommentToDelete(comment);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!commentToDelete) return;

    try {
      await deleteComment(commentToDelete.id);
      toast.success("Comentario eliminado exitosamente");
      setIsDeleteDialogOpen(false);
      setCommentToDelete(null);
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Error al eliminar el comentario");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex justify-center items-center">
          <Button variant="outline" className="" size="default">
            <MessageCircleMore />
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent className="p-4">
        {/* Botón para abrir el diálogo */}
        <SheetHeader className="mt-7">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold"></p>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="mr-1 h-4 w-4" />
                  Agregar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto z-[200]">
                <DialogHeader>
                  <DialogTitle>Nuevo Comentario</DialogTitle>
                  <Separator />
                </DialogHeader>
                {/* Formulario dentro del diálogo */}
                <NuevoComentarioForm
                  vacancyId={vacancyId}
                  vacancyOwnerId={vacancyOwnerId}
                  onAddComment={addComment}
                  onSubmitSuccess={() => {
                    // El hook ya maneja la actualización automática
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </SheetHeader>

        {/* Lista de comentarios */}
        <div className="space-y-4 mt-6 h-[90%] overflow-y-auto pr-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 mb-2" />
              <p className="text-gray-500 dark:text-gray-400">
                Cargando comentarios...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <AlertCircle className="h-12 w-12 text-red-300 dark:text-red-600 mb-2" />
              <p className="text-red-500 dark:text-red-400">
                Error al cargar comentarios
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {error}
              </p>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <MessageCircleMore className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-gray-500 dark:text-gray-400">
                No hay comentarios
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Agrega un comentario usando el botón de arriba
              </p>
            </div>
          ) : (
            comments.map((comentario, index) => (
              <Card
                key={index}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="p-3 pb-1 flex flex-row justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "flex items-center gap-1",
                        comentario.taskId
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                          : "bg-gray-50 dark:bg-gray-800/30 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                      )}
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          comentario.taskId
                            ? "bg-blue-600 dark:bg-blue-400"
                            : "bg-gray-500 dark:bg-gray-400"
                        )}
                      ></div>
                      {comentario.taskId ? "Tarea" : "Comentario"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <p className="text-xs text-gray-400">
                      Lun {format(comentario.createdAt, "EEE dd/MM/yy")} •{" "}
                      {format(comentario.createdAt, "HH:mm")}
                    </p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4 text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() => handleDelete(comentario)}
                          className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Eliminar</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {comentario.content}
                  </p>
                </CardContent>
                <CardFooter className="flex flex-row items-center justify-between w-full p-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-400">
                    By:{" "}
                    <span className="text-gray-500 dark:text-gray-300">
                      {comentario.author.name} {comentario.author.role}
                    </span>
                  </p>
                  {comentario.taskId && (
                    <p className="text-xs text-gray-400">
                      Entrega:{" "}
                      <span className="font-medium text-gray-600 dark:text-gray-300">
                        {format(comentario.createdAt, "EEE dd/MM/yy")}
                      </span>
                    </p>
                  )}
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </SheetContent>

      {/* Dialog para confirmar eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              Confirmar eliminación
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar este comentario? Esta acción no
            se puede deshacer.
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
};

export const NuevoComentarioForm = ({
  isEditing = false,
  comentarioInicial = null,
  onSubmitSuccess = () => {},
  vacancyId,
  vacancyOwnerId,
  onAddComment,
}: CommentFormProps & {
  onAddComment?: (commentData: CreateCommentData) => Promise<any>;
  vacancyOwnerId: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const form = useForm<ComentarioFormData>({
    resolver: zodResolver(comentarioFormSchema),
    defaultValues: {
      texto: comentarioInicial?.content || "",
      esTarea: comentarioInicial?.taskId ? true : false,
      tituloTarea: "",
      descripcionTarea: "",
      fechaEntrega: comentarioInicial?.createdAt
        ? new Date(comentarioInicial.createdAt)
        : undefined,
      notificarAlCompletar: false,
      destinatariosNotificacion: [],
    },
  });

  const esTarea = form.watch("esTarea");
  const notificarAlCompletar = form.watch("notificarAlCompletar");
  const destinatariosSeleccionados =
    form.watch("destinatariosNotificacion") || [];

  // Cargar usuarios cuando se abre el formulario y es una tarea
  useEffect(() => {
    const fetchUsers = async () => {
      if (!esTarea) return;

      setIsLoadingUsers(true);
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Error al cargar usuarios");
      } finally {
        setIsLoadingUsers(false);
      }
    };

    if (esTarea) {
      fetchUsers();
    }
  }, [esTarea]);

  const removeUser = (userIdToRemove: string) => {
    const currentUsers = form.getValues("destinatariosNotificacion") || [];
    form.setValue(
      "destinatariosNotificacion",
      currentUsers.filter((id) => id !== userIdToRemove)
    );
  };

  const onSubmit = async (data: ComentarioFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(
        isEditing ? "Editando comentario:" : "Nuevo comentario:",
        data
      );

      // Preparar los datos para enviar al servidor
      const commentData: CreateCommentData = {
        content: data.texto,
        authorId: vacancyOwnerId,
        vacancyId: vacancyId,
        isTask: data.esTarea,
        title: data.tituloTarea,
        description: data.descripcionTarea,
        assignedToId: vacancyOwnerId,
        dueDate: data.fechaEntrega,
        notifyOnComplete: data.notificarAlCompletar || false,
        notificationRecipients: data.destinatariosNotificacion || [],
      };

      // Usar la función del hook si está disponible, sino usar la API directamente
      if (onAddComment) {
        await onAddComment(commentData);
      } else {
        const response = await fetch("/api/comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(commentData),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Error al crear el comentario");
        }

        if (!result.ok) {
          throw new Error(result.message || "Error al crear el comentario");
        }
      }

      toast.success("Comentario creado exitosamente");
      onSubmitSuccess();

      // Limpiar formulario solo si es nuevo comentario
      if (!isEditing) {
        form.reset();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al procesar el comentario";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Mostrar error si existe */}
        {error && (
          <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="texto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comentario</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Escribe tu comentario aquí..."
                  className="resize-none min-h-24"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <div className="flex justify-between items-center">
                <FormMessage />
                <p className="text-xs text-gray-500">
                  {field.value.length}/1000 caracteres
                </p>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="esTarea"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Marcar como tarea</FormLabel>
                <FormDescription>
                  Las tareas requieren título, descripción y fecha límite
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {esTarea && (
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Información de la tarea</span>
            </div>

            <FormField
              control={form.control}
              name="tituloTarea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Título de la tarea
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Terminar proyecto de React"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descripcionTarea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Descripción de la tarea
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe los detalles de la tarea..."
                      className="resize-none min-h-20"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fechaEntrega"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Fecha límite
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isLoading}
                      >
                        {field.value ? (
                          format(field.value, "d 'de' MMMM, yyyy", {
                            locale: es,
                          })
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[8888]">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notificarAlCompletar"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <BellRing className="h-4 w-4" />
                      <FormLabel>Notificar al completar</FormLabel>
                    </div>
                    <FormDescription>
                      Al activar esta opción los usuarios serán notificados
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {notificarAlCompletar && (
              <FormField
                control={form.control}
                name="destinatariosNotificacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destinatarios de la notificación</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const currentUsers = field.value || [];
                        if (!currentUsers.includes(value)) {
                          field.onChange([...currentUsers, value]);
                        }
                      }}
                      disabled={isLoading || isLoadingUsers}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingUsers
                                ? "Cargando usuarios..."
                                : "Seleccionar usuarios"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-[9999]">
                        {users.map((user) => (
                          <SelectItem
                            key={user.id}
                            value={user.id}
                            disabled={destinatariosSeleccionados.includes(
                              user.id
                            )}
                          >
                            {user.name}
                          </SelectItem>
                        ))}
                        {users.length === 0 && !isLoadingUsers && (
                          <SelectItem value="" disabled>
                            No hay usuarios disponibles
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>

                    {destinatariosSeleccionados.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {destinatariosSeleccionados.map((userId) => {
                          const user = users.find((u) => u.id === userId);
                          return (
                            <Badge
                              key={userId}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {user?.name || "Usuario desconocido"}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 hover:bg-transparent"
                                onClick={() => removeUser(userId)}
                                disabled={isLoading}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => onSubmitSuccess()}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading || !form.formState.isValid}>
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
                Procesando...
              </>
            ) : isEditing ? (
              "Guardar cambios"
            ) : (
              "Guardar"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
