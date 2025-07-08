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
import { FolderInput, Loader2, MoreHorizontal, Trash } from "lucide-react";
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

export const ClientesActions = ({ row }: { row: any }) => {
  const [isDialogOpen, setisDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const clienteId = useMemo(
    () => row.original.id.toString(),
    [row.original.id]
  );

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
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setisDialogOpen(true)}
            className="cursor-pointer text-red-500"
          >
            <Trash className="h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/cliente/${clienteId}`} className="cursor-pointer">
              <FolderInput className="h-4 w-4" />
              Ver más
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={isDialogOpen} onOpenChange={setisDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer y toda la entidad relacional de
              este usuario se perdera
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteClient()}
              className="text-white bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? <Loader2 className="animate-spin" /> : <Trash />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
