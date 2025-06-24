import { type ReactElement } from "react";
import { vacantesColumns } from "./columns";
import { Vacante, vacantes } from "@/lib/data";
import { ColumnDef } from "@tanstack/react-table";
import { auth } from "@/lib/auth";
import { checkRoleRedirect } from "../../../helpers/checkRoleRedirect";
import { Role } from "@prisma/client";
import { Metadata } from "next";
import { RecruiterTable } from "./table/RecruiterTableOptimized";

export interface pageProps {}

export const metadata: Metadata = {
  title: "Trust | Reclutamiento",
};

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

  const session = await auth();
  checkRoleRedirect(session?.user.role as Role, [Role.Admin]);

  return (
    <>
      {/* LIST */}
      <RecruiterTable columns={columns} data={data} />
    </>
  );
}
