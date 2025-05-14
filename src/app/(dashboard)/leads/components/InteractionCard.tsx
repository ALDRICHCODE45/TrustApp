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
  Loader2,
  MoreVertical,
  PaperclipIcon,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  interaction: ContactInteractionWithRelations;
  setInteractions: React.Dispatch<
    React.SetStateAction<ContactInteractionWithRelations[]>
  >;
}

export const InteractionCard = ({ interaction, setInteractions }: Props) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [attachment, setAttachment] = useState<File | null>(null);

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
    const formData = new FormData(e.currentTarget);
    try {
      const interactionUpdated = await editInteractionById(
        interaction.id,
        formData,
      );
      if (!interactionUpdated) {
        toast.error("La interaccion no se pudo completar");
        return;
      }
      setInteractions((prevItems) =>
        prevItems.map((item) =>
          item.id === interaction.id
            ? { ...item, ...interactionUpdated }
            : item,
        ),
      );

      toast.success("Contacto editado con exito");
    } catch (err) {
      toast.error("Algo salio mal..");
    } finally {
      setIsPending(false);
      setOpenDialog(false);
    }
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
                    <Edit />
                    <span>Editar</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => deleteInteraction(interaction.id)}
                    className="text-red-500 cursor-pointer "
                  >
                    <Trash2 />
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
            <DialogTitle>Editar contacto</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1 space-y-2">
                <Label htmlFor="nombre">Contenido</Label>
                <Input
                  name="content"
                  id="content"
                  placeholder="Contenido"
                  type="text"
                  required
                  defaultValue={interaction.content}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="attachment" className="cursor-pointer">
                <div className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-2 rounded-md text-sm">
                  <PaperclipIcon className="h-4 w-4" />
                  {attachment ? "Cambiar archivo" : "Adjuntar archivo"}
                </div>
                <input type="file" id="attachment" className="hidden" />
              </Label>
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
