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
import { Comentario } from "@/lib/data";
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
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
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
import { useState } from "react";
import { z } from "zod";

// Schema para validación del formulario
const comentarioFormSchema = z.object({
  texto: z.string().min(1, {
    message: "El comentario no puede estar vacío.",
  }),
  esTarea: z.boolean(),
  fechaEntrega: z.date().optional(),
});

// Tipo derivado del schema

interface ComentarioFormProps {
  isEditing?: boolean;
  comentarioInicial?: Comentario | null;
  onSubmitSuccess?: () => void;
}

export const CommentSheet = ({ comments }: { comments: Comentario[] }) => {
  const [commentToDelete, setCommentToDelete] = useState<Comentario | null>(
    null,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = (comment: Comentario) => {
    setCommentToDelete(comment);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log("Eliminando comentario:", commentToDelete);
    // Aquí iría la lógica para eliminar el comentario
    setIsDeleteDialogOpen(false);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <MessageCircleMore />
        </Button>
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
              <DialogContent className="sm:max-w-[425px] z-[200]">
                <DialogHeader>
                  <DialogTitle>Nuevo Comentario</DialogTitle>
                  <Separator />
                </DialogHeader>
                {/* Formulario dentro del diálogo */}
                <NuevoComentarioForm />
              </DialogContent>
            </Dialog>
          </div>
        </SheetHeader>

        {/* Lista de comentarios */}
        <div className="space-y-4 mt-6 h-[90%] overflow-y-auto pr-1">
          {comments.length === 0 ? (
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
                        comentario.tipo === "Tarea"
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                          : "bg-gray-50 dark:bg-gray-800/30 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700",
                      )}
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          comentario.tipo === "Tarea"
                            ? "bg-blue-600 dark:bg-blue-400"
                            : "bg-gray-500 dark:bg-gray-400",
                        )}
                      ></div>
                      {comentario.tipo}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <p className="text-xs text-gray-400">
                      Lun {comentario.fecha} • {comentario.hora}
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
                    {comentario.texto}
                  </p>
                </CardContent>
                <CardFooter className="flex flex-row items-center justify-between w-full p-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-400">
                    By:{" "}
                    <span className="text-gray-500 dark:text-gray-300">
                      {comentario.autor.name} {comentario.autor.rol}
                    </span>
                  </p>
                  {comentario.tipo === "Tarea" && comentario.fechaEntrega && (
                    <p className="text-xs text-gray-400">
                      Entrega:{" "}
                      <span className="font-medium text-gray-600 dark:text-gray-300">
                        {comentario.fechaEntrega}
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
}: ComentarioFormProps) => {
  const form = useForm({
    defaultValues: {
      texto: comentarioInicial?.texto || "",
      esTarea: comentarioInicial?.tipo === "Tarea" || false,
      fechaEntrega: comentarioInicial?.fechaEntrega
        ? new Date(comentarioInicial.fechaEntrega)
        : undefined,
    },
  });
  const esTarea = form.watch("esTarea");

  const onSubmit = (data: any) => {
    console.log(isEditing ? "Editando comentario:" : "Nuevo comentario:", data);
    // Aquí iría la lógica para guardar o editar el comentario
    onSubmitSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  {...field}
                />
              </FormControl>
              <FormMessage />
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
                  Las tareas requieren una fecha de entrega
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {esTarea && (
          <FormField
            control={form.control}
            name="fechaEntrega"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de entrega</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "EEE dd/MM/yy", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[8888]">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
        )}
        <div className="flex justify-end space-x-2 pt-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => onSubmitSuccess()}
          >
            Cancelar
          </Button>
          <Button type="submit">
            {isEditing ? "Guardar cambios" : "Guardar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
