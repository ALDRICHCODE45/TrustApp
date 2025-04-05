import { ReactElement } from "react";
import { cuentaColumns } from "./cuentaColumns";
import { Cuenta, cuentaData } from "@/lib/data";
import { DataTable } from "@/components/Table";
import { ColumnDef } from "@tanstack/react-table";
import { auth } from "@/lib/auth";
import { checkRoleRedirect } from "../../../helpers/checkRoleRedirect";
import { Role } from "@prisma/client";

interface pageProps {}

const fetchFacturas = async () => {
  return new Promise<{ columns: ColumnDef<Cuenta>[]; data: Cuenta[] }>(
    (resolve) => {
      setTimeout(() => {
        resolve({
          columns: cuentaColumns,
          data: cuentaData,
        });
      }, 200);
    },
  );
};

export default async function Cuentas({}: pageProps): Promise<ReactElement> {
  const { columns, data } = await fetchFacturas();

  const session = await auth();
  checkRoleRedirect(session?.user.role as Role, [Role.Admin]);

  return (
    <>
      {/* LIST */}
      <DataTable columns={columns} data={data} />
    </>
  );
}
