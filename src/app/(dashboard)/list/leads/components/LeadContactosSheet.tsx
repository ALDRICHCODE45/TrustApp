"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Lead } from "@/lib/data";
import { Mail, PlusIcon, Users } from "lucide-react";

export function LeadContactosSheet({
  contactos,
}: {
  contactos: Lead["contactos"];
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

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
    <form className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1 space-y-2">
          <Label htmlFor="nombre">Nombre completo</Label>
          <Input id="nombre" placeholder="Juan Pérez" type="text" required />
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="puesto">Puesto</Label>
          <Input
            id="puesto"
            placeholder="Gerente de producto"
            type="text"
            required
          />
        </div>
      </div>
      <div className="*:not-first:mt-2">
        <Label htmlFor="correo">Correo electrónico</Label>
        <Input
          id="correo"
          placeholder="candidato@ejemplo.com"
          type="email"
          required
        />
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

  // Footer del formulario
  const ContactFormFooter = () => (
    <>
      <Button variant="outline" onClick={() => setOpen(false)}>
        Cancelar
      </Button>
      <Button onClick={() => setOpen(false)}>Guardar Contacto</Button>
    </>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Users />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mt-5">
          {/* Mostrar Drawer en móviles y Dialog en pantallas grandes */}
          {isMobile ? (
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <AddContactTrigger />
              </DrawerTrigger>
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
                <DrawerFooter>
                  <ContactFormFooter />
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          ) : (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <AddContactTrigger />
              </DialogTrigger>
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
                <DialogFooter className="border-t px-6 py-4">
                  <ContactFormFooter />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </SheetHeader>

        {/* Lista de contactos */}
        <div className="space-y-4 mt-4">
          {contactos.map((contacto, index) => (
            <Card
              key={index}
              className="shadow-sm hover:shadow-md transition-shadow border-l-2 border-l-primary"
            >
              {/* Header */}
              <CardHeader className="p-3 pb-1">
                <div className="space-y-1">
                  <CardTitle className="text-base font-medium">
                    {contacto.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-400">
                    {contacto.posicion}
                  </CardDescription>
                </div>
              </CardHeader>

              {/* Content */}
              <CardContent className="p-3 pt-1 space-y-2">
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex gap-1 items-center">
                    <Mail size={14} className="text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      contacto@gmail.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
