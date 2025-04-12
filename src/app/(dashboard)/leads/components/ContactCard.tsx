"use client";
import { useState } from "react";
import { Mail, MoreVertical, Edit, Trash2, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Person } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { deleteContactById, editLeadPerson } from "@/actions/person/actions";

// Definición de tipos

interface ContactoCardProps {
  contacto: Person;
}

export const ContactoCard = ({ contacto }: ContactoCardProps) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);

    try {
      await editLeadPerson(contacto.id, formData);
      toast.success("Contacto editado con exito");
    } catch (error) {
      toast.error("Algo salio mal..");
    } finally {
      setIsPending(false);
      setOpenDialog(false);
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const promise = deleteContactById(id);

      toast.promise(promise, {
        loading: "Eliminando...",
        success: () => {
          return "Contacto eliminado con exito";
        },
        error: "Ah ocurrido un error",
      });
    } catch (error) {
      console.log(error);
      throw Error("Error eliminando leadContact");
    }
  };

  return (
    <>
      <Card className="shadow-sm hover:shadow-md transition-shadow border-l-2 border-l-primary">
        <CardHeader className="p-3 pb-1 flex flex-row justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-base font-medium">
              {contacto.name}
            </CardTitle>
            <CardDescription className="text-xs text-gray-400">
              {contacto.position}
            </CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[9999]">
              <DropdownMenuItem
                onClick={() => setOpenDialog(true)}
                className="cursor-pointer"
              >
                <Edit />
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => deleteContact(contacto.id)}
                className="text-red-500 cursor-pointer "
              >
                <Trash2 />
                <span>Eliminar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-3 pt-1 space-y-2">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex gap-1 items-center">
              <Mail size={14} className="text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {contacto.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar contacto</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1 space-y-2">
                <Label htmlFor="nombre">Nombre completo</Label>
                <Input
                  name="name"
                  id="name"
                  placeholder="Juan Pérez"
                  type="text"
                  required
                  defaultValue={contacto.name}
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="puesto">Puesto</Label>
                <Input
                  id="position"
                  name="position"
                  placeholder="Gerente de producto"
                  type="text"
                  required
                  defaultValue={contacto.position!!}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="correo">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                defaultValue={contacto.email}
                placeholder="candidato@ejemplo.com"
                type="email"
                required
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setOpenDialog(false)}
                type="button"
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isPending ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Cargando...
                  </>
                ) : (
                  <span>Guardar cambios</span>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
