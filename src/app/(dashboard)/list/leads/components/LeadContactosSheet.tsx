"use client";
import React, { useState, useEffect, useRef } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLeadPersonSchema } from "@/zod/createLeadPersonSchema";
import type { z } from "zod";
import {
  ContactoCard,
  ContactWithRelations,
} from "@/app/(dashboard)/leads/components/ContactCard";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type FormData = z.infer<typeof createLeadPersonSchema>;

export function LeadContactosSheet({
  contactos,
  leadId,
}: {
  contactos: ContactWithRelations[];
  leadId: string;
}) {
  const [open, setOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingContact, setIsCreatingContact] = useState(false);
  const router = useRouter();

  // Referencias para mantener el estado entre re-renderizaciones
  const selectedLeadIdRef = useRef<string>(leadId);
  const isSheetOpenRef = useRef<boolean>(false);
  const [displayedContacts, setDisplayedContacts] = useState<ContactWithRelations[]>(contactos);

  // Efecto para manejar el estado inicial y cambios del leadId
  useEffect(() => {
    // Solo actualizar el leadId si el sheet está cerrado o si es el mismo lead
    if (!isSheetOpenRef.current || leadId === selectedLeadIdRef.current) {
      selectedLeadIdRef.current = leadId;
      setDisplayedContacts(contactos);
    }
  }, [leadId, contactos]);

  // Efecto para sincronizar el estado del sheet
  useEffect(() => {
    isSheetOpenRef.current = sheetOpen;
  }, [sheetOpen]);

  // Efecto para limpiar el estado cuando se cierra el sheet
  useEffect(() => {
    if (!sheetOpen) {
      setIsCreatingContact(false);
    }
  }, [sheetOpen]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(createLeadPersonSchema),
    defaultValues: {
      leadId: selectedLeadIdRef.current,
    },
  });

  // Asegurarnos de que el leadId siempre esté actualizado
  useEffect(() => {
    setValue('leadId', selectedLeadIdRef.current);
  }, [selectedLeadIdRef.current, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setIsCreatingContact(true);
      const formData = new FormData();
      
      formData.append('leadId', selectedLeadIdRef.current);
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && key !== 'leadId') {
          formData.append(key, value.toString());
        }
      });

      const result = await createLeadPerson(null, formData);
      
      if (result?.status === 'success') {
        toast.success('Contacto creado exitosamente');
        setOpen(false);
        reset();
        
        if (result.data) {
          setDisplayedContacts(prev => [...prev, result.data]);
        }
        
        // Actualizar solo los contactos del lead actual
        const response = await fetch('/api/leads');
        const newData = await response.json();
        const updatedLead = newData.find((lead: any) => lead.id === selectedLeadIdRef.current);
        if (updatedLead) {
          setDisplayedContacts(updatedLead.contactos);
        }
      } else {
        toast.error('Error al crear el contacto');
      }
    } catch (error) {
      console.error("Error al crear el contacto:", error);
      toast.error('Error al crear el contacto');
    } finally {
      setIsSubmitting(false);
      setIsCreatingContact(false);
    }
  };

  // Formulario de contacto
  const ContactForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register('leadId')} value={selectedLeadIdRef.current} />
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1 space-y-2">
          <Label htmlFor="name">Nombre completo</Label>
          <Input
            {...register("name")}
            placeholder="Juan Pérez"
            type="text"
            autoComplete="name"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="position">Posición</Label>
          <Input
            {...register("position")}
            placeholder="Gerente de producto"
            type="text"
            autoComplete="organization-title"
            disabled={isSubmitting}
          />
          {errors.position && (
            <p className="text-sm text-red-500">{errors.position.message}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1 space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            {...register("email", {required:false})}
            placeholder="candidato@ejemplo.com"
            type="email"
            autoComplete="email"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="phone">Número telefónico</Label>
          <Input
            {...register("phone", {required:false})}
            placeholder="+52553.."
            type="tel"
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            setOpen(false);
            reset();
            setIsCreatingContact(false);
          }}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
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

  return (
    <>
      <Dialog open={open} onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          setIsCreatingContact(false);
        }
      }}>
        <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="border-b px-6 py-4 text-base">
              Agregar contacto a este lead
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Completar la información del nuevo contacto.
          </DialogDescription>
          <div className="overflow-y-auto">
            <div className="px-6 pt-4 pb-6">
              <ContactForm />
            </div>
          </div>
          <DialogFooter className="border-t px-6 py-4" />
        </DialogContent>
      </Dialog>

      <Sheet open={sheetOpen} onOpenChange={(newOpen) => {
        setSheetOpen(newOpen);
        if (!newOpen) {
          setIsCreatingContact(false);
        }
      }}>
        <SheetTrigger asChild>
          <Button variant="outline">
            <Users />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader className="mt-5">
            <div className="flex items-center justify-between">
              <SheetTitle>Contactos</SheetTitle>
              <Button
                size="sm"
                className="gap-1"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCreatingContact(true);
                  setOpen(true);
                }}
              >
                <PlusIcon size={16} />
                <span>Agregar</span>
              </Button>
            </div>
          </SheetHeader>

          <div className="max-h-[600px] overflow-y-auto mt-4">
            <div className="space-y-4">
              {displayedContacts && displayedContacts.length > 0 ? (
                displayedContacts.map((contacto) => (
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
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
