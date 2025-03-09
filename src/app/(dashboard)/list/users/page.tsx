import { User, UsersData } from "@/lib/data";
import { UserColumns } from "./columns";
import { DataTable } from "@/components/Table";

import { type ReactElement } from "react";
import { ColumnDef } from "@tanstack/react-table";

export interface pageProps {}

const fetchUsers = async () => {
  return new Promise<{ columns: ColumnDef<User>[]; data: User[] }>(
    (resolve) => {
      setTimeout(() => {
        resolve({
          columns: UserColumns,
          data: UsersData,
        });
      }, 2000); // Retraso de 2 segundos
    }
  );
};
export default async function TeachersList({}: pageProps): Promise<ReactElement> {
  const { columns, data } = await fetchUsers();
  return (
    <>
      {/* LIST */}
      <DataTable columns={columns} data={data} />
    </>
  );
}
