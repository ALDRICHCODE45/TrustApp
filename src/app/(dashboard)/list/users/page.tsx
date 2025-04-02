import { User, UsersData } from "@/lib/data";
import { UserColumns } from "./columns";
import { type ReactElement } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { UsersTable } from "./table/UsersTable";
import { auth } from "@/lib/auth";

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
    },
  );
};
export default async function TeachersList({}: pageProps): Promise<ReactElement> {
  const session = await auth();
  if (!session) return <div>Not authenticated</div>;
  const { columns, data } = await fetchUsers();
  return (
    <>
      {/* LIST */}
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <UsersTable columns={columns} data={data} />
    </>
  );
}
