import { Sector } from "@prisma/client";
import { OrigenesTable } from "../../../admin/components/tables/OrigenesTable";
import { sectoresColumns } from "../../../admin/components/tables/columns/SectionsTableColumns";
import { CreateNewSectorForm } from "../../../admin/components/CreateNewSectorForm";

interface Props {
  sectores: Sector[];
}

export const SectoresSection = ({ sectores }: Props) => {
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Sectores de Leads
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Gestiona los diferentes sectores de donde provienen tus leads
          </p>
        </div>

        <div className="p-6">
          {/* Tabla con scroll interno si es necesario */}
          <div className="bg-gray-50 rounded-lg p-4 h-full overflow-y-auto">
            <OrigenesTable columns={sectoresColumns} data={sectores} />
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <CreateNewSectorForm />
          </div>
        </div>
      </div>
    </>
  );
};
