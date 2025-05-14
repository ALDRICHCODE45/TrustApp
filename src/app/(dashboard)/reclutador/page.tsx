import { vacantes } from "@/lib/data";
import { type ReactElement } from "react";
import { RecruiterTable } from "../list/reclutamiento/table/RecruiterTable";
import { reclutadorColumns } from "./components/ReclutadorColumns";
import { ToastAlerts } from "@/components/ToastAlerts";
import { checkRoleRedirect } from "../../helpers/checkRoleRedirect";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export interface PageProps {}

export default async function VacantesPage({}: PageProps): Promise<ReactElement> {
  const session = await auth();
  if (!session) {
    redirect("sign/in");
  }
  checkRoleRedirect(session?.user.role as Role, [Role.Admin, Role.reclutador]);

  return (
    <>
      {/* LIST */}
      <ToastAlerts />
      <RecruiterTable columns={reclutadorColumns} data={vacantes} />
    </>
  );
}
