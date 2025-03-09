import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Cliente } from "@/lib/data";
import { Mail, Phone, PlusCircle, Users } from "lucide-react";

export const ClientesContactosCard = ({ client }: { client: Cliente }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Users size={16} />
          Contactos
        </CardTitle>
        <Button size="sm" variant="outline">
          <PlusCircle size={16} />
          <span className="hidden md:block">Agregar contacto</span>
        </Button>
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
                        {contacto.nombre.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{contacto.nombre}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {contacto.puesto}
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail
                            size={14}
                            className="text-muted-foreground flex-shrink-0"
                          />
                          <p className="truncate">{contacto.correo}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone
                            size={14}
                            className="text-muted-foreground flex-shrink-0"
                          />
                          <p className="truncate">{contacto.celular}</p>
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
