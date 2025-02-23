"use client";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Pencil } from "lucide-react";

export default function EditProfile() {
  return (
    <Dialog>
      {/* TooltipProvider envuelve todo el componente */}
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b border-border px-6 py-4 text-base">
            Editar Perfil
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Make changes to your profile here. You can change your photo and set a
          username.
        </DialogDescription>
        <div className="overflow-y-auto">
          <ProfileBg />
          <Avatar />
          <div className="px-6 pb-6 pt-4">
            <form className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="first-name">Nombre</Label>
                  <Input id="first-name" placeholder="Jane" type="text" />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="last-name">Apellidos</Label>
                  <Input id="last-name" placeholder="Doe" type="text" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Correo electrónico</Label>
                <div className="relative">
                  <Input id="username" placeholder="Email" type="text" />
                </div>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="first-name">Edad</Label>
                  <Input id="first-name" placeholder="33" type="text" />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="last-name">Dirección</Label>
                  <Input id="last-name" placeholder="CDMX" type="text" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Celular</Label>
                <div className="flex rounded-lg shadow-sm shadow-black/5">
                  <Input id="website" placeholder="+52 55..." type="text" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Comentarios</Label>
                <Textarea
                  id="bio"
                  placeholder="Reclutador siempre llega tarde"
                />
                <p className="mt-2 text-right text-xs text-muted-foreground">
                  180 caracteres sobrantes
                </p>
              </div>
            </form>
          </div>
        </div>
        <DialogFooter className="border-t border-border px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button">Guardar Cambios</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProfileBg() {
  return (
    <div className="h-32">
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-muted">
        <img
          className="h-full w-full object-cover"
          src="https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Default profile background"
          width={512}
          height={96}
        />
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          <button
            type="button"
            className="z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white outline-offset-2 transition-colors hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70"
            aria-label="Upload image"
          >
            <ImagePlus size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <div className="-mt-10 px-6">
      <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-muted shadow-sm shadow-black/10">
        <img
          src="https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200"
          className="h-full w-full object-cover"
          width={80}
          height={80}
          alt="Profile image"
        />
        <button
          type="button"
          className="absolute flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white outline-offset-2 transition-colors hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70"
          aria-label="Change profile picture"
        >
          <ImagePlus size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
