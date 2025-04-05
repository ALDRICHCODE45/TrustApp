import { DataTable } from "@/components/Table";
import { logs } from "@/lib/data";
import { type ReactElement } from "react";
import { logsColumns } from "./components/logsColumns";
import { auth } from "@/lib/auth";
import { checkRoleRedirect } from "../../../helpers/checkRoleRedirect";
import { Role } from "@prisma/client";

export interface pageProps {}

export default async function LogsPage({}: pageProps): Promise<ReactElement> {
  const session = await auth();
  checkRoleRedirect(session?.user.role as Role, [Role.Admin]);

  return (
    <>
      {/* LOGS LIST */}
      <DataTable columns={logsColumns} data={logs} />
    </>
  );
}
