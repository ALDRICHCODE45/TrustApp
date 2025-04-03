import { UserColumns } from "./columns";
import { type ReactElement } from "react";
import { UsersTable } from "./table/UsersTable";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export interface pageProps {}

const fetchUsers = async () => {
  const users = await prisma.user.findMany();
  return {
    columns: UserColumns,
    data: users,
  };
};

export default async function UserList({}: pageProps): Promise<ReactElement> {
  const session = await auth();
  if (!session) return <div>Not authenticated</div>;
  const { columns, data } = await fetchUsers();

  return (
    <>
      {/* LIST */}
      <UsersTable columns={columns} data={data} />
    </>
  );
}
