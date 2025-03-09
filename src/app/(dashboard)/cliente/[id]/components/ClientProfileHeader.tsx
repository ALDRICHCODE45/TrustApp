import { Card } from "@/components/ui/card";
import { Cliente, usuario_logeado } from "@/lib/data";
import { EditClientProfile } from "./EditCliente";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Pencil, Plus, PlusCircle } from "lucide-react";

export const ClientProfileHeader = ({ client }: { client: Cliente }) => {
  const getClientStatus = () => {
    if (client.placements > 5) return "outline";
    if (client.placements > 2) return "destructive";
    return "default";
  };

  return (
    <div className="mb-6">
      <Card className="overflow-hidden border-none shadow-sm">
        <div className="h-32 bg-gradient-to-r from-primary/10 to-primary/5 relative">
          {usuario_logeado?.role === "admin" && (
            <div className="absolute top-4 right-4">
              <EditClientProfile />
            </div>
          )}
        </div>

        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center -mt-12">
            <Avatar className="w-24 h-24 border-4 border-background shadow-md">
              <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                {client.nombre.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="pt-2 sm:pt-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-2xl font-bold">{client.nombre}</h1>
                <Badge variant={getClientStatus()} className="h-6 px-3">
                  {client.modalidad}
                </Badge>
              </div>
              <p className="text-muted-foreground">{client.cuenta}</p>
            </div>

            <div className="sm:ml-auto flex flex-wrap gap-2 mt-2 sm:mt-0">
              <Button size="sm" variant="outline">
                <PlusCircle />
                <span>Nuevo comentario</span>
              </Button>
              <Button size="sm" variant="default">
                <PlusCircle />
                <span>Nueva vacante</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
