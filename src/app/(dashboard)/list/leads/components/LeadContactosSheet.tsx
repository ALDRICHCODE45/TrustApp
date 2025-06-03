"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
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
import { Loader2, PlusIcon, Users, UserX, MessageSquare } from "lucide-react";
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
import { AllLeadInteractionsDialog } from "./AllLeadInteractionsDialog";
import { getContactosByLeadId } from "@/actions/leadSeguimiento/ations";

type FormData = z.infer<typeof createLeadPersonSchema>;

export function LeadContactosSheet({
  contactos,
  leadId,
  empresaName,
}: {
  contactos: ContactWithRelations[];
  leadId: string;
  empresaName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingContact, setIsCreatingContact] = useState(false);
  const [allInteractionsOpen, setAllInteractionsOpen] = useState(false);

  const router = useRouter();

  // Usar useRef para mantener el leadId consistente
  const leadIdRef = useRef<string>(leadId);
  const [displayedContacts, setDisplayedContacts] =
    useState<ContactWithRelations[]>(contactos);

  // Efecto para actualizar el leadId solo cuando el sheet está cerrado
  useEffect(() => {
    if (!sheetOpen) {
      leadIdRef.current = leadId;
      setDisplayedContacts(contactos);
    }
  }, [leadId, contactos, sheetOpen]);

  // Configuración del formulario con valores por defecto estables
  const defaultValues = useMemo(
    () => ({
      leadId: leadIdRef.current,
      name: "",
      position: "",
      email: "",
      phone: "",
    }),
    [leadIdRef.current],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(createLeadPersonSchema),
    defaultValues,
    mode: "onChange",
  });

  // Asegurar que el leadId esté actualizado sin causar re-renders innecesarios
  useEffect(() => {
    setValue("leadId", leadIdRef.current);
  }, [setValue, leadIdRef.current]);

  // Función de submit memoizada para evitar recreaciones
  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        setIsSubmitting(true);
        setIsCreatingContact(true);
        const formData = new FormData();

        // Usar el leadId del ref para asegurar consistencia
        formData.append("leadId", leadIdRef.current);

        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && key !== "leadId") {
            formData.append(key, value.toString());
          }
        });

        const result = await createLeadPerson(null, formData);

        if (result?.status === "success" && result.data) {
          toast.success("Contacto creado exitosamente");
          setOpen(false);
          reset(defaultValues); // Usar defaultValues consistentes

          // Actualizar la lista de contactos con el nuevo contacto
          setDisplayedContacts((prev) => [...prev, result.data]);

          // Actualizar solo los contactos del lead actual
          try {
            const updatedContacts = await getContactosByLeadId(
              leadIdRef.current,
            );
            setDisplayedContacts(updatedContacts);
          } catch (error) {
            console.error("Error al actualizar los contactos:", error);
          }
        } else {
          const errorMessage = result?.message || "Error al crear el contacto";
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Error al crear el contacto:", error);
        toast.error("Error al crear el contacto");
      } finally {
        setIsSubmitting(false);
        setIsCreatingContact(false);
      }
    },
    [reset, defaultValues],
  );

  // Handlers memoizados para evitar recreaciones
  const handleDialogOpenChange = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen);
      if (!newOpen) {
        setIsCreatingContact(false);
        reset(defaultValues);
      }
    },
    [reset, defaultValues],
  );

  const handleSheetOpenChange = useCallback((newOpen: boolean) => {
    setSheetOpen(newOpen);
    if (!newOpen) {
      setIsCreatingContact(false);
    }
  }, []);

  const handleCancelClick = useCallback(() => {
    setOpen(false);
    reset(defaultValues);
    setIsCreatingContact(false);
  }, [reset, defaultValues]);

  const handleAddContactClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCreatingContact(true);
    setOpen(true);
  }, []);

  const handleViewAllInteractionsClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAllInteractionsOpen(true);
  }, []);

  // Componente del formulario memoizado para evitar re-renders
  const ContactForm = useMemo(
    () => (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="hidden"
          {...register("leadId")}
          value={leadIdRef.current}
        />
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1 space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              {...register("name")}
              placeholder="Juan Pérez"
              type="text"
              disabled={isSubmitting}
              autoComplete="off"
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
              disabled={isSubmitting}
              autoComplete="off"
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
              {...register("email", { required: false })}
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
              {...register("phone", { required: false })}
              placeholder="+52553.."
              type="tel"
              disabled={isSubmitting}
              autoComplete="off"
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <Label htmlFor="linkedin">Perfil de Linkedin</Label>
          <Input
            {...register("linkedin", { required: false })}
            placeholder="linkedin/user..."
            type="tel"
            disabled={isSubmitting}
            autoComplete="off"
          />
          {errors.linkedin && (
            <p className="text-sm text-red-500">{errors.linkedin.message}</p>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancelClick}
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
    ),
    [register, handleSubmit, onSubmit, errors, isSubmitting, handleCancelClick],
  );

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogContent
          forceMount
          className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5"
        >
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="border-b px-6 py-4 text-base">
              Agregar contacto a este lead
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Completar la información del nuevo contacto.
          </DialogDescription>
          <div className="px-6 pt-4 pb-6">{ContactForm}</div>
          <DialogFooter className="border-t px-6 py-4" />
        </DialogContent>
      </Dialog>

      <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
        <SheetTrigger asChild>
          <Button variant="outline">
            <Users />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader className="mt-5">
            <div className="flex items-center justify-between">
              <SheetTitle>Contactos</SheetTitle>
              <div className="flex gap-2">
                {/* TODO:ARREGLAR FUNCIONALIDAD*/}
                {/* <Button */}
                {/*   size="sm" */}
                {/*   className="gap-1" */}
                {/*   variant="outline" */}
                {/*   onClick={handleViewAllInteractionsClick} */}
                {/* > */}
                {/*   <MessageSquare size={16} /> */}
                {/*   <span>Ver todas</span> */}
                {/* </Button> */}
                <Button
                  size="sm"
                  className="gap-1"
                  variant="outline"
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                  onClick={handleAddContactClick}
                >
                  <PlusIcon size={16} />
                  <span>Agregar</span>
                </Button>
              </div>
            </div>
          </SheetHeader>

          <div className="max-h-[600px] overflow-y-auto mt-4">
            <div className="space-y-4">
              {displayedContacts && displayedContacts.length > 0 ? (
                displayedContacts.map((contacto) => (
                  <ContactoCard
                    key={contacto.id}
                    contacto={contacto}
                    onUpdateContacts={setDisplayedContacts}
                  />
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

      <AllLeadInteractionsDialog
        open={allInteractionsOpen}
        onOpenChange={setAllInteractionsOpen}
        leadId={leadIdRef.current}
        empresaName={empresaName || "Sin nombre"}
      />
    </>
  );
}
