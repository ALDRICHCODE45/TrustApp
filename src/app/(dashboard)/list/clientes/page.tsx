import { ReactElement } from "react";
import { DataTable } from "@/components/Table";
import { clientesColumns } from "./columns";
import { Cliente, clientesData } from "@/lib/data";
import { ColumnDef } from "@tanstack/react-table";
import { checkRoleRedirect } from "../../../helpers/checkRoleRedirect";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";

interface pageProps {}

const fetchUsers = async () => {
  return new Promise<{ columns: ColumnDef<Cliente>[]; data: Cliente[] }>(
    (resolve) => {
      setTimeout(() => {
        resolve({
          columns: clientesColumns,
          data: clientesData,
        });
      }, 2000);
    },
  );
};

export default async function ClientesList({}: pageProps): Promise<ReactElement> {
  const { columns, data } = await fetchUsers();
  const session = await auth();
  checkRoleRedirect(session?.user.role as Role, [Role.Admin]);

  return (
    <>
      {/* LIST */}
      <DataTable columns={columns} data={data} />
    </>
  );
}
