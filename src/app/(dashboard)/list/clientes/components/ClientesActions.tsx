"use client";
import { deleteClientByid } from "@/actions/clientes/actions";
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
  FolderInput,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useCallback, useMemo, useState } from "react";
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
import { EditClientForm } from "./EditClientForm";
import { ClientWithRelations } from "../columns";

export const ClientesActions = ({ row }: { row: any }) => {
  const [isDialogOpen, setisDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const clienteId = useMemo(
    () => row.original.id.toString(),
    [row.original.id]
  );

  const clientData: ClientWithRelations = row.original;

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleDeleteClient = useCallback(async () => {
    try {
      setIsDeleting(true);
      await deleteClientByid(clienteId);
      toast.success("Cliente eliminado con éxito");
    } catch (error) {
      toast.error("Error al eliminar el cliente");
    } finally {
      setIsDeleting(false);
    }
  }, [clienteId]);

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
          <DropdownMenuItem
            onClick={() => setisDialogOpen(true)}
            className="cursor-pointer text-red-500"
          >
            <Trash className="h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/cliente/${clienteId}`} className="cursor-pointer">
              <FolderInput className="h-4 w-4" />
              Ver más
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
            <Pencil className="h-4 w-4" />
            Editar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={isDialogOpen} onOpenChange={setisDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el
              cliente y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClient}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Formulario de edición */}
      <EditClientForm
        clientData={clientData}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
      />
    </>
  );
};
