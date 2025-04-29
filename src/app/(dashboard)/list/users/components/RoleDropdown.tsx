"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Role } from "@prisma/client";
import { Row } from "@tanstack/react-table";
import {
  BadgeCent,
  DollarSign,
  Shield,
  Tag,
  UserIcon,
  UserRoundSearch,
} from "lucide-react";
import { editUser } from "@/actions/users/create-user";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface Props {
  row: Row<User>;
}

const allowRoles = [
  {
    title: "¿Estás seguro?",
    description: "¿Quieres cambiar el Role a Admin?",
    onConfirmValule: Role.Admin,
    role: "Admin",
  },
  {
    title: "¿Estás seguro?",
    description: "¿Quieres cambiar el Role a Reclutador?",
    onConfirmValule: Role.reclutador,
    role: "Reclutador",
  },
  {
    title: "¿Estás seguro?",
    description: "¿Quieres cambiar el Role a Marketing?",
    onConfirmValule: Role.MK,
    role: "MK",
  },
  {
    title: "¿Estás seguro?",
    description: "¿Quieres cambiar el Role a Generador de leads?",
    onConfirmValule: Role.GL,
    role: "GL",
  },
];

export const RoleDropDown = ({ row }: Props) => {
  const actualRole = row.original.role;

  const handleChangeRole = async (newRole: Role) => {
    try {
      const formData = new FormData();
      formData.append("role", newRole);

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
          {actualRole}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {allowRoles.map((role) => (
          <ConfirmDialog
            key={role.description}
            title={role.title}
            description={role.description}
            onConfirm={() => handleChangeRole(role.onConfirmValule)}
            trigger={
              <div className="cursor-pointer">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={(e) => {
                    // Prevenir que el DropdownMenu se cierre automáticamente
                    e.preventDefault();
                  }}
                >
                  <UserIcon className="size-4 mr-2" />
                  {role.role}
                </DropdownMenuItem>
              </div>
            }
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
