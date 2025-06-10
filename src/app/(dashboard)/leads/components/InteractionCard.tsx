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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Download,
  Edit,
  Loader2,
  MoreVertical,
  PaperclipIcon,
  RefreshCw,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Attachment } from "./ContactCard";
import { deleteFile, uploadFile } from "@/actions/files/actions";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ConfirmDialog } from "@/components/ConfirmDialog";

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

  return (
    <>
      <InteractionCardView
        interaction={interaction}
        setOpenDialog={setOpenDialog}
        deleteInteraction={(id) => handleDeleteInteraction(id, setInteractions)}
      />

      <EditInteractionDialog
        open={openDialog}
        setOpen={setOpenDialog}
        isPending={isPending}
        newContent={newContent}
        setNewContent={setNewContent}
        attachmentInfo={attachmentInfo}
        interaction={interaction}
        handleSubmit={(e) =>
          handleSubmit(
            e,
            newContent,
            attachmentInfo,
            isAttachmentChanged,
            interaction,
            setInteractions,
            setIsPending,
            setOpenDialog,
            setIsAttachmentChanged,
          )
        }
        handleNewFileChange={(e) =>
          handleNewFileChange(
            e,
            setIsPending,
            setAttachmentInfo,
            setIsAttachmentChanged,
          )
        }
        handleDeleteFile={() => {
          setAttachmentInfo(null);
          setIsAttachmentChanged(true);
        }}
      />
    </>
  );
};

// Componente para la vista de la tarjeta de interacción
const InteractionCardView = ({
  interaction,
  setOpenDialog,
  deleteInteraction,
}: {
  interaction: ContactInteractionWithRelations;
  setOpenDialog: (open: boolean) => void;
  deleteInteraction: (id: string) => void;
}) => {
  return (
    <Card
      key={interaction.id}
      className={cn(
        "border-l-4 relative group hover:shadow-md transition-all duration-200 w-full min-h-fit overflow-hidden",
        interaction.attachmentUrl ? "border-l-blue-500" : "border-l-primary",
      )}
    >
      <CardHeader className="py-3 px-4 pb-2 pr-12">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <InteractionAuthorInfo interaction={interaction} />
          </div>
          <div className="flex-shrink-0">
            <InteractionOptionsMenu
              interactionId={interaction.id}
              content={interaction.content}
              setOpenDialog={setOpenDialog}
              deleteInteraction={deleteInteraction}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2 px-4 pr-8">
        <p className="text-sm whitespace-pre-wrap break-words hyphens-auto leading-relaxed">{interaction.content}</p>
      </CardContent>
      {interaction.attachmentUrl && (
        <AttachmentFooter
          attachmentUrl={interaction.attachmentUrl}
          attachmentName={interaction.attachmentName}
        />
      )}
    </Card>
  );
};

// Componente para la información del autor
const InteractionAuthorInfo = ({
  interaction,
}: {
  interaction: ContactInteractionWithRelations;
}) => {
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `hace ${diffInSeconds} segundos`;

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `hace ${diffInMinutes} minutos`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `hace ${diffInHours} horas`;

    // Si es más de un día, mostrar la fecha formateada
    return format(date, "eee dd/MM/yyyy", { locale: es });
  };

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8 ring-2 ring-offset-2 ring-primary/20">
        <AvatarImage
          src={interaction.autor.image || ""}
          className="object-cover"
        />
        <AvatarFallback className="bg-primary/10 text-primary font-medium">
          {interaction.autor.name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <CardTitle className="text-sm font-medium">
          {interaction.autor.name}
        </CardTitle>
        <CardDescription className="text-xs flex items-center gap-1">
          <span>{getTimeAgo(interaction.createdAt)}</span>
          {interaction.createdAt !== interaction.updatedAt && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span className="text-xs text-muted-foreground italic flex items-center">
                    <RefreshCw className="h-3 w-3 ml-1" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    Editado:{" "}
                    {format(interaction.updatedAt, "dd/MM/yyyy HH:mm", {
                      locale: es,
                    })}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardDescription>
      </div>
    </div>
  );
};

// Componente para el menú de opciones
const InteractionOptionsMenu = ({
  interactionId,
  content,
  setOpenDialog,
  deleteInteraction,
}: {
  interactionId: string;
  content: string;
  setOpenDialog: (open: boolean) => void;
  deleteInteraction: (id: string) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[999]">
        <DropdownMenuItem
          onClick={() => setOpenDialog(true)}
          className="cursor-pointer"
        >
          <Edit className="h-4 w-4 mr-2" />
          <span>Editar</span>
        </DropdownMenuItem>
        <ConfirmDialog
          title="¿De verdad deseas eliminar la interacción?"
          description="La interacción será eliminada de forma permanente y no podrás restablecerla."
          trigger={
            <div className="text-red-500 cursor-pointer flex items-center p-1  text-sm  rounded-sm hover:bg-gray-100">
              <Trash2 className="h-4 w-4 ml-1" />
              <span className="ml-4">Eliminar</span>
            </div>
          }
          onConfirm={async () => deleteInteraction(interactionId)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Componente para el footer con el archivo adjunto
const AttachmentFooter = ({
  attachmentUrl,
  attachmentName,
}: {
  attachmentUrl: string;
  attachmentName: string | null;
}) => {
  const getFileIcon = () => {
    const fileType = attachmentUrl.split(".").pop()?.toLowerCase() || "";
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(fileType))
      return "🖼️";
    if (fileType === "pdf") return "📄";
    if (["doc", "docx"].includes(fileType)) return "📝";
    if (["xls", "xlsx", "csv"].includes(fileType)) return "📊";
    if (["mp4", "webm", "avi", "mov"].includes(fileType)) return "🎬";
    if (["mp3", "wav", "ogg"].includes(fileType)) return "🎵";
    return "📎";
  };

  return (
    <CardFooter className="py-3 px-4 bg-slate-50 dark:bg-slate-900/30 rounded-b-lg flex items-center gap-2">
      <span className="text-lg">{getFileIcon()}</span>
      <a
        href={attachmentUrl}
        download={attachmentName || true}
        className="flex flex-1 items-center gap-2 text-sm text-primary hover:underline group"
        target="_blank"
      >
        <span className="truncate max-w-[200px]">
          {attachmentName || "Archivo adjunto"}
        </span>
        <Download className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>
    </CardFooter>
  );
};

// Componente para el diálogo de edición
const EditInteractionDialog = ({
  open,
  setOpen,
  isPending,
  newContent,
  setNewContent,
  attachmentInfo,
  interaction,
  handleSubmit,
  handleNewFileChange,
  handleDeleteFile,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  isPending: boolean;
  newContent: string;
  setNewContent: (content: string) => void;
  attachmentInfo: Attachment | null;
  interaction: ContactInteractionWithRelations;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleNewFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => Promise<void>;
  handleDeleteFile: () => void;
}) => {
  const getFileIcon = () => {
    const fileType = attachmentInfo?.attachmentType || "";
    if (fileType.includes("image")) return "🖼️";
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("word") || fileType.includes("document")) return "📝";
    if (fileType.includes("excel") || fileType.includes("sheet")) return "📊";
    if (fileType.includes("video")) return "🎬";
    if (fileType.includes("audio")) return "🎵";
    return "📎";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Editar Interacción</DialogTitle>
          <DialogDescription>
            Modifica el contenido o los archivos adjuntos de esta interacción
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="content">Contenido</Label>
            <Textarea
              id="content"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Escribe el contenido de la interacción..."
              className="min-h-[100px] resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <PaperclipIcon className="h-4 w-4" />
              Archivo adjunto
            </Label>

            {attachmentInfo ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm bg-muted/50 px-3 py-3 rounded-md">
                  <span className="text-lg">{getFileIcon()}</span>
                  <span className="truncate flex-1 max-w-[200px]">
                    <a
                      className="underline"
                      href={attachmentInfo.attachmentUrl}
                      target="_blank"
                    >
                      {attachmentInfo.attachmentName}
                    </a>
                  </span>
                  <div className="flex gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <ConfirmDialog
                            title="¿Seguro que desea eliminar el archivo?"
                            description="Esta acción no puede deshacerse y eliminará permanentemente el archivo."
                            onConfirm={async () => handleDeleteFile()}
                            trigger={
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                type="button"
                                disabled={isPending}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            }
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Eliminar archivo</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            ) : (
              <FileUploadArea
                isPending={isPending}
                handleNewFileChange={handleNewFileChange}
              />
            )}
          </div>

          <DialogFooter className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              type="button"
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending || newContent === ""}
              className="relative"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>Guardar cambios</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Componente para el área de carga de archivos
const FileUploadArea = ({
  isPending,
  handleNewFileChange,
}: {
  isPending: boolean;
  handleNewFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => Promise<void>;
}) => {
  return (
    <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-4 text-center">
      <Label
        htmlFor="new-file"
        className={cn(
          "cursor-pointer",
          isPending && "opacity-50 cursor-not-allowed",
        )}
      >
        <div className="flex flex-col items-center gap-2 py-4">
          <UploadCloud className="h-8 w-8 text-muted-foreground/70" />
          <p className="text-sm font-medium">
            Arrastra un archivo o haz clic para seleccionar
          </p>
          <p className="text-xs text-muted-foreground">
            Subir archivo adjunto (PDF, imágenes, documentos)
          </p>
        </div>
        <input
          type="file"
          id="new-file"
          className="hidden"
          onChange={handleNewFileChange}
          disabled={isPending}
        />
      </Label>
    </div>
  );
};

// Funciones auxiliares
const handleDeleteInteraction = async (
  interactionId: string,
  setInteractions: React.Dispatch<
    React.SetStateAction<ContactInteractionWithRelations[]>
  >,
) => {
  try {
    const promise = deleteInteractionById(interactionId);
    toast.promise(promise, {
      loading: "Eliminando interacción...",
      success: () => {
        setInteractions((prevItems) =>
          prevItems.filter((item) => item.id !== interactionId),
        );
        return "Interacción eliminada con éxito";
      },
      error: "Error al eliminar la interacción",
    });
  } catch (err) {
    toast.error("Error inesperado");
  }
};

const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>,
  newContent: string,
  attachmentInfo: Attachment | null,
  isAttachmentChanged: boolean,
  interaction: ContactInteractionWithRelations,
  setInteractions: React.Dispatch<
    React.SetStateAction<ContactInteractionWithRelations[]>
  >,
  setIsPending: React.Dispatch<React.SetStateAction<boolean>>,
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>,
  setIsAttachmentChanged: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  e.preventDefault();
  setIsPending(true);

  const formData = new FormData();
  formData.append("content", newContent);

  if (attachmentInfo && isAttachmentChanged) {
    formData.append("attachment", JSON.stringify(attachmentInfo));
  } else if (!attachmentInfo && interaction.attachmentUrl) {
    formData.append("removeAttachment", "true");
  }

  try {
    const interactionUpdated = await editInteractionById(
      interaction.id,
      formData,
    );

    if (!interactionUpdated) {
      toast.error("La interacción no se pudo actualizar");
      return;
    }

    setInteractions((prevItems) =>
      prevItems.map((item) =>
        item.id === interaction.id
          ? {
              ...item,
              content: newContent,
              attachmentUrl: attachmentInfo?.attachmentUrl || null,
              attachmentName: attachmentInfo?.attachmentName || null,
              attachmentType: attachmentInfo?.attachmentType || null,
              updatedAt: new Date(),
            }
          : item,
      ),
    );

    setIsAttachmentChanged(false);
    toast.success("Interacción actualizada correctamente");
  } catch (err) {
    console.error(err);
    toast.error("Algo salió mal al actualizar la interacción");
  } finally {
    setIsPending(false);
    setOpenDialog(false);
  }
};

const handleNewFileChange = async (
  e: React.ChangeEvent<HTMLInputElement>,
  setIsPending: React.Dispatch<React.SetStateAction<boolean>>,
  setAttachmentInfo: React.Dispatch<React.SetStateAction<Attachment | null>>,
  setIsAttachmentChanged: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    setIsPending(true);
    const formData = new FormData();
    formData.append("file", file);

    toast.loading("Subiendo archivo...");
    const attachment = await uploadFile(formData);

    if (attachment.success) {
      setAttachmentInfo({
        attachmentName: attachment.fileName,
        attachmentType: attachment.fileType,
        attachmentUrl: attachment.url,
      });
      setIsAttachmentChanged(true);
      toast.dismiss();
      toast.success("Archivo subido correctamente");
    } else {
      toast.dismiss();
      toast.error("Error al subir el archivo");
    }
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    toast.dismiss();
    toast.error("Error al subir el archivo");
  } finally {
    setIsPending(false);
  }
};

// Función para eliminar completamente un archivo (fuera del contexto de edición)
const handleDeleteFileCompletely = async (
  fileName: string,
  interactionId: string,
  setAttachmentInfo: React.Dispatch<React.SetStateAction<Attachment | null>>,
  setInteractions: React.Dispatch<
    React.SetStateAction<ContactInteractionWithRelations[]>
  >,
) => {
  if (!fileName || fileName.length < 5) {
    throw new Error("");
  }

  const fileKey = fileName.split("/").pop();

  if (!fileKey) {
    console.log({ fileKey });
    throw new Error("File key error");
  }

  const { ok, message } = await deleteFile(fileKey, interactionId);

  if (!ok) {
    toast.error(message);
    return;
  }

  toast.success(message);
  setAttachmentInfo(null);

  setInteractions((prevItems) =>
    prevItems.map((item) =>
      item.id === interactionId
        ? {
            ...item,
            attachmentUrl: null,
            attachmentName: null,
            attachmentType: null,
          }
        : item,
    ),
  );
};
