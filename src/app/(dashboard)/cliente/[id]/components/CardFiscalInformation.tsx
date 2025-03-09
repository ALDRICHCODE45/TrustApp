import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cliente } from "@/lib/data";
import { FileText } from "lucide-react";

export const CardFiscalInformation = ({ client }: { client: Cliente }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText size={16} />
          Información Fiscal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div>
          <p className="text-sm text-muted-foreground">Razón Social</p>
          <p className="font-medium">{client.razon_social}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Régimen</p>
          <p className="font-medium">{client.regimen}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">RFC</p>
          <p className="font-medium">{client.rfc}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Código Postal</p>
          <p className="font-medium">{client.cp}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Cómo Factura</p>
          <p className="font-medium">{client.como_factura}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Portal</p>
          {client.portal_site ? (
            <a
              href={client.portal_site}
              target="_blank"
              className="text-primary underline underline-offset-4 font-medium"
            >
              {client.portal_site}
            </a>
          ) : (
            <p className="text-destructive">N/A</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
