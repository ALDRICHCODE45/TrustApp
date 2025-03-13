import { ReactElement } from "react";
import { DataTable } from "@/components/Table";
import { clientesColumns } from "./columns";
import { Cliente, clientesData } from "@/lib/data";
import { ColumnDef } from "@tanstack/react-table";

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

  return (
    <>
      {/* LIST */}
      <DataTable columns={columns} data={data} />
    </>
  );
}
