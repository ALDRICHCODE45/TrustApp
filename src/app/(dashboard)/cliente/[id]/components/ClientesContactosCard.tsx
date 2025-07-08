import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClientWithRelations } from "@/app/(dashboard)/list/clientes/columns";
import { Mail, Phone, PlusIcon, Users } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const ClientesContactosCard = ({
  client,
}: {
  client: ClientWithRelations;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Users size={16} />
          Contactos
        </CardTitle>
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
                      <Label htmlFor={`jsakdjfk-telefono`}>Puesto</Label>
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
      </CardHeader>
      <CardContent className="pt-4">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {client.contactos.map((contacto, index) => (
              <Card key={index} className="shadow-none border w-full">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10 hidden md:block">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {contacto.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{contacto.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {contacto.position}
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail
                            size={14}
                            className="text-muted-foreground flex-shrink-0"
                          />
                          <p className="truncate">{contacto.email}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone
                            size={14}
                            className="text-muted-foreground flex-shrink-0"
                          />
                          <p className="truncate">{contacto.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
