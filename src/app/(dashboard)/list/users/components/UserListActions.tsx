"use client";
import { deleteUserById } from "@/actions/users/delete-users";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@prisma/client";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { Row } from "@tanstack/react-table";
import {
  Eye,
  Loader2,
  MoreHorizontal,
  Trash,
  UserRoundCog,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface Props {
  row: Row<User>;
}

export const UserListActions = ({ row }: Props) => {
  const teacherId = row.original.id;
  const [isDialogOpen, setisDialogOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDeleteUser = useCallback(async (userId: string) => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      const { ok } = await deleteUserById(userId);
      if (!ok) {
        toast.error("Erorr al eliminar al usuario");
        return;
      }
      toast.success("Usuario eliminado correctamente");
    } catch (err) {
      toast.error("Erorr al eliminar al usuario");
    } finally {
      setIsDeleting(false);
    }
  }, [isDeleting]);

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
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/profile/${teacherId}`} className="cursor-pointer">
              <UserRoundCog />
              Ver más
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setisDialogOpen(true)}
            className="cursor-pointer"
          >
            <Trash />
            Eliminar
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
              onClick={() => handleDeleteUser(row.original.id)}
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
