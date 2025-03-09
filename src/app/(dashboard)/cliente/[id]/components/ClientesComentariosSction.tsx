import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Cliente } from "@/lib/data";
import { MessageSquare } from "lucide-react";

export const ClientesComentariosSections = ({
  client,
}: {
  client: Cliente;
}) => {
  return (
    <ScrollArea className="h-96 pr-4">
      <div className="space-y-4">
        {client.comentarios.length > 0 ? (
          client.comentarios.map((comentario, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="py-3 bg-muted/30">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">SP</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Salvador Perea</p>
                      <p className="text-xs text-muted-foreground">23-1-2025</p>
                    </div>
                  </div>
                  <Badge variant="outline">{comentario.tipo || "Nota"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="py-3">
                <p className="text-sm">{comentario.texto}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-20" />
            <p>No hay comentarios disponibles</p>
            <Button size="sm" variant="link" className="mt-2">
              Agregar el primer comentario
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
