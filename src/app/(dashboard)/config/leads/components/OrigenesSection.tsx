import { LeadOrigen } from "@prisma/client";
import { origenColumns } from "../../../admin/components/tables/columns/OrigenesTableColumns";
import { OrigenesTable } from "../../../admin/components/tables/OrigenesTable";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Database } from "lucide-react";

interface Props {
  origenes: LeadOrigen[];
}

export const OrigenesSections = ({ origenes }: Props) => {
  return (
    <div className="space-y-6">
      {/* Tabla de orígenes */}
      <Card>
        <CardHeader>
          <div className="">
            <div>
              <CardTitle>Orígenes de Leads</CardTitle>
              <CardDescription>
                Gestiona los diferentes canales de donde provienen tus leads
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          {origenes.length > 0 ? (
            <div className="p-5">
              <OrigenesTable columns={origenColumns} data={origenes} />
            </div>
          ) : (
            <div className="text-center py-12">
              <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No hay orígenes configurados
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comienza agregando tu primer origen de leads
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
