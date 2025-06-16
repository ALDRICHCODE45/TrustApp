import { DataTable } from "@/components/Table";
import { type ReactElement } from "react";
import { logsColumns } from "./components/logsColumns";
import { auth } from "@/lib/auth";
import { checkRoleRedirect } from "../../../helpers/checkRoleRedirect";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";

export interface pageProps {}

const getLogs = async () => {
  try {
    const leads = await prisma.log.findMany({
      include: {
        autor: true,
      },
    });
    return leads;
  } catch (err) {
    throw new Error("Erro al cargar los leads");
  }
};

export default async function LogsPage({}: pageProps): Promise<ReactElement> {
  const session = await auth();
  if (!session) {
    redirect("sign/in");
  }
  checkRoleRedirect(session?.user.role as Role, [Role.Admin]);
  const logs = await getLogs();

  return (
    <>
      {/* LOGS LIST */}
      <DataTable columns={logsColumns} data={logs} />
    </>
  );
}
