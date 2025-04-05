import { vacantes } from "@/lib/data";
import { type ReactElement } from "react";
import { RecruiterTable } from "../list/reclutamiento/table/RecruiterTable";
import { reclutadorColumns } from "./components/ReclutadorColumns";
import { ToastAlerts } from "@/components/ToastAlerts";
import { checkRoleRedirect } from "../../helpers/checkRoleRedirect";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";

export interface PageProps {}

export default async function VacantesPage({}: PageProps): Promise<ReactElement> {
  const session = await auth();
  checkRoleRedirect(session?.user.role as Role, [Role.Admin, Role.reclutador]);

  return (
    <>
      {/* LIST */}
      <ToastAlerts />
      <RecruiterTable columns={reclutadorColumns} data={vacantes} />
    </>
  );
}
