import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { clientesData } from "@/lib/data";

export const DatosClienteDrawer = ({ row }: { row: any }) => {
  const clientId = row.original.clientId;
  const client = clientesData.find((cliente) => cliente.id === clientId);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Cliente</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="font-semibold text-center">
            Información del Cliente
          </DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground text-center">
            Detalles del cliente seleccionado.
          </DrawerDescription>
        </DrawerHeader>

        {/* Contenido principal del Drawer */}
        <div className="p-4">
          <Card className="w-full max-w-md mx-auto mb-[30px]">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Cliente #{client?.clienteId}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Régimen Fiscal
                </span>
                <span className="text-sm font-semibold">{client?.regimen}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  RFC
                </span>
                <span className="text-sm font-semibold">{client?.rfc}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Código Postal
                </span>
                <span className="text-sm font-semibold">{client?.cp}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Tipo de Persona
                </span>
                <span className="text-sm font-semibold">{client?.tipo}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
