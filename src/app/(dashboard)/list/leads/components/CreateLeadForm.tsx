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
  CalendarIcon,
  CreditCardIcon,
  LinkIcon,
  Plus,
  UsersIcon,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { AvatarFallback } from "@/components/ui/avatar";

export const CreateLeadForm = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus />
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
              <Input id="empresa" placeholder="Innovatech Solutions" readOnly />
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
          <Label htmlFor="generadorLeads">Generador de Leads</Label>
          <div className="relative">
            {/* Campo de entrada */}
            <Input
              id="generadorLeads"
              placeholder="Juan Pérez"
              readOnly
              className="pr-10" // Añade espacio a la derecha para evitar que el texto se superponga con el avatar
            />

            {/* Avatar dentro del input */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src="https://originui.com/avatar-80-07.jpg"
                  alt="Kelly King"
                  className="rounded-full"
                />
                <AvatarFallback>KK</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Grupo 2: Fecha de Prospección y Enlace */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="fechaProspeccion">Fecha de Prospección</Label>
            <div className="relative">
              <Input id="fechaProspeccion" placeholder="2023-09-25" readOnly />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
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
