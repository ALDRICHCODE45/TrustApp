import { ClientWithRelations } from "@/app/(dashboard)/list/clientes/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export const ResumenFinancieroCard = ({
  client,
}: {
  client: ClientWithRelations;
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp size={16} />
          Resumen Financiero
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">
              Ingresos Totales
            </p>
            <p className="text-2xl font-bold">$10,000</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Placements</p>
              <p className="text-xl font-semibold">{client.placements}</p>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">
                Valor Promedio
              </p>
              <p className="text-xl font-semibold">
                ${client.tp_placement?.toFixed(2) ?? 0}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
