import { UserColumns } from "./columns";
import { type ReactElement } from "react";
import { UsersTable } from "./table/UsersTable";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

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
  if (!session) return notFound();
  const { columns, data } = await fetchUsers();

  return (
    <>
      {/* LIST */}
      {JSON.stringify(session.user, null, 4)}
      <UsersTable columns={columns} data={data} />
    </>
  );
}
