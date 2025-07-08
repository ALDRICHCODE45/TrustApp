import { ClientWithRelations } from "@/app/(dashboard)/list/clientes/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export const CardCommercialInformation = ({
  client,
}: {
  client: ClientWithRelations;
}) => {
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
            <p className="font-medium">{client.id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Origen</p>
            <p className="font-medium">{client.lead?.origen.nombre}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Fee</p>
            <p className="font-medium">${client.fee?.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Días de Crédito</p>
            <p className="font-medium">{client.dias_credito ?? 0} días</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tipo de Factura</p>
            <p className="font-medium">{client.modalidad}</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
