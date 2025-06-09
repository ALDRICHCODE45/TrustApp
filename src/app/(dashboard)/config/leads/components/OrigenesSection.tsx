import { LeadOrigen } from "@prisma/client";
import { origenColumns } from "../../../admin/components/tables/columns/OrigenesTableColumns";
import { OrigenesTable } from "../../../admin/components/tables/OrigenesTable";
import { CreateNewOrigenForm } from "../../../admin/components/CreateNewOrigenForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Props {
  origenes: LeadOrigen[];
}

export const OrigenesSections = ({ origenes }: Props) => {
  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="border-b-gray-200">
          <h3 className="text-lg font-semibold ">Orígenes de Leads</h3>
          <p className="text-sm mt-1">
            Gestiona los diferentes orígenes de donde provienen tus leads
          </p>
          <div className="w-full h-px bg-gray-200 mt-3" />
        </CardHeader>

        <CardContent className="p-6">
          {/* Tabla con scroll interno si es necesario */}
          <div className="rounded-lg p-4 h-full overflow-y-auto">
            <OrigenesTable columns={origenColumns} data={origenes} />
          </div>

          <div className="mt-6 pt-6 border-t">
            <CreateNewOrigenForm />
          </div>
        </CardContent>
      </Card>
    </>
  );
};
