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
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
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
import { deleteLeadById } from "@/actions/leads/actions";
import { EditLeadForm } from "@/app/(dashboard)/leads/components/EditLeadForm";
import { LeadWithRelations } from "@/app/(dashboard)/leads/kanban/page";

export const ActionsCell = ({ row }: { row: Row<LeadWithRelations> }) => {
  // Estado para controlar la visibilidad del diálogo y del dropdown
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleEditClick = () => {
    setIsMenuOpen(false); // Cierra el menú antes de abrir el diálogo
    setIsDialogOpen(true);
  };

  const handleDeletelead = async () => {
    try {
      await deleteLeadById(row.original.id);
      toast.success("Lead eliminado con éxito");
    } catch (error) {
      toast.error("Error al eliminar el lead");
    }
  };

  return (
    <>
      {/* Dropdown Menu */}
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <span className="sr-only">Open Menu</span>
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
                className="cursor-pointer"
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
                <AlertDialogAction onClick={() => handleDeletelead()}>
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
              Editar
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Realiza los cambios a tu prospeccion en este apartado
          </DialogDescription>

          {/* Using the extracted form component here */}
          <EditLeadForm leadData={row.original} closeDialog={setIsDialogOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
};
