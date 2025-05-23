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

  // Usar useRef para mantener el leadId consistente
  const leadIdRef = useRef<string>(leadId);
  const [displayedContacts, setDisplayedContacts] = useState<ContactWithRelations[]>(contactos);

  // Efecto para actualizar el leadId solo cuando el sheet está cerrado
  useEffect(() => {
    if (!sheetOpen) {
      leadIdRef.current = leadId;
      setDisplayedContacts(contactos);
    }
  }, [leadId, contactos, sheetOpen]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(createLeadPersonSchema),
    defaultValues: {
      leadId: leadIdRef.current,
      name: '',
      position: '',
      email: '',
      phone: '',
    },
    mode: 'onSubmit',
  });

  // Asegurarnos de que el leadId siempre esté actualizado en el formulario
  useEffect(() => {
    setValue('leadId', leadIdRef.current);
  }, [setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setIsCreatingContact(true);
      const formData = new FormData();
      
      // Usar el leadId del ref para asegurar consistencia
      formData.append('leadId', leadIdRef.current);
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && key !== 'leadId') {
          formData.append(key, value.toString());
        }
      });

      const result = await createLeadPerson(null, formData);
      
      if (result?.status === 'success' && result.data) {
        toast.success('Contacto creado exitosamente');
        setOpen(false);
        reset();
        
        // Actualizar la lista de contactos con el nuevo contacto
        setDisplayedContacts(prev => [...prev, result.data]);
        
        // Actualizar solo los contactos del lead actual
        try {
          const response = await fetch(`/api/leads/${leadIdRef.current}/contactos`);
          if (!response.ok) {
            throw new Error('Error al actualizar los contactos');
          }
          const updatedContacts = await response.json();
          setDisplayedContacts(updatedContacts);
        } catch (error) {
          console.error("Error al actualizar los contactos:", error);
        }
      } else {
        const errorMessage = result?.message || 'Error al crear el contacto';
        toast.error(errorMessage);
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
      <input type="hidden" {...register('leadId')} value={leadIdRef.current} />
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
          reset();
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
