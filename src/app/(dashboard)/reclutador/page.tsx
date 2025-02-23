import { DataTable } from "@/components/Table";
import { usuario_logeado, vacantes } from "@/lib/data";
import { type ReactElement } from "react";
import { reclutadorColumns } from "./components/ReclutadorColumns";

export interface PageProps {}

export default function StudentPage({}: PageProps): ReactElement {
  const vacantesFiltradas = vacantes.filter(
    (vacante) => vacante.reclutador.id === usuario_logeado.id
  );

  return (
    <>
      <div className="bg-white dark:bg-[#0e0e0e] p-4 rounded-md flex-1 m-4 mt-0">
        {/* LIST */}
        <div className="mt-4">
          <DataTable columns={reclutadorColumns} data={vacantesFiltradas} />
        </div>
      </div>
    </>
  );
}
