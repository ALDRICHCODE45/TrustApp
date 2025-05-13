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
import { createLeadPerson } from "@/actions/person/actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { createLeadPersonSchema } from "@/zod/createLeadPersonSchema";
import {
  ContactoCard,
  ContactWithRelations,
} from "@/app/(dashboard)/leads/components/ContactCard";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export function LeadContactosSheet({
  contactos,
  leadId,
}: {
  contactos: ContactWithRelations[];
  leadId: string;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

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
    shouldValidate: "onSubmit",
  });

  // Detectar si el dispositivo es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    // Ejecutar en el cliente
    checkMobile();

    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Manejar el resultado de la acción
  useEffect(() => {
    if (lastResult && !lastResult.error) {
      setOpen(false);
    }
  }, [lastResult]);

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
        id={fields.leadId.id}
      />

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1 space-y-2">
          <Label htmlFor={fields.name.id}>Nombre completo</Label>
          <Input
            name={fields.name.name}
            id={fields.name.id}
            placeholder="Juan Pérez"
            type="text"
            required
            autoComplete="name"
          />
          {fields.name.errors && (
            <p className="text-sm text-red-500">{fields.name.errors}</p>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor={fields.position.id}>Posición</Label>
          <Input
            id={fields.position.id}
            name={fields.position.name}
            placeholder="Gerente de producto"
            type="text"
            required
            autoComplete="organization-title"
          />
          {fields.position.errors && (
            <p className="text-sm text-red-500">{fields.position.errors}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={fields.email.id}>Correo electrónico</Label>
        <Input
          id={fields.email.id}
          name={fields.email.name}
          placeholder="candidato@ejemplo.com"
          type="email"
          required
          autoComplete="email"
        />
        {fields.email.errors && (
          <p className="text-sm text-red-500">{fields.email.errors}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
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
      onClick={(e) => {
        e.stopPropagation();
        setOpen(true);
      }}
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
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline">
            <Users />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader className="mt-5">
            <div className="flex items-center justify-between">
              <SheetTitle>Contactos</SheetTitle>
              <AddContactTrigger />
            </div>
          </SheetHeader>

          {/* Lista de contactos */}
          <div className="space-y-4 mt-4">
            {contactos && contactos.length > 0 ? (
              contactos.map((contacto) => (
                <ContactoCard key={contacto.id} contacto={contacto} />
              ))
            ) : (
              <div className="flex flex-col justify-center items-center gap-2 py-8">
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
