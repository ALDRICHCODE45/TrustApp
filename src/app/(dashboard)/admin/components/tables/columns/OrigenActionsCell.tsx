"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Ban, Loader2, MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { Row } from "@tanstack/react-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  deleteLeadById,
  deleteOrigenById,
  editOrigen,
} from "@/actions/leads/actions";
import { LeadOrigen } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";

interface Inputs {
  nombre: string;
  id: string;
}

export const OrigenActionsCell = ({ row }: { row: Row<LeadOrigen> }) => {
  const [isLoading, setIsloading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      nombre: row.original.nombre,
      id: row.original.id,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsloading(true);
    const formData = new FormData();
    formData.append("newName", data.nombre);
    formData.append("origenId", data.id);

    const { ok, message } = await editOrigen(formData);

    if (!ok) {
      toast.error("Error", {
        description: "Ha ocurrido un error al editar el origen",
        duration: 5000,
        icon: <Ban />,
      });
      return;
    }

    try {
      toast.success("Origen Editado", {
        description: "El origen ha sido editado exitosamente",
        duration: 5000,
      });
    } catch (err) {
      toast.error("Error", {
        description: "Ha ocurrido un error al editar el origen",
        duration: 5000,
        icon: <Ban />,
      });
    } finally {
      setIsloading(false);
    }
  };
  // Estado para controlar la visibilidad del diálogo y del dropdown
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleEditClick = () => {
    setIsMenuOpen(false); // Cierra el menú antes de abrir el diálogo
    setIsDialogOpen(true);
  };

  const handleDeletelead = async (id: string) => {
    const formData = new FormData();
    formData.append("origenId", id);
    try {
      const { ok, message } = await deleteOrigenById(formData);
      if (!ok) {
        toast.error("Error", {
          description: "Ah ocurrido un error al eliminar el origen",
          duration: 5000,
        });
        return;
      }

      toast.success("Operacion Exitosa", {
        description: "El origen ha sido eliminado exitosamente",
        duration: 5000,
      });
    } catch (error) {
      toast.error("Error al eliminar el origen");
    }
  };

  return (
    <>
      {/* Dropdown Menu */}
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-40" align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleEditClick}
            className="cursor-pointer"
            onSelect={(e) => e.preventDefault()}
          >
            <SquarePen className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer text-red-500 bg-red-100"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminará
                  permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeletelead(row.original.id)}
                >
                  Sí, eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Diálogo de edición */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="border-b border-border px-6 py-4 text-base">
              Editar origen
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Realiza los cambios en este apartado
          </DialogDescription>

          {/* Using the extracted form component here */}
          <div className="px-10 py-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="nombre" className="mt-3">
                    Nombre
                  </Label>
                  <Input
                    {...register("nombre", {
                      required: true,
                      minLength: {
                        value: 3,
                        message: "Ingrese minimo 3 caracteres",
                      },
                    })}
                    id="nombre"
                    name="nombre"
                    placeholder="eje: linkedin"
                  />

                  {errors.nombre?.message ? (
                    <span className="text-red-500 text-sm">
                      {errors.nombre.message}
                    </span>
                  ) : null}
                </div>
              </div>
              <DialogFooter className="mt-5">
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit" size="sm">
                  {isLoading ? (
                    <>
                      <Loader2 /> Cargando..
                    </>
                  ) : (
                    <p>Guardar Cambios</p>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
