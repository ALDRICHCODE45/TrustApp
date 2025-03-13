"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  BriefcaseIcon,
  CreditCardIcon,
  LinkIcon,
  PlusCircle,
  User as UserIcon,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Role, User, UsersData } from "@/lib/data";
import { useState } from "react";
import Link from "next/link";

export const CreateLeadForm = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <PlusCircle />
            Crear Lead
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] z-[200]">
          <DialogHeader>
            <DialogTitle>Nuevo Lead</DialogTitle>
            <Separator />
          </DialogHeader>
          {/* Envolver el formulario con FormProvider */}
          <NuevoLeadForm />
        </DialogContent>
      </Dialog>
    </>
  );
};

function NuevoLeadForm() {
  // Definir el esquema de validación con Zod
  const FormSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
  });

  // Inicializar el formulario con react-hook-form
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  // Función para manejar el envío del formulario
  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data); // Muestra los datos en la consola
    toast("Form submitted successfully!");
  }
  const generadores = UsersData.filter(
    (user) => user.rol === Role.generadorLeads,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [glUsers] = useState<User[]>(generadores);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Seleccionar un usuario
  const handleSelectGl = (user: User) => {
    setSelectedUser(user);
    setIsOpen(false);
  };

  // Obtener iniciales para Avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "UN";
    return name
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <form className="space-y-4">
        {/* Grupo 1: Empresa y Sector */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="empresa" className="">
              Empresa
            </Label>
            <div className="relative">
              <Input id="empresa" placeholder="Zendesk" readOnly />
              <BriefcaseIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="sector">Sector</Label>
            <div className="relative">
              <Input id="sector" placeholder="Tecnología" readOnly />
              <CreditCardIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
            </div>
          </div>
        </div>
        {/* Generador de Leads */}

        <div className="flex flex-col gap-2">
          <Label>Generador de Leads</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="w-full">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center justify-center gap-2"
              >
                <UserIcon />
                <span className="truncate">
                  {selectedUser ? selectedUser.name : "Selecciona un Generador"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 max-h-[250px] overflow-y-auto z-[9999]">
              {generadores.map((generador) => (
                <DropdownMenuItem
                  key={generador.id}
                  className="flex items-center gap-3 p-2 cursor-pointer"
                  onClick={() => {
                    handleSelectGl(generador);
                  }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarImage
                        src={generador.photo}
                        alt={generador.name}
                        className="object-cover rounded-full h-full w-full"
                      />
                      <AvatarFallback className="rounded-full">
                        {getInitials(generador.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {generador.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {generador.email}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="link"
                    className="ml-auto h-8 w-8 p-0"
                    asChild
                  >
                    <Link href={`/profile/${generador.id}`}>Ver</Link>
                  </Button>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Grupo 2: Fecha de Prospección y Enlace */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="fechaProspeccion">Fecha de Prospección</Label>
            <div className="relative">
              <Input
                id="fechaProspeccion"
                placeholder="2023-09-25"
                type="date"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="link">Enlace</Label>
            <div className="relative">
              <Input id="link" placeholder="https:" readOnly />
              <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
            </div>
          </div>
        </div>
        {/* Contactos */}
        {/* Grupo 3: Fecha para Conectar y Prioridad */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="fechaAConectar">Fecha para Conectar</Label>
          <div className="">
            <Input id="fechaAConectar" type="date" />
          </div>
        </div>
        {/* Botón */}
        <Button type="button" className="w-full">
          Guardar Cambios
        </Button>
      </form>
    </>
  );
}
