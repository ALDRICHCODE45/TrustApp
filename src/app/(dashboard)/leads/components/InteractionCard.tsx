"use client";
import {
  ContactInteractionWithRelations,
  deleteInteractionById,
  editInteractionById,
} from "@/actions/leadSeguimiento/ations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Download,
  Edit,
  FileText,
  Loader2,
  MoreVertical,
  PaperclipIcon,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Attachment } from "./ContactCard";
import { replaceFile, uploadFile } from "@/actions/files/actions";

interface Props {
  interaction: ContactInteractionWithRelations;
  setInteractions: React.Dispatch<
    React.SetStateAction<ContactInteractionWithRelations[]>
  >;
}

export const InteractionCard = ({ interaction, setInteractions }: Props) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [newContent, setNewContent] = useState<string>(interaction.content);
  const [attachmentInfo, setAttachmentInfo] = useState<Attachment | null>(
    interaction.attachmentUrl
      ? {
          attachmentName: interaction.attachmentName || "Archivo adjunto",
          attachmentType: interaction.attachmentType || "",
          attachmentUrl: interaction.attachmentUrl,
        }
      : null,
  );
  const [isAttachmentChanged, setIsAttachmentChanged] =
    useState<boolean>(false);

  const deleteInteraction = async (interactionId: string) => {
    try {
      const promise = deleteInteractionById(interactionId);
      toast.promise(promise, {
        loading: "Loading...",
        success: (data) => {
          return `Interaccion eliminada con exito`;
        },
        error: "Error elimininando la internaccion",
      });
      setInteractions((prevItems) =>
        prevItems.filter((item) => item.id !== interactionId),
      );
    } catch (err) {
      toast.error("Error inesperado");
      throw new Error("No se puede eliminar la interaccion");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData();
    formData.append("content", newContent);

    // Si hay un adjunto y ha sido cambiado, añadir la info del adjunto al formData
    if (attachmentInfo && isAttachmentChanged) {
      formData.append("attachment", JSON.stringify(attachmentInfo));
    }

    try {
      const interactionUpdated = await editInteractionById(
        interaction.id,
        formData,
      );

      if (!interactionUpdated) {
        toast.error("La interaccion no se pudo completar");
        return;
      }

      // Actualizar el estado local con los datos actualizados
      setInteractions((prevItems) =>
        prevItems.map((item) =>
          item.id === interaction.id
            ? {
                ...item,
                content: newContent,
                attachmentUrl: attachmentInfo?.attachmentUrl || null,
                attachmentName: attachmentInfo?.attachmentName || null,
                attachmentType: attachmentInfo?.attachmentType || null,
              }
            : item,
        ),
      );

      setIsAttachmentChanged(false);
      toast.success("Interacción editada con éxito");
    } catch (err) {
      console.error(err);
      toast.error("Algo salió mal...");
    } finally {
      setIsPending(false);
      setOpenDialog(false);
    }
  };

  // Manejar selección de un nuevo archivo cuando no había uno
  const handleNewFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsPending(true);
      // Crear el FormData y agregar el archivo
      const formData = new FormData();
      formData.append("file", file);

      const attachment = await uploadFile(formData);

      if (attachment.success) {
        setAttachmentInfo({
          attachmentName: attachment.fileName,
          attachmentType: attachment.fileType,
          attachmentUrl: attachment.url,
        });
        setIsAttachmentChanged(true);
        toast.success("Archivo subido correctamente");
      } else {
        toast.error("Error al subir el archivo");
      }
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      toast.error("Error al subir el archivo");
    } finally {
      setIsPending(false);
    }
  };

  // Manejar reemplazo de un archivo existente
  const handleReplaceFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsPending(true);
      const fileKey = interaction?.attachmentUrl?.split("/").pop();

      if (!fileKey) {
        throw new Error("No se puede obtener el fileKey");
      }

      const attachment = await replaceFile(fileKey, {
        interactionId: interaction.id,
        file: file,
      });

      if (attachment.success) {
        setAttachmentInfo({
          attachmentName: attachment.fileName,
          attachmentType: attachment.fileType,
          attachmentUrl: attachment.url,
        });
        setInteractions((prevItems) =>
          prevItems.map((item) =>
            item.id === interaction.id
              ? {
                  ...item,
                  content: newContent,
                  attachmentUrl: attachmentInfo?.attachmentUrl || null,
                  attachmentName: attachmentInfo?.attachmentName || null,
                  attachmentType: attachmentInfo?.attachmentType || null,
                }
              : item,
          ),
        );

        setIsAttachmentChanged(true);
        toast.success("Archivo reemplazado correctamente");
      } else {
        toast.error("Error al reemplazar el archivo");
      }
    } catch (error) {
      console.error("Error al reemplazar el archivo:", error);
      toast.error("Error al reemplazar el archivo");
    } finally {
      setIsPending(false);
    }
  };

  // Eliminar adjunto actual
  const handleRemoveAttachment = () => {
    setAttachmentInfo(null);
    setIsAttachmentChanged(true);
  };

  return (
    <>
      <Card key={interaction.id} className="border-l-2 border-l-primary">
        <CardHeader className="py-3 px-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7 rounded-full overflow-hidden">
                <AvatarImage
                  src={interaction.autor.image || ""}
                  className="rounded-full object-cover"
                />
                <AvatarFallback>
                  {interaction.autor.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm font-medium">
                  {interaction.autor.name}
                </CardTitle>
                <CardDescription className="text-xs">
                  {format(interaction.createdAt, "eee dd/MM/yyyy", {
                    locale: es,
                  })}
                </CardDescription>
              </div>
            </div>
            <div>
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
                    <Edit className="h-4 w-4 mr-2" />
                    <span>Editar</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => deleteInteraction(interaction.id)}
                    className="text-red-500 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    <span>Eliminar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-2 px-4">
          <p className="text-sm whitespace-pre-wrap">{interaction.content}</p>
        </CardContent>
        {interaction.attachmentUrl && (
          <CardFooter className="py-2 px-4">
            <a
              href={interaction.attachmentUrl}
              download={interaction.attachmentName || true}
              className="flex items-center gap-2 text-xs text-primary hover:underline"
              target="_blank"
            >
              <Download className="h-3 w-3" />
              {interaction.attachmentName || "Archivo adjunto"}
            </a>
          </CardFooter>
        )}
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Interacción</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="content">Contenido</Label>
              <Input
                id="content"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Contenido"
                type="text"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-3">
                <Label>Archivo adjunto</Label>
              </div>

              {/* Mostrar información del archivo actual o permitir subir uno nuevo */}
              {attachmentInfo ? (
                <div className="space-y-2 ">
                  <div className="flex mb-3 items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
                    <FileText className="h-4 w-4" />
                    <span className="truncate max-w-xs">
                      {attachmentInfo.attachmentName}
                    </span>
                  </div>

                  <Label htmlFor="replace-file" className="cursor-pointer">
                    <div className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-2 rounded-md text-sm">
                      <PaperclipIcon className="h-4 w-4" />
                      Cambiar archivo
                    </div>
                    <input
                      type="file"
                      id="replace-file"
                      className="hidden"
                      onChange={handleReplaceFileChange}
                      disabled={isPending}
                    />
                  </Label>
                </div>
              ) : (
                <Label htmlFor="new-file" className="cursor-pointer">
                  <div className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-2 rounded-md text-sm">
                    <PaperclipIcon className="h-4 w-4" />
                    Adjuntar archivo
                  </div>
                  <input
                    type="file"
                    id="new-file"
                    className="hidden"
                    onChange={handleNewFileChange}
                    disabled={isPending}
                  />
                </Label>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setOpenDialog(false)}
                type="button"
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
