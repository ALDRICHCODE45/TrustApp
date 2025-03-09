import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cliente } from "@/lib/data";
import { CreditCard } from "lucide-react";

export const CardCommercialInformation = ({ client }: { client: Cliente }) => {
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard size={16} />
            Información Comercial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div>
            <p className="text-sm text-muted-foreground">ID del Cliente</p>
            <p className="font-medium">{client.clienteId}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Origen</p>
            <p className="font-medium">{client.origen}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Fee</p>
            <p className="font-medium">${client.fee.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Días de Crédito</p>
            <p className="font-medium">{client.dias_credito} días</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tipo de Factura</p>
            <p className="font-medium">{client.tipo_factura}</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
