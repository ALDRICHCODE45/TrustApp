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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Cliente } from "@/lib/data";
import { Mail, PlusIcon, UploadIcon, Users } from "lucide-react";

export function ContactosSheet({
  contactos,
}: {
  contactos: Cliente["contactos"];
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Users />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mt-5">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1" variant="outline">
                <PlusIcon size={16} />
                <span>Agregar</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
              <DialogHeader className="contents space-y-0 text-left">
                <DialogTitle className="border-b px-6 py-4 text-base">
                  Agregar Contacto
                </DialogTitle>
              </DialogHeader>
              <DialogDescription className="sr-only">
                Completar la información del nuevo candidato.
              </DialogDescription>
              <div className="overflow-y-auto">
                <div className="px-6 pt-4 pb-6">
                  <form className="space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`j-nombre`}>Nombre completo</Label>
                        <Input
                          id={`kkk-nombre`}
                          placeholder="Juan Pérez"
                          type="text"
                          required
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`jsakdjfk-telefono`}>Teléfono</Label>
                        <Input
                          id={`jj-telefono`}
                          placeholder="555-123-4567"
                          type="tel"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`j-correo`}>Correo electrónico</Label>
                        <Input
                          id={`kk-correo`}
                          placeholder="candidato@ejemplo.com"
                          type="email"
                          required
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label>Posicion</Label>
                        <Input
                          id={`jj-telefono`}
                          placeholder="Dr General"
                          type="text"
                          required
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <DialogFooter className="border-t px-6 py-4">
                <DialogClose asChild>
                  <Button type="button" size="sm" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="button" size="sm">
                    Guardar contacto
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          {contactos.map((contacto, index) => (
            <Card
              key={index}
              className="shadow-sm hover:shadow-md transition-shadow border-l-2 border-l-primary"
            >
              {/* Header */}
              <CardHeader className="p-3 pb-1">
                <div className="space-y-1">
                  <CardTitle className="text-base font-medium flex justify-between items-center">
                    {contacto.nombre}
                    <span className="font-light text-sm">
                      {contacto.puesto}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-400">
                    {contacto.celular}
                  </CardDescription>
                </div>
              </CardHeader>

              {/* Content */}
              <CardContent className="p-3 pt-1 space-y-2">
                {/* Correo electrónico */}
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex gap-1 items-center">
                    <Mail size={14} className="text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {contacto.correo}
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
