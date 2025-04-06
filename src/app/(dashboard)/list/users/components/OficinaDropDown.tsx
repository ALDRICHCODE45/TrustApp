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
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { editUser } from "@/actions/users/create-user";
import { toast } from "sonner";

interface Props {
  row: Row<User>;
}

const allowOfices = [
  {
    title: "¿Estás seguro?",
    description: "¿Quieres cambiar tu oficina a Oficina 1?",
    onConfirmValule: Oficina.Oficina1,
    oficeNumber: "Oficina 1",
  },
  {
    title: "¿Estás seguro?",
    description: "¿Quieres cambiar tu oficina a Oficina 2?",
    onConfirmValule: Oficina.Oficina2,
    oficeNumber: "Oficina 2",
  },
];

export const OficinaDropDown = ({ row }: Props) => {
  const actualOficina = row.original.Oficina;

  const handleChangeOficina = async (newOficina: Oficina) => {
    try {
      const formData = new FormData();
      formData.append("oficina", newOficina);

      console.log({ formData });
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
          {actualOficina}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {allowOfices.map((ofice) => (
          <ConfirmDialog
            key={ofice.oficeNumber}
            title={ofice.title}
            description={ofice.description}
            onConfirm={() => handleChangeOficina(ofice.onConfirmValule)}
            trigger={
              <div className="cursor-pointer">
                <DropdownMenuItem
                  onSelect={(e) => {
                    // Prevenir que el DropdownMenu se cierre automáticamente
                    e.preventDefault();
                  }}
                >
                  <House className="mr-2 h-4 w-4" />
                  {ofice.oficeNumber}
                </DropdownMenuItem>
              </div>
            }
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
