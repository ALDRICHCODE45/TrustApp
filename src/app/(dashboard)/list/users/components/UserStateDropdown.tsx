"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { User } from "@prisma/client";
import { Ban, CircleUser } from "lucide-react";
import { UserState } from "@prisma/client";
import { editUser } from "@/actions/users/create-user";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface Props {
  row: Row<User>;
}

const allowStates = [
  {
    title: "¿Estás seguro?",
    description: "¿Quieres cambiar el estado a ACTIVADO?",
    onConfirmValule: UserState.ACTIVO,
    state: "ACTIVO",
    icon: CircleUser,
  },
  {
    title: "¿Estás seguro?",
    description: "¿Quieres cambiar el estado a DESACTIVADO?",
    onConfirmValule: UserState.INACTIVO,
    state: "INACTIVO",
    icon: Ban,
  },
];

export const StateDropdown = ({ row }: Props) => {
  const actualState = row.original.State;

  const handleChangeState = async (newState: UserState) => {
    try {
      const formData = new FormData();
      formData.append("status", newState);
      toast.promise(editUser(row.original.id, formData), {
        loading: "Loading...",
        success: "Usuario modificado con éxito",
        error: "Ha ocurrido un error",
      });
    } catch (error) {
      toast.error("Error al modificar el usuario. Intenta nuevamente.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {actualState}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {allowStates.map((state) => (
          <ConfirmDialog
            key={state.state}
            title={state.title}
            description={state.description}
            onConfirm={() => handleChangeState(state.onConfirmValule)}
            trigger={
              <div className="cursor-pointer">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={(e) => {
                    // Prevenir que el DropdownMenu se cierre automáticamente
                    e.preventDefault();
                  }}
                >
                  <state.icon className="size-4" />
                  {state.state}
                </DropdownMenuItem>
              </div>
            }
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
