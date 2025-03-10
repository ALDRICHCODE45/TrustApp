import { type ReactElement } from "react";
import { vacantesColumns } from "./columns";
import { Vacante, vacantes } from "@/lib/data";
import { CreateVacanteForm } from "./components/CreateVacanteForm";
import { RecruiterTable } from "./table/RecruiterTable";
import { ColumnDef } from "@tanstack/react-table";

export interface pageProps {}

const fetchVacantes = async () => {
  return new Promise<{ columns: ColumnDef<Vacante>[]; data: Vacante[] }>(
    (resolve) => {
      setTimeout(() => {
        resolve({
          columns: vacantesColumns,
          data: vacantes,
        });
      }, 2000); // Retraso de 2 segundos
    }
  );
};

export default async function ReclutamientoPage({}: pageProps): Promise<ReactElement> {
  const { columns, data } = await fetchVacantes();
  return (
    <>
      {/* Reclutamiento Form */}
      <CreateVacanteForm />
      {/* LIST */}
      <RecruiterTable columns={columns} data={data} />
    </>
  );
}
