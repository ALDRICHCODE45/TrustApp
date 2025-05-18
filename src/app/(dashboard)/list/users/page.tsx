import { UserColumns } from "./columns";
import { type ReactElement } from "react";
import { UsersTable } from "./table/UsersTable";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { Role } from "@prisma/client";
import { checkRoleRedirect } from "@/app/helpers/checkRoleRedirect";
import { Metadata } from "next";

export interface pageProps {}

const fetchUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });
  return {
    columns: UserColumns,
    data: users,
  };
};

export const metadata: Metadata = {
  title: "Trust | Users",
};

export default async function UserList({}: pageProps): Promise<ReactElement> {
  const session = await auth();

  checkRoleRedirect(session?.user.role as Role, [Role.Admin]);

  const { columns, data } = await fetchUsers();

  return (
    <>
      {/* LIST */}
      <UsersTable columns={columns} data={data} />
    </>
  );
}
