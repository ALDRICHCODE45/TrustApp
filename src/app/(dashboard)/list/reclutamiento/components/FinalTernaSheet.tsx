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
import { Ban, FileText, Mail, PlusIcon, UploadIcon, Users } from "lucide-react";
import { Person } from "@prisma/client";

export const FinalTernaSheet = ({ ternaFinal }: { ternaFinal: Person[] }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Users />
        </Button>
      </SheetTrigger>
      <SheetContent className="">
        <SheetHeader className="mt-5 ">
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
                  Agregar candidato
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
                    <div className="*:not-first:mt-3">
                      <Label htmlFor={`j-correo`} className="">
                        Correo electrónico
                      </Label>
                      <Input
                        id={`kk-correo`}
                        placeholder="candidato@ejemplo.com"
                        type="email"
                        required
                        className="mt-2"
                      />
                    </div>
                    <div className="*:not-first:mt-2">
                      <Label htmlFor={`kk-cv`}>Curriculum Vitae (CV)</Label>
                      <div className="mt-2">
                        <div className="border-input bg-background hover:bg-accent flex w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-6 transition-colors">
                          <UploadIcon className="text-muted-foreground mb-2 h-6 w-6" />
                          <div className="text-muted-foreground text-sm">
                            Arrastra y suelta o haz clic para subir
                          </div>
                          <div className="text-muted-foreground/80 text-xs mt-1">
                            PDF, DOCX o TXT (máx. 5MB)
                          </div>
                          <input
                            id={`kk-cv`}
                            type="file"
                            className="sr-only"
                            accept=".pdf,.docx,.doc,.txt"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <DialogFooter className="border-t px-6 py-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="button">Guardar candidato</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          {ternaFinal.length > 0 ? (
            ternaFinal.map((candidato, index) => (
              <Card
                key={index}
                className="shadow-sm hover:shadow-md transition-shadow border-l-2 border-l-primary"
              >
                {/* Header */}
                <CardHeader className="p-3 pb-1">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-medium">
                      {candidato.name}
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-400">
                      {candidato.phone}
                    </CardDescription>
                  </div>
                </CardHeader>

                {/* Content */}
                <CardContent className="p-3 pt-1 space-y-2">
                  {/* Correo electrónico */}
                  <div className="flex flex-col md:flex-row items-start gap-2 justify-between">
                    <div className="flex gap-1 items-center">
                      <Mail size={14} className="text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {candidato.email}
                      </p>
                    </div>
                    <a
                      href={candidato.cv || ""}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <FileText size={14} className="" />
                      <span className="text-sm">Ver CV</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="">
              <CardHeader className="flex items-center justify-center">
                <Ban size={40} className="text-gray-500" />
                <CardTitle className="text-sm text-gray-400 text-center">
                  No hay terna final disponible.
                </CardTitle>
              </CardHeader>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
