"use client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Clipboard, MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { VacancyWithRelations } from "@/app/(dashboard)/reclutador/components/ReclutadorColumns";
import { EditVacancyForm } from "./EditVacancyForm";
import { toast } from "sonner";
import { ToastCustomMessage } from "@/components/ToastCustomMessage";
import { deleteVacancy } from "@/actions/vacantes/actions";

export const ActionsRecruitment = ({
  row,
}: {
  row: Row<VacancyWithRelations>;
}) => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);

  const handleEdit = () => {
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleDeleteVacancy = async (vacancyId: string) => {
    try {
      const result = await deleteVacancy(vacancyId);
      if (!result.ok) {
        toast.custom((t) => (
          <ToastCustomMessage
            title="Error al eliminar la vacante"
            message="La vacante no pudo ser eliminada"
            onClick={() => {
              toast.dismiss(t);
            }}
            type="error"
          />
        ));
        return;
      }
      toast.custom((t) => (
        <ToastCustomMessage
          title="Vacante eliminada correctamente"
          message="La vacante ha sido eliminada correctamente"
          onClick={() => {
            toast.dismiss(t);
          }}
          type="success"
        />
      ));
    } catch (err) {
      toast.custom((t) => (
        <ToastCustomMessage
          title="Error al eliminar la vacante"
          message="La vacante no pudo ser eliminada"
          onClick={() => {
            toast.dismiss(t);
          }}
          type="error"
        />
      ));
    }
  };

  const handleOpenDeleteDialog = () => {
    // Cerrar el modal de edición si está abierto para evitar conflictos
    if (openEdit) {
      setOpenEdit(false);
    }
    setOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="cursor-pointer">
            <Clipboard />
            Copiar Usuario
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={handleEdit}>
            <SquarePen />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            variant="destructive"
            onClick={handleOpenDeleteDialog}
          >
            <Trash2 />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditVacancyForm
        open={openEdit}
        setOpen={handleCloseEdit}
        vacancy={row.original}
      />

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="z-[110]">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              la vacante.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDeleteVacancy(row.original.id);
                setOpen(false);
              }}
            >
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
