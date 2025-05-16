"use client";
import { useState } from "react";
import {
  Mail,
  MoreVertical,
  Edit,
  Trash2,
  Loader2,
  GalleryHorizontalEnd,
  MessageSquare,
  PaperclipIcon,
  FileText,
  X,
  Plus,
  History,
  Phone,
} from "lucide-react";
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
import { Person, Prisma } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { deleteContactById, editLeadPerson } from "@/actions/person/actions";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ContactInteractionWithRelations,
  createInteraction,
} from "@/actions/leadSeguimiento/ations";
import { InteractionCard } from "./InteractionCard";
import { uploadFile } from "@/actions/files/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Definición de tipos
interface ContactoCardProps {
  contacto: ContactWithRelations;
}

export type ContactWithRelations = Prisma.PersonGetPayload<{
  include: {
    interactions: {
      include: {
        autor: true;
        contacto: true;
      };
    };
  };
}>;

// Función para crear una nueva interacción con un contacto
async function createContactInteraction(
  contactoId: string,
  content: string,
  attachment?: Attachment,
) {
  try {
    const formData = new FormData();
    formData.append("contactoId", contactoId);
    formData.append("content", content);

    if (attachment) {
      formData.append("attachment", JSON.stringify(attachment));
    }

    const response = await createInteraction(formData);

    return response;
  } catch (error) {
    console.error("Error creating interaction:", error);
    throw new Error("Error al crear la interacción");
  }
}

export const ContactoCard = ({ contacto }: ContactoCardProps) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [openSeguimiento, setOpenSeguimiento] = useState<boolean>(false);
  const [openDelete, setIsOpenDelete] = useState(false);

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
              <AlertDialog open={openDelete} onOpenChange={setIsOpenDelete}>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="cursor-pointer text-red-500"
                  >
                    <Trash2 className=" h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Se eliminará
                      permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setIsOpenDelete(false)}>
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteContact(contacto.id)}
                    >
                      Sí, eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <DropdownMenuItem
                onClick={() => setOpenSeguimiento(true)}
                className="text-blue-500 cursor-pointer "
              >
                <GalleryHorizontalEnd />
                <span>Seguimiento</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-3 pt-1 space-y-2">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex flex-col gap-1 items-start">
              <div className="flex gap-1 items-center">
                <Mail size={14} className="text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {contacto.email ? contacto.email : "Sin email"}
                </p>
              </div>
              <div className="flex gap-1 items-center">
                <Phone size={14} className="text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {contacto.phone ? contacto.phone : "Sin celular"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <SeguimientoContacto
        initialInteractions={contacto.interactions ?? []}
        onOpenChange={setOpenSeguimiento}
        open={openSeguimiento}
        contacto={contacto}
      />

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
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1 space-y-2">
                <Label htmlFor="correo">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  defaultValue={contacto.email ?? ""}
                  placeholder="@ejemplo.com"
                  type="email"
                  required={false}
                />
              </div>

              <div className="flex-1 space-y-2">
                <Label htmlFor="phone">Celular</Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={contacto.phone ?? ""}
                  placeholder="+52 5532.."
                  type="tel"
                  required={false}
                />
              </div>
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

interface SeguimientoContactoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contacto: Person;
  initialInteractions: ContactInteractionWithRelations[];
}

export interface Attachment {
  attachmentUrl: string;
  attachmentName: string;
  attachmentType: string;
}

export const SeguimientoContacto = ({
  open,
  onOpenChange,
  contacto,
  initialInteractions,
}: SeguimientoContactoProps) => {
  const [interactions, setInteractions] =
    useState<ContactInteractionWithRelations[]>(initialInteractions);

  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [newContent, setNewContent] = useState<string>("");
  const [attachment, setAttachment] = useState<Attachment | null>(null);

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newContent.trim()) {
      toast.error("El contenido no puede estar vacío");
      return;
    }

    setSubmitting(true);

    try {
      const newInteraction = await createContactInteraction(
        contacto.id,
        newContent,
        attachment || undefined,
      );

      setInteractions((prev) => [...prev, newInteraction]);
      setNewContent("");
      setAttachment(null);
      toast.success("Interacción registrada con éxito");
    } catch (error) {
      toast.error("Error al registrar la interacción");
    } finally {
      setSubmitting(false);
    }
  };

  // Manejar selección de archivo
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Crear el FormData y agregar el archivo
    const formData = new FormData();
    formData.append("file", file);

    const attachment = await uploadFile(formData);

    if (attachment.success) {
      setAttachment({
        attachmentName: attachment.fileName,
        attachmentType: attachment.fileType,
        attachmentUrl: attachment.url,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Seguimiento de contacto: {contacto.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Formulario para agregar nueva interacción */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="content">Nueva interacción</Label>
              <Textarea
                id="content"
                placeholder="Describe la interacción con este contacto..."
                rows={3}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                disabled={submitting}
                required
                className="resize-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="attachment" className="cursor-pointer">
                <div className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-2 rounded-md text-sm">
                  <PaperclipIcon className="h-4 w-4" />
                  {attachment ? "Cambiar archivo" : "Adjuntar archivo"}
                </div>
                <input
                  type="file"
                  id="attachment"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={submitting}
                />
              </Label>

              {attachment && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                  <FileText className="h-4 w-4" />
                  <span className="truncate max-w-xs">
                    {attachment.attachmentName}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => setAttachment(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}

              <div className="ml-auto">
                <Button
                  type="submit"
                  disabled={submitting || !newContent.trim()}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Registrar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>

          <Separator />

          {/* Historial de interacciones */}
          <div className="space-y-1">
            <div className="flex  gap-2">
              <History size={17} className="items-center" />
              <h3 className="text-sm font-medium mb-6 items-center">
                Historial de interacciones
              </h3>
            </div>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : interactions?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No hay interacciones registradas con este contacto.</p>
                <p className="text-sm">
                  Registra la primera interacción arriba.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[calc(50vh-200px)] pr-4">
                <div className="space-y-4">
                  {interactions.map((interaction) => (
                    <InteractionCard
                      key={interaction.id}
                      interaction={interaction}
                      setInteractions={setInteractions}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
