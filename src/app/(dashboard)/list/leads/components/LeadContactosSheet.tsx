"use client";
import React, { useState, useEffect, useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Loader2, PlusIcon, Users, UserX } from "lucide-react";
import { Person } from "@prisma/client";
import { createLeadPerson } from "@/actions/person/actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { createLeadPersonSchema } from "@/zod/createLeadPersonSchema";
import { ContactoCard } from "@/app/(dashboard)/leads/components/ContactCard";

export function LeadContactosSheet({
  contactos,
  leadId,
}: {
  contactos: Person[];
  leadId: string;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  const [lastResult, formAction, isPending] = useActionState(
    createLeadPerson,
    undefined,
  );

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: createLeadPersonSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  // Detectar si el dispositivo es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    // Ejecutar en el cliente
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Formulario de contacto
  const ContactForm = () => (
    <form
      className="space-y-4"
      id={form.id}
      action={formAction}
      onSubmit={form.onSubmit}
      noValidate
    >
      <input
        type="hidden"
        value={leadId}
        name={fields.leadId.name}
        key={fields.leadId.key}
      />

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1 space-y-2">
          <Label htmlFor="nombre">Nombre completo</Label>
          <Input
            name={fields.name.name}
            id={fields.name.id}
            placeholder="Juan Pérez"
            type="text"
            required
            key={fields.name.key}
            defaultValue={fields.name.initialValue}
          />
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="puesto">Puesto</Label>
          <Input
            id={fields.position.id}
            name={fields.position.name}
            key={fields.position.key}
            defaultValue={fields.position.initialValue}
            placeholder="Gerente de producto"
            type="text"
            required
          />
        </div>
      </div>
      <div className="*">
        <Label htmlFor="correo">Correo electrónico</Label>
        <Input
          id={fields.email.id}
          name={fields.email.name}
          key={fields.email.key}
          defaultValue={fields.email.initialValue}
          placeholder="candidato@ejemplo.com"
          type="email"
          required
        />
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
        <Button type="submit">
          {isPending ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Cargando...
            </>
          ) : (
            <span>Crear contacto</span>
          )}
        </Button>
      </div>
    </form>
  );

  // Botón para abrir el formulario
  const AddContactTrigger = () => (
    <Button
      size="sm"
      className="gap-1"
      variant="outline"
      onClick={() => setOpen(true)}
    >
      <PlusIcon size={16} />
      <span>Agregar</span>
    </Button>
  );

  return (
    <>
      {/* Drawer/Dialog fuera del Sheet */}
      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Agregar contacto</DrawerTitle>
              <DrawerDescription>
                Completar la información del nuevo candidato.
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <ContactForm />
            </div>
            <DrawerFooter />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
            <DialogHeader className="contents space-y-0 text-left">
              <DialogTitle className="border-b px-6 py-4 text-base">
                Agregar contacto
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className="sr-only">
              Completar la información del nuevo candidato.
            </DialogDescription>
            <div className="overflow-y-auto">
              <div className="px-6 pt-4 pb-6">
                <ContactForm />
              </div>
            </div>
            <DialogFooter className="border-t px-6 py-4" />
          </DialogContent>
        </Dialog>
      )}

      {/* Sheet con botón y listado */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
            <Users />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader className="mt-5">
            <AddContactTrigger />

            <SheetTitle></SheetTitle>
          </SheetHeader>

          {/* Lista de contactos */}
          <div className="space-y-4 mt-4">
            {contactos && contactos.length > 0 ? (
              contactos.map((contacto) => (
                <ContactoCard key={contacto.id} contacto={contacto} />
              ))
            ) : (
              <div className="flex flex-col justify-center  items-center gap-2">
                <UserX size={40} className="text-gray-400" />
                <p className="text-sm text-gray-400 text-center">
                  No hay contactos disponibles.
                </p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
