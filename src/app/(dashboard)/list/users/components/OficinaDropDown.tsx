"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Oficina } from "@prisma/client";
import { Row } from "@tanstack/react-table";
import { House } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { editUser } from "@/actions/users/create-user";
import { toast } from "sonner";

interface Props {
  row: Row<User>;
}

export const OficinaDropDown = ({ row }: Props) => {
  const actualOficina = row.original.Oficina;
  const [oficina, setOficina] = useState(actualOficina);

  const handleChangeOficina = async (newOficina: Oficina) => {
    setOficina(newOficina);

    const formData = new FormData();
    formData.append("oficina", newOficina);
    const promise = editUser(row.original.id, formData);
    toast.promise(promise, {
      loading: "Loading...",
      success: () => {
        return "Usuario modificado con exito";
      },
      error: "Ah ocurrido un error",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {oficina}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <ConfirmDialog
          title="¿Estás seguro?"
          description="¿Quieres cambiar tu oficina a Oficina 2?"
          onConfirm={() => handleChangeOficina(Oficina.Oficina2)}
          trigger={
            <div className="cursor-pointer">
              <DropdownMenuItem
                onSelect={(e) => {
                  // Prevenir que el DropdownMenu se cierre automáticamente
                  e.preventDefault();
                }}
              >
                <House className="mr-2 h-4 w-4" />
                Oficina 2
              </DropdownMenuItem>
            </div>
          }
        />
        <ConfirmDialog
          title="¿Estás seguro?"
          description="¿Quieres cambiar tu oficina a Oficina 1?"
          onConfirm={() => handleChangeOficina(Oficina.Oficina1)}
          trigger={
            <div className="cursor-pointer">
              <DropdownMenuItem
                onSelect={(e) => {
                  // Prevenir que el DropdownMenu se cierre automáticamente
                  e.preventDefault();
                }}
              >
                <House className="mr-2 h-4 w-4" />
                Oficina 1
              </DropdownMenuItem>
            </div>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
