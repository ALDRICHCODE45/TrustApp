import { LeadOrigen } from "@prisma/client";
import { origenColumns } from "../../../components/tables/columns/OrigenesTableColumns";
import { OrigenesTable } from "../../../components/tables/OrigenesTable";
import { CreateNewOrigenForm } from "../../../components/CreateNewOrigenForm";

interface Props {
  origenes: LeadOrigen[];
}

export const OrigenesSections = ({ origenes }: Props) => {
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Orígenes de Leads
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Gestiona los diferentes orígenes de donde provienen tus leads
          </p>
        </div>

        <div className="p-6">
          {/* Tabla con scroll interno si es necesario */}
          <div className="bg-gray-50 rounded-lg p-4 h-full overflow-y-auto">
            <OrigenesTable columns={origenColumns} data={origenes} />
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <CreateNewOrigenForm />
          </div>
        </div>
      </div>
    </>
  );
};
